import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorCommissionsController } from './distributor-commissions.controller';
import { DistributorCommissionsService } from './distributor-commissions.service';
import { DistributorCommission } from './entities/distributor-commission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DistributorCommission])],
    controllers: [DistributorCommissionsController],
    providers: [DistributorCommissionsService],
    exports: [DistributorCommissionsService],
})
export class DistributorCommissionsModule {}
