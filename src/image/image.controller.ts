// src/image/image.controller.ts
import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    ParseIntPipe,
    Body,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { Express } from 'express';

class CreateImageDto {
    description?: string;
    youtubeLink?: string;
    youtubeDescription?: string;
}

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
    ) {
        console.log('📥 Image upload request received');
        console.log('📁 File:', file ? { name: file.originalname, size: file.size, mimetype: file.mimetype } : 'No file');
        console.log('📦 Body:', body);
        console.log('📦 Body keys:', Object.keys(body || {}));
        console.log('📦 Description:', body.description);
        console.log('📦 YouTube Link:', body.youtubeLink);
        console.log('📦 YouTube Description:', body.youtubeDescription);
        
        try {
            // Use Google Drive as default storage
            return await this.imageService.createImage(
                file,
                body.description,
                body.youtubeLink,
                body.youtubeDescription,
                'drive'  // Force Google Drive storage
            );
        } catch (error) {
            console.error('❌ Error creating image:', error);
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create image');
        }
    }

    @Get()
    async findAll() {
        try {
            return await this.imageService.getAllImages();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch images');
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.imageService.getImageById(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch image');
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
    ) {
        console.log('📥 Image update request for ID:', id);
        console.log('📁 File:', file ? { name: file.originalname, size: file.size } : 'No new file');
        console.log('📦 Body:', body);
        console.log('📦 Body keys:', Object.keys(body || {}));
        
        try {
            // Use Google Drive as default storage
            return await this.imageService.updateImage(
                id,
                file,
                body.description,
                body.youtubeLink,
                body.youtubeDescription,
                'drive'  // Force Google Drive storage
            );
        } catch (error) {
            console.error('❌ Error updating image:', error);
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update image');
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.imageService.deleteImage(id);
            return { message: 'Image deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete image');
        }
    }
}
