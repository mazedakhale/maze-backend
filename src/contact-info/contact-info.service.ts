import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './entities/contact-info.entity';

@Injectable()
export class ContactInfoService {
    constructor(
        @InjectRepository(ContactInfo)
        private contactInfoRepository: Repository<ContactInfo>,
    ) { }

    // Create a new contact info record
    create(contactInfo: Partial<ContactInfo>): Promise<ContactInfo> {
        console.log('🔨 Creating contact info with data:', contactInfo);
        const newContactInfo = this.contactInfoRepository.create(contactInfo);
        console.log('📝 Created entity:', newContactInfo);
        return this.contactInfoRepository.save(newContactInfo);
    }

    // Get all contact info records
    findAll(): Promise<ContactInfo[]> {
        return this.contactInfoRepository.find();
    }

    // Get a specific contact info record by ID
    async findOne(id: number): Promise<ContactInfo | null> {
        return this.contactInfoRepository.findOne({ where: { id } });
    }

    // Update a specific contact info record
    async update(id: number, contactInfo: Partial<ContactInfo>): Promise<ContactInfo | null> {
        console.log('🔄 Updating contact info ID:', id);
        console.log('📦 Update payload:', contactInfo);
        
        const existingContactInfo = await this.findOne(id);
        if (!existingContactInfo) {
            console.log('❌ Contact info not found with ID:', id);
            return null;
        }
        
        console.log('📋 Existing data:', existingContactInfo);
        
        // Merge existing data with updates
        const updatedData = { ...existingContactInfo, ...contactInfo };
        console.log('🔀 Merged data:', updatedData);
        
        await this.contactInfoRepository.update(id, contactInfo);
        const result = await this.findOne(id);
        
        console.log('✅ Update complete. New data:', result);
        return result;
    }

    // Delete a specific contact info record
    async remove(id: number): Promise<void> {
        await this.contactInfoRepository.delete(id);
    }
}
