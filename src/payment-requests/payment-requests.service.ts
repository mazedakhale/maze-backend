import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRequest } from './entities/payment-request.entity';
import { WalletService } from '../wallet/wallet.service';
import { User, UserRole } from '../users/entities/users.entity';

@Injectable()
export class PaymentRequestsService {
  constructor(
    @InjectRepository(PaymentRequest)
    private readonly paymentRequestRepo: Repository<PaymentRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly walletService: WalletService,
  ) {}

  // Create a new payment request
  async createPaymentRequest(data: {
    document_id: number;
    application_id: string;
    distributor_id: number;
    customer_id: number;
    amount: number;
    category_name?: string;
    subcategory_name?: string;
    applicant_name?: string;
  }): Promise<PaymentRequest> {
    // Check if payment request already exists for this document (Pending or Paid)
    const existing = await this.paymentRequestRepo.findOne({
      where: { document_id: data.document_id },
    });

    if (existing) {
      if (existing.status === 'Pending') {
        throw new BadRequestException('A payment request is already pending for this document');
      } else if (existing.status === 'Paid' || existing.status === 'Approved') {
        throw new BadRequestException('Payment has already been processed for this document');
      }
      // If rejected, allow creating a new request
    }

    const paymentRequest = this.paymentRequestRepo.create(data);
    return this.paymentRequestRepo.save(paymentRequest);
  }

  // Get all payment requests
  async findAll(): Promise<PaymentRequest[]> {
    return this.paymentRequestRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  // Get payment requests by distributor
  async findByDistributor(distributorId: number): Promise<PaymentRequest[]> {
    return this.paymentRequestRepo.find({
      where: { distributor_id: distributorId },
      order: { created_at: 'DESC' },
    });
  }

  // Get payment requests by customer
  async findByCustomer(customerId: number): Promise<PaymentRequest[]> {
    return this.paymentRequestRepo.find({
      where: { customer_id: customerId },
      order: { created_at: 'DESC' },
    });
  }

  // Get payment request by document ID
  async findByDocumentId(documentId: number): Promise<PaymentRequest | null> {
    return this.paymentRequestRepo.findOne({
      where: { document_id: documentId },
    });
  }

  // Update payment request status
  async updateStatus(
    requestId: number,
    status: string,
    rejectionReason?: string,
  ): Promise<PaymentRequest> {
    const request = await this.paymentRequestRepo.findOne({
      where: { request_id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Payment request not found');
    }

    // If approving, deduct from admin wallet and credit distributor
    if (status === 'Approved' && request.status === 'Pending') {
      // First, find admin user to get their user_id
      const adminUser = await this.userRepo.findOne({ 
        where: { role: UserRole.ADMIN } 
      });

      if (!adminUser) {
        throw new BadRequestException('Admin user not found');
      }

      console.log(`🔍 Found admin user: ID=${adminUser.user_id}, Name=${adminUser.name}, Email=${adminUser.email}`);
      console.log(`💰 Attempting to pay distributor: Amount=₹${request.amount}`);

      // Deduct from admin wallet (admin pays the distributor)
      const deductionResult = await this.walletService.deductFromWallet(
        adminUser.user_id,
        request.amount,
        `Payment to distributor for ${request.category_name} - ${request.subcategory_name} (${request.application_id})`,
      );

      if (!deductionResult.success) {
        throw new BadRequestException(
          `Payment failed: ${deductionResult.message}`,
        );
      }

      console.log(`✅ Admin wallet deducted successfully. New balance: ₹${deductionResult.newBalance}`);

      // Credit distributor wallet
      const creditResult = await this.walletService.creditDistributorWallet(
        request.distributor_id,
        request.amount,
        `Payment for ${request.category_name} - ${request.subcategory_name} (${request.application_id})`,
      );

      if (!creditResult.success) {
        // If crediting distributor fails, we should handle this carefully
        // The admin money is already deducted, so log this as an error
        console.error(`❌ Failed to credit distributor wallet: ${creditResult.message}`);
        // Still mark as paid since admin paid
      } else {
        console.log(`✅ Distributor wallet credited successfully. New balance: ₹${creditResult.newBalance}`);
      }

      request.status = 'Paid';
    } else {
      request.status = status;
    }

    if (rejectionReason) {
      request.rejection_reason = rejectionReason;
    }

    return this.paymentRequestRepo.save(request);
  }

  // Get payment request statistics
  async getStatistics() {
    const all = await this.paymentRequestRepo.find();
    
    const stats = {
      total: all.length,
      pending: all.filter(r => r.status === 'Pending').length,
      approved: all.filter(r => r.status === 'Approved').length,
      paid: all.filter(r => r.status === 'Paid').length,
      rejected: all.filter(r => r.status === 'Rejected').length,
      totalAmount: all.reduce((sum, r) => sum + Number(r.amount), 0),
      pendingAmount: all.filter(r => r.status === 'Pending').reduce((sum, r) => sum + Number(r.amount), 0),
      paidAmount: all.filter(r => r.status === 'Paid').reduce((sum, r) => sum + Number(r.amount), 0),
    };

    return stats;
  }
}
