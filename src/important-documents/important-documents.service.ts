import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportantDocument } from './important-document.entity';
import { HybridStorageService } from '../hybridStorageSystem/hybrid-storage.service';

@Injectable()
export class ImportantDocumentsService {
  constructor(
    @InjectRepository(ImportantDocument)
    private readonly importantDocumentRepository: Repository<ImportantDocument>,
    private readonly hybridStorageService: HybridStorageService,
  ) {}

  async findAll(): Promise<ImportantDocument[]> {
    return this.importantDocumentRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findActive(): Promise<ImportantDocument[]> {
    return this.importantDocumentRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ImportantDocument> {
    const doc = await this.importantDocumentRepository.findOne({
      where: { id },
    });

    if (!doc) {
      throw new NotFoundException(`Important document with ID ${id} not found`);
    }

    return doc;
  }

  async create(data: Partial<ImportantDocument>): Promise<ImportantDocument> {
    const doc = this.importantDocumentRepository.create(data);
    return this.importantDocumentRepository.save(doc);
  }

  async createWithFile(
    data: Partial<ImportantDocument>,
    file: Express.Multer.File,
  ): Promise<ImportantDocument> {
    // Upload file using HybridStorageService
    const uploadResult = await this.hybridStorageService.uploadFile(
      file,
      'important-documents',
    );
    
    const doc = this.importantDocumentRepository.create({
      ...data,
      file_url: uploadResult.url,
    });
    
    return this.importantDocumentRepository.save(doc);
  }

  async update(
    id: number,
    data: Partial<ImportantDocument>,
  ): Promise<ImportantDocument> {
    await this.importantDocumentRepository.update(id, data);
    return this.findOne(id);
  }

  async updateWithFile(
    id: number,
    data: Partial<ImportantDocument>,
    file: Express.Multer.File,
  ): Promise<ImportantDocument> {
    const existingDoc = await this.findOne(id);
    
    // Delete old file if it exists
    if (existingDoc.file_url) {
      const oldStorageType = existingDoc.file_url.includes('drive.google.com')
        ? 'drive'
        : 'local';
      await this.hybridStorageService.deleteFile(
        existingDoc.file_url,
        oldStorageType,
      );
    }
    
    // Upload new file
    const uploadResult = await this.hybridStorageService.uploadFile(
      file,
      'important-documents',
    );
    
    await this.importantDocumentRepository.update(id, {
      ...data,
      file_url: uploadResult.url,
    });
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const doc = await this.findOne(id);
    
    // Delete file if it exists
    if (doc.file_url) {
      const storageType = doc.file_url.includes('drive.google.com')
        ? 'drive'
        : 'local';
      await this.hybridStorageService.deleteFile(doc.file_url, storageType);
    }
    
    const result = await this.importantDocumentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Important document with ID ${id} not found`);
    }
  }
}
