import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalStorageService } from './local-storage.service'; // Import from same folder
import { HybridStorageService } from './hybrid-storage.service';
import { GoogleDriveService } from '../image/drive.service';

@Module({
  imports: [ConfigModule],
  providers: [
    LocalStorageService,
    GoogleDriveService, 
    HybridStorageService
  ],
  exports: [
    LocalStorageService, 
    GoogleDriveService, 
    HybridStorageService
  ],
})
export class HybridStorageModule {} // Fix the module name from UsersModule to HybridStorageModule
