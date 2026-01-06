import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequiredDocument } from './required-document.entity';
import { Category } from '../categories/entities/categories.entity';
import { Subcategory } from '../subcategories/entities/subcategories.entity';
import { S3Service } from './s3.service';
import { HybridStorageService } from '../hybridStorageSystem/hybrid-storage.service';
import { DeletionCodeService } from '../common/deletion-code.service';
import { Express } from 'express';

@Injectable()
export class RequiredDocumentsService {
    constructor(
        @InjectRepository(RequiredDocument)
        private readonly requiredDocumentRepository: Repository<RequiredDocument>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,
        
        private readonly s3Service: S3Service, // Keep for backward compatibility
        private readonly hybridStorageService: HybridStorageService, // Add HybridStorageService
        private readonly deletionCodeService: DeletionCodeService,
    ) { }

    async create(
        categoryId: number,
        subcategoryId: number,
        documentNames: string,
        file: Express.Multer.File,
    ): Promise<{ document: RequiredDocument; fileUrl: string }> {
        try {
            // Step 1: Validate category and subcategory
            const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
            if (!category) {
                throw new NotFoundException('Category not found');
            }

            const subcategory = await this.subcategoryRepository.findOne({ where: { subcategory_id: subcategoryId } });
            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }

            // Step 2: Create the RequiredDocument entry
            const requiredDocument = this.requiredDocumentRepository.create({
                category,
                subcategory,
                document_names: documentNames,
            });
            await this.requiredDocumentRepository.save(requiredDocument);

            // Step 3: Validate the file
            if (!file) {
                throw new BadRequestException('No file uploaded.');
            }

            // Step 4: ✅ Upload the file using HybridStorageService and extract URL
            const uploadResult = await this.hybridStorageService.uploadFile(file);
            const fileUrl = uploadResult.url; // Extract just the URL string

            // Step 5: Update the file_url field in the RequiredDocument
            requiredDocument.file_url = fileUrl;
            await this.requiredDocumentRepository.save(requiredDocument);

            console.log('✅ Required document created successfully with hybrid storage');
            // Return the combined result
            return { document: requiredDocument, fileUrl };
        } catch (error) {
            console.error('❌ Error in createAndUpload service:', error);
            throw new InternalServerErrorException('Failed to create and upload document.');
        }
    }

    async findAll(): Promise<RequiredDocument[]> {
        return this.requiredDocumentRepository.find({ relations: ['category', 'subcategory'] });
    }

    async findOne(id: number): Promise<RequiredDocument> {
        const requiredDocument = await this.requiredDocumentRepository.findOne({
            where: { id },
            relations: ['category', 'subcategory'],
        });
        if (!requiredDocument) {
            throw new NotFoundException('Required Document not found');
        }
        return requiredDocument;
    }

    async updateDocumentName(id: number, documentNames: string): Promise<RequiredDocument> {
        const requiredDocument = await this.findOne(id);
        requiredDocument.document_names = documentNames;
        return this.requiredDocumentRepository.save(requiredDocument);
    }

    async remove(id: number, code?: string): Promise<{ message: string }> {
        // Verify deletion code if provided
        if (code) {
            await this.deletionCodeService.verifyStaticCode(code);
        }

        const requiredDocument = await this.findOne(id);
        
        // ✅ Delete associated file using HybridStorageService before removing the record
        if (requiredDocument.file_url) {
            try {
                const storageType = requiredDocument.file_url.includes('drive.google.com') ? 'drive' : 'local';
                await this.hybridStorageService.deleteFile(requiredDocument.file_url, storageType);
                console.log('✅ Required document file deleted successfully');
            } catch (error) {
                console.warn('⚠️ Could not delete required document file:', error.message);
                // Continue with database deletion even if file deletion fails
            }
        }
        
        await this.requiredDocumentRepository.remove(requiredDocument);
        return { message: 'Required Document deleted successfully' };
    }

    async findByCategoryAndSubcategory(categoryId: number, subcategoryId: number): Promise<RequiredDocument[]> {
        return this.requiredDocumentRepository.find({
            where: {
                category: { category_id: categoryId },
                subcategory: { subcategory_id: subcategoryId },
            },
            relations: ['category', 'subcategory'],
        });
    }

    async update(
        id: number,
        categoryId: number,
        subcategoryId: number,
        documentNames: string,
        file: Express.Multer.File,
    ): Promise<{ document: RequiredDocument; fileUrl: string }> {
        try {
            // Step 1: Find the existing document
            const requiredDocument = await this.findOne(id);

            // Step 2: Validate category and subcategory
            const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
            if (!category) {
                throw new NotFoundException('Category not found');
            }

            const subcategory = await this.subcategoryRepository.findOne({ where: { subcategory_id: subcategoryId } });
            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }

            // Step 3: Update the document fields
            requiredDocument.category = category;
            requiredDocument.subcategory = subcategory;
            requiredDocument.document_names = documentNames;

            // Step 4: ✅ If a file is provided, use hybrid storage for file management
            if (file) {
                // ✅ Delete old file if it exists
                if (requiredDocument.file_url) {
                    try {
                        const storageType = requiredDocument.file_url.includes('drive.google.com') ? 'drive' : 'local';
                        await this.hybridStorageService.deleteFile(requiredDocument.file_url, storageType);
                        console.log('✅ Old required document file deleted successfully');
                    } catch (error) {
                        console.warn('⚠️ Could not delete old required document file:', error.message);
                    }
                }

                // ✅ Upload new file using HybridStorageService and extract URL
                const uploadResult = await this.hybridStorageService.uploadFile(file);
                const fileUrl = uploadResult.url; // Extract just the URL string
                requiredDocument.file_url = fileUrl;
            }

            // Step 5: Save the updated document
            await this.requiredDocumentRepository.save(requiredDocument);

            console.log('✅ Required document updated successfully with hybrid storage');
            // Return the updated document and file URL
            return { document: requiredDocument, fileUrl: requiredDocument.file_url };
        } catch (error) {
            console.error('❌ Error in update service:', error);
            throw new InternalServerErrorException('Failed to update document.');
        }
    }

    // ✅ New method to update only the file using hybrid storage
    async updateDocumentFile(id: number, file: Express.Multer.File): Promise<{ document: RequiredDocument; fileUrl: string }> {
        try {
            const requiredDocument = await this.findOne(id);

            if (!file) {
                throw new BadRequestException('No file uploaded.');
            }

            // ✅ Delete old file if it exists
            if (requiredDocument.file_url) {
                try {
                    const storageType = requiredDocument.file_url.includes('drive.google.com') ? 'drive' : 'local';
                    await this.hybridStorageService.deleteFile(requiredDocument.file_url, storageType);
                    console.log('✅ Old required document file deleted successfully');
                } catch (error) {
                    console.warn('⚠️ Could not delete old required document file:', error.message);
                }
            }

            // ✅ Upload new file using HybridStorageService and extract URL
            const uploadResult = await this.hybridStorageService.uploadFile(file);
            const fileUrl = uploadResult.url; // Extract just the URL string

            // Update the file URL
            requiredDocument.file_url = fileUrl;
            await this.requiredDocumentRepository.save(requiredDocument);

            console.log('✅ Required document file updated successfully');
            return { document: requiredDocument, fileUrl };
        } catch (error) {
            console.error('❌ Error in updateDocumentFile service:', error);
            throw new InternalServerErrorException('Failed to update document file.');
        }
    }

    // ✅ Enhanced method using the existing updateFile functionality
    async updateDocumentFileWithHybridUpdate(id: number, file: Express.Multer.File): Promise<{ document: RequiredDocument; fileUrl: string }> {
        try {
            const requiredDocument = await this.findOne(id);

            if (!file) {
                throw new BadRequestException('No file uploaded.');
            }

            // ✅ Use the existing updateFile method that handles both deletion and upload
            const uploadResult = await this.hybridStorageService.updateFile(
                requiredDocument.file_url, // old file URL
                file,                      // new file
                'required-documents'       // folder name
            );

            // Update the file URL
            requiredDocument.file_url = uploadResult.url;
            await this.requiredDocumentRepository.save(requiredDocument);

            console.log('✅ Required document file updated successfully using hybrid update');
            return { document: requiredDocument, fileUrl: uploadResult.url };
        } catch (error) {
            console.error('❌ Error in updateDocumentFileWithHybridUpdate service:', error);
            throw new InternalServerErrorException('Failed to update document file.');
        }
    }
}