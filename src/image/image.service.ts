// src/image/image.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Image } from './image.entity';
import { S3Service } from './s3.service';
import { GoogleDriveService } from './drive.service';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private readonly s3Service: S3Service,
        private readonly googleDriveService: GoogleDriveService,
        private readonly configService: ConfigService
    ) { }

    async createImage(
        file: Express.Multer.File,
        description?: string,
        youtubeLink?: string,
        youtubeDescription?: string,
        storageType: 's3' | 'drive' = 'drive'
    ): Promise<Image> {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }
        if (youtubeLink && !this.isValidYouTubeUrl(youtubeLink)) {
            throw new BadRequestException('Invalid YouTube URL format');
        }

        // Add file size check
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size too large (max 10MB)');
        }

        try {
            const folder = youtubeLink ? 'youtube' : 'general';
            let imageUrl: string;

            // Choose storage service based on parameter
            if (storageType === 'drive') {
                imageUrl = await this.googleDriveService.uploadFile(file, folder);
            } else {
                imageUrl = await this.s3Service.uploadFile(file, folder);
            }

            const image = new Image();
            image.imageUrl = imageUrl;
            image.description = description ?? null;
            image.youtubeLink = youtubeLink ?? null;
            image.youtubeDescription = youtubeDescription ?? null;
            
            return await this.imageRepository.save(image);
        } catch (error) {
            console.error('Error creating image:', error);
            throw new InternalServerErrorException('Failed to create image');
        }
    }

    async getAllImages(): Promise<Image[]> {
        try {
            return await this.imageRepository.find({ order: { createdAt: 'DESC' } });
        } catch (error) {
            console.error('Error fetching images:', error);
            throw new InternalServerErrorException('Failed to fetch images');
        }
    }

    async getImageById(id: number): Promise<Image> {
        try {
            const image = await this.imageRepository.findOneBy({ id });
            if (!image) throw new NotFoundException(`Image ${id} not found`);
            return image;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error(`Error fetching image ${id}:`, error);
            throw new InternalServerErrorException('Failed to fetch image');
        }
    }

    async updateImage(
        id: number,
        file?: Express.Multer.File,
        description?: string,
        youtubeLink?: string,
        youtubeDescription?: string,
        storageType: 's3' | 'drive' = 'drive'  // Changed default to 'drive'
    ): Promise<Image> {
        console.log('🔄 updateImage called with:', {
            id,
            hasFile: !!file,
            description,
            youtubeLink,
            youtubeDescription,
            storageType
        });

        try {
            const image = await this.imageRepository.findOneBy({ id });
            console.log('📦 Found image:', image ? { id: image.id, imageUrl: image.imageUrl } : 'NOT FOUND');
            
            if (!image) throw new NotFoundException(`Image ${id} not found`);
            
            if (youtubeLink && !this.isValidYouTubeUrl(youtubeLink)) {
                throw new BadRequestException('Invalid YouTube URL format');
            }

            if (file) {
                console.log('📁 Processing file upload...');
                // Add file size check
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    throw new BadRequestException('File size too large (max 10MB)');
                }

                const folder = youtubeLink ?? image.youtubeLink ? 'youtube' : 'general';
                console.log('📂 Upload folder:', folder);
                
                // Delete old file from appropriate service
                if (image.imageUrl) {
                    console.log('🗑️ Deleting old file:', image.imageUrl);
                    try {
                        if (this.isGoogleDriveUrl(image.imageUrl)) {
                            await this.googleDriveService.deleteFile(image.imageUrl);
                        } else {
                            await this.s3Service.deleteFile(image.imageUrl);
                        }
                    } catch (deleteError) {
                        console.warn('⚠️ Failed to delete old file:', deleteError.message);
                    }
                }

                // Upload new file to chosen service
                console.log('☁️ Uploading to:', storageType);
                if (storageType === 'drive') {
                    image.imageUrl = await this.googleDriveService.uploadFile(file, folder);
                } else {
                    image.imageUrl = await this.s3Service.uploadFile(file, folder);
                }
                console.log('✅ New image URL:', image.imageUrl);
            }

            console.log('💾 Updating fields:', {
                description: description ?? image.description,
                youtubeLink: youtubeLink ?? image.youtubeLink,
                youtubeDescription: youtubeDescription ?? image.youtubeDescription
            });

            image.description = description ?? image.description;
            image.youtubeLink = youtubeLink ?? image.youtubeLink;
            image.youtubeDescription = youtubeDescription ?? image.youtubeDescription;
            
            const saved = await this.imageRepository.save(image);
            console.log('✅ Image saved successfully:', saved.id);
            return saved;
        } catch (error) {
            console.error(`❌ Error in updateImage for ID ${id}:`, error);
            console.error('Error stack:', error.stack);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            )
                throw error;
            throw new InternalServerErrorException(`Failed to update image: ${error.message}`);
        }
    }

    async deleteImage(id: number): Promise<void> {
        try {
            const image = await this.imageRepository.findOneBy({ id });
            if (!image) throw new NotFoundException(`Image ${id} not found`);
            
            if (image.imageUrl) {
                // Delete from appropriate service
                if (this.isGoogleDriveUrl(image.imageUrl)) {
                    await this.googleDriveService.deleteFile(image.imageUrl);
                } else {
                    await this.s3Service.deleteFile(image.imageUrl);
                }
            }
            
            await this.imageRepository.remove(image);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error(`Error deleting image ${id}:`, error);
            throw new InternalServerErrorException('Failed to delete image');
        }
    }

    async getImagesWithYoutubeLinks(): Promise<Image[]> {
        try {
            return await this.imageRepository.find({
                where: { youtubeLink: Not(IsNull()) },
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            console.error('Error fetching YouTube images:', error);
            throw new InternalServerErrorException(
                'Failed to fetch YouTube images'
            );
        }
    }

    private isValidYouTubeUrl(url: string): boolean {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return pattern.test(url);
    }

    private isGoogleDriveUrl(url: string): boolean {
        return url.includes('drive.google.com');
    }
}
