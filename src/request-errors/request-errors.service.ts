import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestError } from './entities/request-error.entity';
import { S3Service } from './s3.service';
import { Express } from 'express';

@Injectable()
export class RequestErrorsService {
  constructor(
    @InjectRepository(RequestError)
    private readonly requestErrorRepository: Repository<RequestError>,
    private readonly s3Service: S3Service
  ) {}

  // ✅ Create an error request with file upload
  async createRequest(file: Express.Multer.File, body: any) {
    try {
      if (!file) throw new BadRequestException('Error document is required.');

      const fileUrl = await this.s3Service.uploadFile(file);

      const request = this.requestErrorRepository.create({
        request_description: body.request_description,
        error_document: fileUrl,
        document_id: Number(body.document_id),
        category_id: Number(body.category_id),
        subcategory_id: Number(body.subcategory_id),
        user_id: Number(body.user_id),
        distributor_id: body.distributor_id,
        application_id:body.application_id,
        request_status: 'Pending',
      });

      return await this.requestErrorRepository.save(request);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create error request.');
    }
  }

  // ✅ Get all error requests
  async getAllRequests() {
    return await this.requestErrorRepository.find();
  }

  // ✅ Get request by ID
  async getRequestById(requestId: number) {
    const request = await this.requestErrorRepository.findOne({ where: { request_id: requestId } });
    if (!request) throw new NotFoundException(`Request with ID ${requestId} not found.`);
    return request;
  }

  // ✅ Get requests by Distributor ID
  async getRequestsByDistributorId(distributorId: string) {
    return await this.requestErrorRepository.find({ where: { distributor_id: distributorId } });
  }

  async updateRequestStatus(requestId: number, request_status: string) {
    const request = await this.requestErrorRepository.findOne({ where: { request_id: requestId } });

    if (!request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }

    request.request_status = request_status; // ✅ Update status properly
    return await this.requestErrorRepository.save(request);
  }

  // ✅ Delete a request
  async deleteRequest(requestId: number) {
    const request = await this.getRequestById(requestId);
    await this.requestErrorRepository.remove(request);
    return { message: 'Request deleted successfully' };
  }
}
