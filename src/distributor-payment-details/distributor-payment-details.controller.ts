import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DistributorPaymentDetailsService } from './distributor-payment-details.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('distributor-payment-details')
@UseGuards(JwtAuthGuard)
export class DistributorPaymentDetailsController {
  constructor(
    private readonly paymentDetailsService: DistributorPaymentDetailsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('qr_code'))
  async createOrUpdate(
    @Request() req: any,
    @Body('account_holder_name') accountHolderName?: string,
    @Body('account_number') accountNumber?: string,
    @Body('bank_name') bankName?: string,
    @Body('ifsc_code') ifscCode?: string,
    @Body('upi_id') upiId?: string,
    @UploadedFile() qrCodeFile?: Express.Multer.File,
  ) {
    const distributorId = req.user.userId;
    
    const data = {
      account_holder_name: accountHolderName,
      account_number: accountNumber,
      bank_name: bankName,
      ifsc_code: ifscCode,
      upi_id: upiId,
    };

    try {
      return await this.paymentDetailsService.createOrUpdate(
        distributorId,
        data,
        qrCodeFile,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my-details')
  async getMyDetails(@Request() req: any) {
    const distributorId = req.user.userId;
    return this.paymentDetailsService.findByDistributor(distributorId);
  }

  @Get('distributor/:id')
  async getByDistributor(@Param('id') distributorId: number) {
    return this.paymentDetailsService.findByDistributor(distributorId);
  }

  @Get()
  async findAll() {
    return this.paymentDetailsService.findAll();
  }

  @Delete()
  async delete(@Request() req: any) {
    const distributorId = req.user.userId;
    return this.paymentDetailsService.delete(distributorId);
  }
}