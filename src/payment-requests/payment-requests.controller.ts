import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { PaymentRequestsService } from './payment-requests.service';

@Controller('payment-requests')
export class PaymentRequestsController {
  constructor(private readonly paymentRequestsService: PaymentRequestsService) {}

  // Create a new payment request
  @Post()
  async create(@Body() data: {
    document_id: number;
    application_id: string;
    distributor_id: number;
    customer_id: number;
    amount: number;
    category_name?: string;
    subcategory_name?: string;
    applicant_name?: string;
  }) {
    return this.paymentRequestsService.createPaymentRequest(data);
  }

  // Get all payment requests (admin)
  @Get()
  async findAll() {
    return this.paymentRequestsService.findAll();
  }

  // Get payment request statistics
  @Get('statistics')
  async getStatistics() {
    return this.paymentRequestsService.getStatistics();
  }

  // Get payment requests by distributor
  @Get('distributor/:distributorId')
  async findByDistributor(@Param('distributorId') distributorId: number) {
    return this.paymentRequestsService.findByDistributor(distributorId);
  }

  // Get payment requests by customer
  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: number) {
    return this.paymentRequestsService.findByCustomer(customerId);
  }

  // Get payment request by document ID
  @Get('document/:documentId')
  async findByDocumentId(@Param('documentId') documentId: number) {
    return this.paymentRequestsService.findByDocumentId(documentId);
  }

  // Update payment request status
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() data: { status: string; rejection_reason?: string },
  ) {
    return this.paymentRequestsService.updateStatus(
      id,
      data.status,
      data.rejection_reason,
    );
  }
}
