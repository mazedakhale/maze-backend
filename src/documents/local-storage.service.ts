import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuid()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);
      
      // Write file to local storage
      fs.writeFileSync(filePath, file.buffer);
      
      // Return a local URL that can be accessed by the frontend
      return `/uploads/${fileName}`;
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      
      // Delete file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw new Error(`File delete failed: ${error.message}`);
    }
  }
}
