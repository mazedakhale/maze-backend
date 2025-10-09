import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequiredDocumentsService } from './required-documents.service';
import { RequiredDocumentsController } from './required-documents.controller';
import { RequiredDocument } from './required-document.entity';
import { Category } from '../categories/entities/categories.entity';
import { Subcategory } from '../subcategories/entities/subcategories.entity';
import { S3Service } from './s3.service';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequiredDocument, Category, Subcategory]),
    HybridStorageModule, // Import the HybridStorageModule
  ],
  providers: [
    RequiredDocumentsService,
    S3Service,
  ],
  controllers: [RequiredDocumentsController],
})
export class RequiredDocumentsModule {}