import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributorPaymentDetail } from './entities/distributor-payment-detail.entity';
import { HybridStorageService } from '../hybridStorageSystem/hybrid-storage.service';

@Injectable()
export class DistributorPaymentDetailsService {
  constructor(
    @InjectRepository(DistributorPaymentDetail)
    private readonly paymentDetailRepo: Repository<DistributorPaymentDetail>,
    private readonly hybridStorageService: HybridStorageService,
  ) {}

  async createOrUpdate(
    distributorId: number,
    data: {
      account_holder_name?: string;
      account_number?: string;
      bank_name?: string;
      ifsc_code?: string;
      upi_id?: string;
    },
    qrCodeFile?: Express.Multer.File,
  ): Promise<DistributorPaymentDetail> {
    let existing = await this.paymentDetailRepo.findOne({
      where: { distributor_id: distributorId },
    });

    let qrCodeUrl = existing?.qr_code_url;

    // Handle QR code upload
    if (qrCodeFile) {
      try {
        const uploadResult = await this.hybridStorageService.uploadFile(
          qrCodeFile,
          `qr-codes/${distributorId}`,
        );
        qrCodeUrl = uploadResult.url;

        // Delete old QR code if exists
        if (existing?.qr_code_url) {
          try {
            const storageType = existing.qr_code_url.includes('drive.google.com') ? 'drive' : 'local';
            await this.hybridStorageService.deleteFile(existing.qr_code_url, storageType);
          } catch (deleteError) {
            console.warn('Could not delete old QR code:', deleteError.message);
          }
        }
      } catch (error) {
        throw new Error(`Failed to upload QR code: ${error.message}`);
      }
    }

    if (existing) {
      // Update existing
      Object.assign(existing, {
        ...data,
        qr_code_url: qrCodeUrl,
      });
      return this.paymentDetailRepo.save(existing);
    } else {
      // Create new
      const newDetail = this.paymentDetailRepo.create({
        distributor_id: distributorId,
        ...data,
        qr_code_url: qrCodeUrl,
      });
      return this.paymentDetailRepo.save(newDetail);
    }
  }

  async findByDistributor(distributorId: number): Promise<DistributorPaymentDetail | null> {
    return this.paymentDetailRepo.findOne({
      where: { distributor_id: distributorId },
    });
  }

  async findAll(): Promise<DistributorPaymentDetail[]> {
    return this.paymentDetailRepo.find({
      order: { updated_at: 'DESC' },
    });
  }

  async delete(distributorId: number): Promise<{ message: string }> {
    const existing = await this.findByDistributor(distributorId);
    
    if (!existing) {
      throw new NotFoundException('Payment details not found');
    }

    // Delete QR code file if exists
    if (existing.qr_code_url) {
      try {
        const storageType = existing.qr_code_url.includes('drive.google.com') ? 'drive' : 'local';
        await this.hybridStorageService.deleteFile(existing.qr_code_url, storageType);
      } catch (error) {
        console.warn('Could not delete QR code file:', error.message);
      }
    }

    await this.paymentDetailRepo.remove(existing);
    return { message: 'Payment details deleted successfully' };
  }
}