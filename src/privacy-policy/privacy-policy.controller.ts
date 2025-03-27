import {
    Controller,
    Post,
    Put,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    ParseIntPipe,
    NotFoundException,
    InternalServerErrorException,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrivacyPolicyService } from './privacy-policy.service';
import { Express } from 'express';

@Controller('privacy-policy')
export class PrivacyPolicyController {
    constructor(private readonly privacyPolicyService: PrivacyPolicyService) { }

    // Create a new PrivacyPolicy entry
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Express.Multer.File) {
        try {
            return await this.privacyPolicyService.create(file);
        } catch (error) {
            console.error('Error in create controller:', error);
            throw new InternalServerErrorException('Failed to create privacy policy.');
        }
    }

    // Update an existing PrivacyPolicy entry
    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            return await this.privacyPolicyService.update(id, file);
        } catch (error) {
            console.error('Error in update controller:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update privacy policy.');
        }
    }
    @Get()
    async findAll() {
        try {
            return await this.privacyPolicyService.findAll();
        } catch (error) {
            console.error('Error in findAll controller:', error);
            throw new InternalServerErrorException('Failed to fetch privacy policies.');
        }
    }
    // Delete a PrivacyPolicy entry
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.privacyPolicyService.delete(id);
            return { message: 'PrivacyPolicy deleted successfully' };
        } catch (error) {
            console.error('Error in delete controller:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete privacy policy.');
        }
    }
}