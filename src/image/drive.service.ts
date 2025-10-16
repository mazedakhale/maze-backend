import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { Express } from 'express';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

dotenv.config();

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);
  private drive;
  private isAuthenticated = false;

  constructor(private configService: ConfigService) {
    this.logger.log('🚀 Initializing GoogleDriveService with OAuth...');
    
    try {
      // Use OAuth credentials instead of Service Account
      const clientId = this.configService.get('GOOGLE_CLIENT_ID');
      const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
      const refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
      const accessToken = this.configService.get('GOOGLE_ACCESS_TOKEN');
      
      this.logger.log('🔍 Checking OAuth credentials...');
      this.logger.log(`🔑 Client ID: ${!!clientId}`);
      this.logger.log(`🔑 Client Secret: ${!!clientSecret}`);
      this.logger.log(`🎫 Refresh Token: ${!!refreshToken}`);
      this.logger.log(`🎫 Access Token: ${!!accessToken}`);
      
      if (clientId && clientSecret) {
        this.logger.log('🔑 Setting up OAuth credentials');
        const auth = new google.auth.OAuth2(clientId, clientSecret);
        
        if (refreshToken) {
          auth.setCredentials({ refresh_token: refreshToken });
          this.isAuthenticated = true;
          this.logger.log('✅ OAuth authenticated with refresh token');
        } else if (accessToken) {
          auth.setCredentials({ access_token: accessToken });
          this.isAuthenticated = true;
          this.logger.log('✅ OAuth authenticated with access token (temporary)');
        } else {
          this.logger.warn('⚠️ No refresh token or access token found');
          this.logger.warn('👉 Get token from: https://developers.google.com/oauthplayground/');
        }
        
        this.drive = google.drive({ version: 'v3', auth });
      } else {
        this.logger.error('❌ No valid OAuth credentials found');
      }
      
      this.logger.log(`🏁 Final authentication status: ${this.isAuthenticated}`);
    } catch (error) {
      this.logger.error('❌ Failed to initialize Google Drive service:', error);
      this.isAuthenticated = false;
    }
  }

  // Set access token method (for compatibility with existing code)
  setAccessToken(token: string): void {
    try {
      if (this.drive && this.drive.context.auth && typeof this.drive.context.auth.setCredentials === 'function') {
        this.drive.context.auth.setCredentials({ access_token: token });
        this.isAuthenticated = true;
        this.logger.log('✅ OAuth access token set successfully');
      } else {
        this.logger.error('❌ Cannot set access token - drive or auth not properly initialized');
      }
    } catch (error) {
      this.logger.error(`❌ Failed to set access token: ${error.message}`);
    }
  }

  // Upload a file to Google Drive folder
  async uploadFile(file: Express.Multer.File, folder: string = 'users'): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('Google Drive service is not authenticated');
    }

    try {
      const folderId = this.configService.get('GOOGLE_SHARED_DRIVE_ID'); // Using this as folder ID
      
      if (!folderId) {
        this.logger.warn('No folder ID configured, uploading to root');
      }

      const fileMetadata = {
        name: `${Date.now()}_${file.originalname}`,
        parents: folderId ? [folderId] : undefined,
      };

      // Convert buffer to readable stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);

      const media = {
        mimeType: file.mimetype,
        body: bufferStream,
      };

      this.logger.log(`📤 Uploading to Google Drive: File=${file.originalname}, FolderID=${folderId || 'root'}`);
      
      const uploadResponse = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink',
      });

      const fileId = uploadResponse.data.id;
      if (!fileId) {
        throw new Error('Failed to get file ID from Google Drive upload response');
      }

      // Make file publicly accessible
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      this.logger.log(`✅ Upload Successful: File ID=${fileId}`);
      return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch (error) {
      this.logger.error('❌ Google Drive Upload Error:', error);
      throw new InternalServerErrorException(`Google Drive upload failed: ${error.message}`);
    }
  }

  // Upload a file specifically for YouTube content (uses same logic as uploadFile)
  async uploadYouTubeFile(file: Express.Multer.File): Promise<string> {
    this.logger.log('📺 Uploading YouTube file to Google Drive');
    return this.uploadFile(file, 'youtube');
  }

  // Delete a file from Google Drive
  async deleteFile(fileUrl: string): Promise<void> {
    if (!this.isAuthenticated) {
      this.logger.warn('Google Drive service is not authenticated, skipping delete');
      return;
    }

    try {
      const fileId = this.extractFileIdFromUrl(fileUrl);
      if (!fileId) {
        this.logger.warn(`Could not extract file ID from URL: ${fileUrl}`);
        return;
      }

      this.logger.log(`🗑️ Deleting from Google Drive: File ID=${fileId}`);
      await this.drive.files.delete({ fileId });
      this.logger.log(`✅ Deletion Successful: File ID=${fileId}`);
    } catch (error) {
      this.logger.error('❌ Google Drive Delete Error:', error);
    }
  }

  private extractFileIdFromUrl(url: string): string | null {
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /file\/d\/([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }
}
