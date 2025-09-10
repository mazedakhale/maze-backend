// src/wallet/wallet.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Wallet } from './entities/wallet.entity';
import { WalletTopupRequest } from './entities/topup-request.entity';
import { WalletTransaction } from './entities/transaction.entity';
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
}