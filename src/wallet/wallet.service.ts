// src/wallet/wallet.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Wallet } from './entities/wallet.entity';
import { WalletTopupRequest } from './entities/topup-request.entity';
import { WalletTransaction } from './entities/transaction.entity';
import { User, UserRole } from '../users/entities/users.entity';
import { RazorpayService } from '../razorpay/razorpay.service';
import { getEnvVar } from '../utils/env';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepo: Repository<Wallet>,

        @InjectRepository(WalletTopupRequest)
        private readonly requestRepo: Repository<WalletTopupRequest>,

        @InjectRepository(WalletTransaction)
        private readonly txRepo: Repository<WalletTransaction>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        private readonly razorpay: RazorpayService,
    ) { }

    /** 1. Return current balance */
    async getBalance(userId: number): Promise<number> {
        const wallet = await this.walletRepo.findOne({ where: { userId } });
        return wallet?.balance || 0;
    }

    /** 2. Return full transaction history */
    async getTransactions(userId: number): Promise<WalletTransaction[]> {
        const wallet = await this.walletRepo.findOne({ where: { userId } });
        if (!wallet) return [];
        return this.txRepo.find({
            where: { wallet: { id: wallet.id } },
            order: { createdAt: 'DESC' },
        });
    }

    /** Helper to look up a tx by merchantOrderId */
    async findTransactionByMerchantOrderId(merchantOrderId: string) {
        return this.txRepo.findOne({
            where: { merchantOrderId },
            relations: ['wallet'],
        });
    }

    /** 3. Kick off a top-up: record pending TX, then create Razorpay order */
    async initiateTopup(userId: number, amount: number) {
        const merchantOrderId = randomUUID();

        // Save the top-up request
        await this.requestRepo.save(
            this.requestRepo.create({ merchantOrderId, userId, amount })
        );

        // Ensure wallet exists
        let wallet = await this.walletRepo.findOne({ where: { userId } });
        if (!wallet) {
            wallet = this.walletRepo.create({ userId, balance: 0, totalBalance: 0 });
            await this.walletRepo.save(wallet);
        }

        // Record a PENDING transaction (in ₹)
        await this.txRepo.save(
            this.txRepo.create({
                wallet,
                merchantOrderId,
                type: 'CREDIT',
                amount,
                status: 'PENDING',
            })
        );

        // Create Razorpay order (amountPaise)
        const { orderId, amount: amtPaise } = await this.razorpay.createOrder(
            amount,
            merchantOrderId
        );

        // Return what the front end needs, pointing callback to /wallet
        return {
            key: getEnvVar('RAZORPAY_KEY_ID'),
            orderId,
            amount: amtPaise,
            currency: 'INR',
            merchantOrderId,
            callbackUrl: `${getEnvVar('FRONTEND_URL')}/wallet`,
        };
    }

    /** 4. Credit wallet after callback (no status filter) */
    // src/wallet/wallet.service.ts
    async creditFromCallback(payload: {
        merchantOrderId: string;
        transactionId: string;
        state: string;
        amount: number;    // in ₹
        paymentDetails: any[];
    }) {
        console.log('🔔 creditFromCallback called with:', payload);

        const tx = await this.txRepo.findOne({
            where: { merchantOrderId: payload.merchantOrderId },
            relations: ['wallet'],
        });
        if (!tx) {
            console.error(`❌ Transaction not found for ${payload.merchantOrderId}`);
            throw new NotFoundException('Transaction not found');
        }

        console.log(
            `💰 Before: balance=${tx.wallet.balance}, totalBalance=${tx.wallet.totalBalance}`
        );

        // — here’s the crucial change —
        tx.wallet.balance = Number(tx.wallet.balance) + payload.amount;
        tx.wallet.totalBalance = Number(tx.wallet.totalBalance) + payload.amount;
        await this.walletRepo.save(tx.wallet);

        console.log(
            `💰 After: balance=${tx.wallet.balance}, totalBalance=${tx.wallet.totalBalance}`
        );

        tx.transactionId = payload.transactionId;
        tx.status = payload.state;
        tx.paymentDetails = payload.paymentDetails;
        await this.txRepo.save(tx);
        console.log(`✅ Transaction ${tx.merchantOrderId} marked ${tx.status}`);
    }

    /** Check if user has sufficient balance */
    async hasSufficientBalance(userId: number, requiredAmount: number): Promise<{ 
        hasBalance: boolean; 
        currentBalance: number; 
        shortfall?: number; 
    }> {
        const currentBalance = await this.getBalance(userId);
        const hasBalance = currentBalance >= requiredAmount;
        
        return {
            hasBalance,
            currentBalance,
            shortfall: hasBalance ? undefined : requiredAmount - currentBalance
        };
    }

    /** Deduct amount from wallet with transaction safety */
    async deductFromWallet(userId: number, amount: number, description: string = 'Application fee deduction'): Promise<{ success: boolean; newBalance?: number; message?: string }> {
        // Find or create wallet
        let wallet = await this.walletRepo.findOne({ where: { userId } });
        if (!wallet) {
            wallet = this.walletRepo.create({ userId, balance: 0, totalBalance: 0 });
            await this.walletRepo.save(wallet);
        }

        // Convert balance to number for proper comparison
        const currentBalance = Number(wallet.balance);
        
        console.log(`🔍 Deduction check - User ${userId}: Current balance: ₹${currentBalance}, Required: ₹${amount}`);

        // Check if sufficient balance
        if (currentBalance < amount) {
            return { 
                success: false, 
                message: `Insufficient balance. Available: ₹${currentBalance.toFixed(2)}, Required: ₹${amount.toFixed(2)}` 
            };
        }

        // Deduct amount
        wallet.balance = currentBalance - amount;
        await this.walletRepo.save(wallet);

        // Create debit transaction
        await this.txRepo.save(
            this.txRepo.create({
                wallet,
                type: 'DEBIT',
                amount: amount,
                status: 'completed',
                merchantOrderId: null,
                transactionId: null,
                paymentDetails: { description }
            })
        );

        console.log(`✅ Wallet deduction successful: ₹${amount} deducted from user ${userId}, new balance: ₹${wallet.balance}`);

        return { 
            success: true, 
            newBalance: Number(wallet.balance)
        };
    }

    /** Credit amount to admin wallet (for application fees) */
    async creditAdminWallet(amount: number, description: string = 'Application fee received'): Promise<{ success: boolean; newBalance?: number; message?: string }> {
        try {
            // Find admin user (role = 'Admin')
            const adminUser = await this.userRepo.findOne({ where: { role: UserRole.ADMIN } });
            
            if (!adminUser) {
                console.error('❌ Admin user not found');
                return {
                    success: false,
                    message: 'Admin user not found'
                };
            }

            // Find or create admin wallet
            let adminWallet = await this.walletRepo.findOne({ where: { userId: adminUser.user_id } });
            if (!adminWallet) {
                adminWallet = this.walletRepo.create({ 
                    userId: adminUser.user_id, 
                    balance: 0, 
                    totalBalance: 0 
                });
                await this.walletRepo.save(adminWallet);
                console.log(`✅ Created new wallet for admin user ${adminUser.user_id}`);
            }

            // Credit amount to admin wallet
            adminWallet.balance = Number(adminWallet.balance) + amount;
            adminWallet.totalBalance = Number(adminWallet.totalBalance) + amount;
            await this.walletRepo.save(adminWallet);

            // Create credit transaction
            await this.txRepo.save(
                this.txRepo.create({
                    wallet: adminWallet,
                    type: 'CREDIT',
                    amount: amount,
                    status: 'completed',
                    merchantOrderId: null,
                    transactionId: null,
                    paymentDetails: { description }
                })
            );

            console.log(`✅ Admin wallet credited: ₹${amount} added to admin wallet, new balance: ₹${adminWallet.balance}`);

            return {
                success: true,
                newBalance: adminWallet.balance
            };
        } catch (error) {
            console.error('❌ Error crediting admin wallet:', error);
            return {
                success: false,
                message: 'Failed to credit admin wallet'
            };
        }
    }

    /** Credit amount to distributor wallet (for payment requests) */
    async creditDistributorWallet(distributorId: number, amount: number, description: string = 'Payment received'): Promise<{ success: boolean; newBalance?: number; message?: string }> {
        try {
            // Find or create distributor wallet
            let distributorWallet = await this.walletRepo.findOne({ where: { userId: distributorId } });
            if (!distributorWallet) {
                distributorWallet = this.walletRepo.create({ 
                    userId: distributorId, 
                    balance: 0, 
                    totalBalance: 0 
                });
                await this.walletRepo.save(distributorWallet);
                console.log(`✅ Created new wallet for distributor ${distributorId}`);
            }

            // Credit amount to distributor wallet
            distributorWallet.balance = Number(distributorWallet.balance) + amount;
            distributorWallet.totalBalance = Number(distributorWallet.totalBalance) + amount;
            await this.walletRepo.save(distributorWallet);

            // Create credit transaction
            await this.txRepo.save(
                this.txRepo.create({
                    wallet: distributorWallet,
                    type: 'CREDIT',
                    amount: amount,
                    status: 'completed',
                    merchantOrderId: null,
                    transactionId: null,
                    paymentDetails: { description }
                })
            );

            console.log(`✅ Distributor wallet credited: ₹${amount} added to distributor ${distributorId}, new balance: ₹${distributorWallet.balance}`);

            return {
                success: true,
                newBalance: Number(distributorWallet.balance)
            };
        } catch (error) {
            console.error('❌ Error crediting distributor wallet:', error);
            return {
                success: false,
                message: 'Failed to credit distributor wallet'
            };
        }
    }

    // Admin analytics methods
    async getWalletAnalytics() {
        const totalWallets = await this.walletRepo.count();
        const walletsWithBalance = await this.walletRepo
            .createQueryBuilder('wallet')
            .where('wallet.balance > 0')
            .getCount();
        
        const totalBalanceResult = await this.walletRepo
            .createQueryBuilder('wallet')
            .select('SUM(wallet.balance)', 'totalBalance')
            .addSelect('SUM(wallet.totalBalance)', 'totalTopups')
            .getRawOne();

        const recentTransactions = await this.txRepo
            .createQueryBuilder('tx')
            .leftJoinAndSelect('tx.wallet', 'wallet')
            .leftJoinAndSelect('wallet.user', 'user')
            .orderBy('tx.createdAt', 'DESC')
            .take(10)
            .getMany();

        return {
            totalCustomers: totalWallets,
            activeWallets: walletsWithBalance,
            totalBalance: parseFloat(totalBalanceResult?.totalBalance || '0'),
            totalTopups: parseFloat(totalBalanceResult?.totalTopups || '0'),
            recentTransactions
        };
    }

    async getAllCustomerWallets() {
        return this.walletRepo
            .createQueryBuilder('wallet')
            .leftJoinAndSelect('wallet.user', 'user')
            .orderBy('wallet.balance', 'DESC')
            .getMany();
    }

    async getAllTransactions() {
        return this.txRepo
            .createQueryBuilder('tx')
            .leftJoinAndSelect('tx.wallet', 'wallet')
            .leftJoinAndSelect('wallet.user', 'user')
            .orderBy('tx.createdAt', 'DESC')
            .getMany();
    }
}