import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorPaymentDetailsService } from './distributor-payment-details.service';
import { DistributorPaymentDetailsController } from './distributor-payment-details.controller';
import { DistributorPaymentDetail } from './entities/distributor-payment-detail.entity';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistributorPaymentDetail]),
    HybridStorageModule,
    AuthModule,
  ],
  controllers: [DistributorPaymentDetailsController],
  providers: [DistributorPaymentDetailsService],
  exports: [DistributorPaymentDetailsService],
})
export class DistributorPaymentDetailsModule {}