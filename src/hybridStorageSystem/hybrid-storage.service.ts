import { Injectable, Logger } from '@nestjs/common';
import { GoogleDriveService } from '../image/drive.service';
import { LocalStorageService } from './local-storage.service'; // Import from same folder
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HybridStorageService {
  private readonly logger = new Logger(HybridStorageService.name);
  
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly localStorageService: LocalStorageService, // This should now be from the same folder
    private readonly configService: ConfigService
  ) {}

  async uploadFile(file: Express.Multer.File, folder: string = 'users'): Promise<{ url: string; storage: 'drive' | 'local' }> {
    // Check if we have Google Drive credentials
    const hasServiceAccount = this.configService.get('GOOGLE_SERVICE_ACCOUNT_KEY_FILE');
    const hasAccessToken = this.configService.get('GOOGLE_DRIVE_ACCESS_TOKEN');
    const hasOAuthCredentials = this.configService.get('GOOGLE_CLIENT_ID') && this.configService.get('GOOGLE_CLIENT_SECRET');
    
    if (hasServiceAccount || hasAccessToken || hasOAuthCredentials) {
      try {
        this.logger.log(`Attempting to upload ${file.originalname} to Google Drive`);
        
        if (hasAccessToken && !hasServiceAccount) {
          this.googleDriveService.setAccessToken(hasAccessToken);
        }
        
        const driveUrl = await this.googleDriveService.uploadFile(file, folder);
        this.logger.log(`✅ Successfully uploaded to Google Drive: ${driveUrl}`);
        
        return { url: driveUrl, storage: 'drive' };
      } catch (driveError) {
        this.logger.warn(`❌ Google Drive upload failed: ${driveError.message}`);
        this.logger.log(`🔄 Falling back to local storage for ${file.originalname}`);
      }
    } else {
      this.logger.log(`No Google Drive credentials found, using local storage for ${file.originalname}`);
    }
    
    try {
      const localUrl = await this.localStorageService.uploadFile(file);
      this.logger.log(`✅ Successfully uploaded to local storage: ${localUrl}`);
      
      return { url: localUrl, storage: 'local' };
    } catch (localError) {
      this.logger.error(`❌ Local storage upload also failed: ${localError.message}`);
      throw new Error(`Both Google Drive and local storage failed: ${localError.message}`);
    }
  }

  async deleteFile(fileUrl: string, storageType: 'drive' | 'local'): Promise<void> {
    try {
      if (storageType === 'drive') {
        await this.googleDriveService.deleteFile(fileUrl);
        this.logger.log(`✅ Successfully deleted from Google Drive: ${fileUrl}`);
      } else {
        await this.localStorageService.deleteFile(fileUrl);
        this.logger.log(`✅ Successfully deleted from local storage: ${fileUrl}`);
      }
    } catch (error) {
      this.logger.warn(`❌ Failed to delete file: ${error.message}`);
    }
  }

  private isGoogleDriveUrl(url: string): boolean {
    return url.includes('drive.google.com') || url.includes('drive.usercontent.google.com');
  }

  async updateFile(oldFileUrl: string, newFile: Express.Multer.File, folder: string = 'users'): Promise<{ url: string; storage: 'drive' | 'local' }> {
    const oldStorageType = this.isGoogleDriveUrl(oldFileUrl) ? 'drive' : 'local';
    
    if (oldFileUrl) {
      await this.deleteFile(oldFileUrl, oldStorageType);
    }
    
    return this.uploadFile(newFile, folder);
  }
}