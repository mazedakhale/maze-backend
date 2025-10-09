import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate } from './entities/certificates.entity';
import { S3Service } from './s3.service';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    HybridStorageModule, // Import the HybridStorageModule
  ],
  providers: [
    CertificatesService, 
    S3Service,
  ],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
