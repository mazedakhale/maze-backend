import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { ContactInfo } from './entities/contact-info.entity';

@Controller('contact-info')
export class ContactInfoController {
    constructor(private readonly contactInfoService: ContactInfoService) { }

    @Post()
    async create(@Body() createDto: any) {
        console.log('📥 Received contact info create request:', createDto);
        console.log('📦 Body keys:', Object.keys(createDto));
        console.log('📦 Body values:', JSON.stringify(createDto, null, 2));
        
        // Ensure all required fields are present
        if (!createDto.phone || !createDto.email || !createDto.address) {
            throw new BadRequestException('Phone, email, and address are required');
        }
        
        const result = await this.contactInfoService.create(createDto);
        console.log('✅ Created contact info:', result);
        return result;
    }

    @Get()
    async findAll() {
        return await this.contactInfoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const contactInfo = await this.contactInfoService.findOne(id);
        if (!contactInfo) {
            throw new NotFoundException(`Contact info with ID ${id} not found`);
        }
        return contactInfo;
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateDto: any) {
        console.log('📥 Received contact info update request for ID:', id);
        console.log('📦 Update data:', JSON.stringify(updateDto, null, 2));
        console.log('📦 Body keys:', Object.keys(updateDto || {}));
        
        // Validate that at least one field is being updated
        if (!updateDto || Object.keys(updateDto).length === 0) {
            throw new BadRequestException('No data provided for update');
        }
        
        if (!updateDto.phone && !updateDto.email && !updateDto.address && !updateDto.description) {
            throw new BadRequestException('At least one field (phone, email, address, or description) must be provided for update');
        }
        
        // Remove undefined/null values to prevent overwriting with empty data
        const cleanData = Object.fromEntries(
            Object.entries(updateDto).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
        
        console.log('🧹 Cleaned update data:', JSON.stringify(cleanData, null, 2));
        
        const updatedContactInfo = await this.contactInfoService.update(id, cleanData);
        if (!updatedContactInfo) {
            throw new NotFoundException(`Contact info with ID ${id} not found`);
        }
        
        console.log('✅ Updated successfully:', JSON.stringify(updatedContactInfo, null, 2));
        return updatedContactInfo;
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        const contactInfo = await this.contactInfoService.findOne(id);
        if (!contactInfo) {
            throw new NotFoundException(`Contact info with ID ${id} not found`);
        }
        await this.contactInfoService.remove(id);
        return { message: 'Deleted successfully' };
    }
}
