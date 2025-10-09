// privacy-policy.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyPolicy, PolicyType } from './privacy-policy.entity';
import { HybridStorageService } from '../hybridStorageSystem/hybrid-storage.service'; // Add HybridStorageService
import { Express } from 'express';

@Injectable()
export class PrivacyPolicyService {
    constructor(
        @InjectRepository(PrivacyPolicy)
        private privacyPolicyRepository: Repository<PrivacyPolicy>,
        private hybridStorageService: HybridStorageService, // Add HybridStorageService
    ) { }

    async create(
        file: Express.Multer.File,
        policyType: PolicyType,
    ): Promise<{ privacyPolicy: PrivacyPolicy; fileUrl: string }> {
        if (!file) {
            throw new BadRequestException('No file uploaded.');
        }
        
        // ✅ Use HybridStorageService and extract URL
        const uploadResult = await this.hybridStorageService.uploadFile(file);
        const fileUrl = uploadResult.url; // Extract just the URL string

        const privacyPolicy = this.privacyPolicyRepository.create({
            policyFileUrl: fileUrl,
            policyType,
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
    
    async findByType(policyType: PolicyType): Promise<PrivacyPolicy[]> {
        try {
            return await this.privacyPolicyRepository.find({
                where: { policyType },
                order: { createdAt: 'DESC' },
            });
        } catch (err) {
            console.error('Error in findByType service:', err);
            throw new InternalServerErrorException('Failed to fetch policies by type.');
        }
    }

    async delete(id: number): Promise<void> {
        const policy = await this.privacyPolicyRepository.findOne({ where: { id } });
        if (!policy) {
            throw new NotFoundException('PrivacyPolicy not found');
        }
        
        // ✅ Use existing HybridStorageService deleteFile method
        if (policy.policyFileUrl) {
            try {
                // Determine storage type from URL
                const storageType = policy.policyFileUrl.includes('drive.google.com') ? 'drive' : 'local';
                await this.hybridStorageService.deleteFile(policy.policyFileUrl, storageType);
                console.log('✅ Policy file deleted successfully');
            } catch (error) {
                console.warn('⚠️ Could not delete policy file, but proceeding with database deletion:', error.message);
                // Continue with database deletion even if file deletion fails
            }
        }
        
        await this.privacyPolicyRepository.delete(id);
    }

    // ✅ Use the existing updateFile method for cleaner file management
    async updatePolicyFile(
        policy: PrivacyPolicy,
        newFile: Express.Multer.File
    ): Promise<string> {
        // ✅ Use the existing updateFile method that handles both deletion and upload
        const uploadResult = await this.hybridStorageService.updateFile(
            policy.policyFileUrl, // old file URL
            newFile,              // new file
            'policies'            // folder name
        );
        
        return uploadResult.url;
    }

    // ✅ Updated update method to use the helper
    async update(
        id: number,
        file: Express.Multer.File,
        policyType: PolicyType,
    ): Promise<{ privacyPolicy: PrivacyPolicy; fileUrl: string }> {
        const policy = await this.privacyPolicyRepository.findOne({ where: { id } });
        if (!policy) {
            throw new NotFoundException('PrivacyPolicy not found');
        }

        // ✅ Use the helper method that leverages existing hybrid storage functionality
        const fileUrl = await this.updatePolicyFile(policy, file);

        policy.policyFileUrl = fileUrl;
        policy.policyType = policyType;
        await this.privacyPolicyRepository.save(policy);

        return { privacyPolicy: policy, fileUrl };
    }
}
