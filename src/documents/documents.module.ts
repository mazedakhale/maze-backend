import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/documents.entity';
import { LocalStorageService } from './local-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentsService, LocalStorageService],
  controllers: [DocumentsController],
})
export class DocumentsModule { }
