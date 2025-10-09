import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyPolicyService } from './privacy-policy.service';
import { PrivacyPolicyController } from './privacy-policy.controller';
import { PrivacyPolicy } from './privacy-policy.entity';
import { S3Service } from './s3.service';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivacyPolicy]),
    HybridStorageModule, // Import the HybridStorageModule
  ],
  providers: [
    PrivacyPolicyService,
    S3Service,
  ],
  controllers: [PrivacyPolicyController],
})
export class PrivacyPolicyModule {}