import { Module } from '@nestjs/common';
import { GoogleDriveService } from './drive.service';
import { GoogleDriveController } from './drive.controller';

@Module({
  providers: [GoogleDriveService],
  controllers: [GoogleDriveController],
})
export class GoogleDriveModule {}
