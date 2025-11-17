import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { ContactInfo } from './entities/contact-info.entity';

// DTO classes with validation decorators
class CreateContactInfoDto {
    phone: string;
    email: string;
    address: string;
    description?: string;
}

class UpdateContactInfoDto {
    phone?: string;
    email?: string;
    address?: string;
    description?: string;
}

@Controller('contact-info')
export class ContactInfoController {
    constructor(private readonly contactInfoService: ContactInfoService) { }

    @Post()
    async create(@Body() contactInfo: CreateContactInfoDto) {
        return await this.contactInfoService.create(contactInfo as any);
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
    async update(@Param('id') id: number, @Body() contactInfo: UpdateContactInfoDto) {
        console.log('📥 Received contact info update request:', contactInfo);
        const updatedContactInfo = await this.contactInfoService.update(id, contactInfo as any);
        if (!updatedContactInfo) {
            throw new NotFoundException(`Contact info with ID ${id} not found`);
        }
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
