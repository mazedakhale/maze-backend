import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportantDocumentsController } from './important-documents.controller';
import { ImportantDocumentsService } from './important-documents.service';
import { ImportantDocument } from './important-document.entity';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportantDocument]),
    HybridStorageModule, // Import the HybridStorageModule
  ],
  controllers: [ImportantDocumentsController],
  providers: [ImportantDocumentsService],
  exports: [ImportantDocumentsService],
})
export class ImportantDocumentsModule {}
