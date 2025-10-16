import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/documents.entity';
import { HybridStorageModule } from '../hybridStorageSystem/hybrid-storage.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    HybridStorageModule, // Import the HybridStorageModule
    WalletModule, // Import WalletModule for wallet deduction
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
