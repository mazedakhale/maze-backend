import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyPolicy } from './privacy-policy.entity';
import { S3Service } from './s3.service';
import { Express } from 'express';

@Injectable()
export class PrivacyPolicyService {
    constructor(
        @InjectRepository(PrivacyPolicy)
        private privacyPolicyRepository: Repository<PrivacyPolicy>,
        private s3Service: S3Service,
    ) { }

    // Create a new PrivacyPolicy entry
    async create(file: Express.Multer.File): Promise<{ privacyPolicy: PrivacyPolicy; fileUrl: string }> {
        if (!file) {
            throw new BadRequestException('No file uploaded.');
        }

        const fileUrl = await this.s3Service.uploadFile(file);

        const privacyPolicy = this.privacyPolicyRepository.create({
            policyFileUrl: fileUrl,
        });

        await this.privacyPolicyRepository.save(privacyPolicy);

        return { privacyPolicy, fileUrl };
    }
    async findAll(): Promise<PrivacyPolicy[]> {
        try {
            return await this.privacyPolicyRepository.find();
        } catch (error) {
            console.error('Error in findAll service:', error);
            throw new InternalServerErrorException('Failed to fetch privacy policies.');
        }
    }

    // Update an existing PrivacyPolicy entry
    async update(id: number, file: Express.Multer.File): Promise<{ privacyPolicy: PrivacyPolicy; fileUrl: string }> {
        const privacyPolicy = await this.privacyPolicyRepository.findOne({ where: { id } });
        if (!privacyPolicy) {
            throw new NotFoundException('PrivacyPolicy not found');
        }

        const fileUrl = await this.s3Service.updateFile(privacyPolicy.policyFileUrl, file);

        privacyPolicy.policyFileUrl = fileUrl;
        await this.privacyPolicyRepository.save(privacyPolicy);

        return { privacyPolicy, fileUrl };
    }

    // Delete a PrivacyPolicy entry
    async delete(id: number): Promise<void> {
        const privacyPolicy = await this.privacyPolicyRepository.findOne({ where: { id } });
        if (!privacyPolicy) {
            throw new NotFoundException('PrivacyPolicy not found');
        }

        if (privacyPolicy.policyFileUrl) {
            await this.s3Service.deleteFile(privacyPolicy.policyFileUrl);
        }

        await this.privacyPolicyRepository.delete(id);
    }
}