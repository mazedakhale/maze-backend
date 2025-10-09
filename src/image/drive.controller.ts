import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from './drive.service';

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  // Endpoint to upload a file to Google Drive
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    // Use the user's access token (make sure it's set via OAuth2)
    const fileUrl = await this.googleDriveService.uploadFile(file);
    return `File uploaded successfully: ${fileUrl}`;
  }

  // Endpoint to upload a YouTube file to Google Drive
  @Post('upload-youtube')
  @UseInterceptors(FileInterceptor('file'))
  async uploadYouTubeFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const fileUrl = await this.googleDriveService.uploadYouTubeFile(file);
    return `YouTube file uploaded successfully: ${fileUrl}`;
  }
}
