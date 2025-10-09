import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Image } from './image.entity';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { S3Service } from './s3.service';
import { GoogleDriveService } from './drive.service'; // Make sure this import exists
import { GoogleDriveController } from './drive.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ConfigModule
  ],
  providers: [
    ImageService, 
    S3Service,
    GoogleDriveService // Add this line to providers array
  ],
  controllers: [ImageController,GoogleDriveController],
  exports: [ImageService],
})
export class ImageModule {}
