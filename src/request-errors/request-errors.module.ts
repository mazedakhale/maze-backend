// request-errors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RequestErrorsService } from './request-errors.service';
import { RequestErrorsController } from './request-errors.controller';
import { RequestError } from './entities/request-error.entity';
import { S3Service } from './s3.service';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestError]),
    HybridStorageModule, // Import the HybridStorageModule
  ],
  providers: [
    RequestErrorsService,
    S3Service,
  ],
  controllers: [RequestErrorsController],
})
export class RequestErrorsModule {}