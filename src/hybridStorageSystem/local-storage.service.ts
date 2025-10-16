import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.baseUrl = this.configService.get('BASE_URL', ' http://72.60.206.65:3000');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log('📁 Created uploads directory');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    
    try {
      fs.writeFileSync(filepath, file.buffer);
      const fileUrl = `${this.baseUrl}/uploads/${filename}`;
      
      this.logger.log(`✅ Local upload successful: ${filename}`);
      return fileUrl;
    } catch (error) {
      this.logger.error(`❌ Local upload failed: ${error.message}`);
      throw new Error(`Local file upload failed: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      let filename: string;
      
      if (fileUrl.includes('/uploads/')) {
        filename = fileUrl.split('/uploads/')[1];
      } else {
        filename = path.basename(fileUrl);
      }
      
      const filePath = path.join(this.uploadDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`✅ Local file deleted: ${filename}`);
      } else {
        this.logger.warn(`⚠️ Local file not found: ${filename}`);
      }
    } catch (error) {
      this.logger.error(`❌ Local file deletion failed: ${error.message}`);
      throw error;
    }
  }
}
