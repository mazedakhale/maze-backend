import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/entities/documents.entity';
import { Certificate } from 'src/certificates/entities/certificates.entity';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as archiver from 'archiver';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { google } from 'googleapis';

@Injectable()
export class DownloadService {
  private s3 = new S3();
  private s3Bucket: string;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,

    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,

    private readonly configService: ConfigService,
  ) {
    this.s3Bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME') || 'default-bucket-name';
  }

  // ✅ New method to determine storage type
  private getStorageType(fileUrl: string): 'drive' | 'local' | 's3' {
    if (fileUrl.includes('drive.google.com') || fileUrl.includes('drive.usercontent.google.com')) {
      return 'drive';
    } else if (fileUrl.includes('localhost') || fileUrl.includes('127.0.0.1') || fileUrl.startsWith('/uploads')) {
      return 'local';
    } else if (fileUrl.includes('s3.') || fileUrl.includes('amazonaws.com')) {
      return 's3';
    }
    return 'local'; // Default to local
  }

  // ✅ Enhanced method to add files from different storage types to ZIP
  async addFileToZip(archive: archiver.Archiver, fileUrl: string, folderPath: string, fileNamePrefix: string) {
    if (!fileUrl) {
      console.warn(`⚠️ Empty file URL provided for ${fileNamePrefix}`);
      return;
    }

    const storageType = this.getStorageType(fileUrl);
    console.log(`📁 Processing ${fileNamePrefix} from ${storageType} storage: ${fileUrl}`);

    try {
      let fileBuffer: Buffer;
      let fileExtension = '';

      switch (storageType) {
        case 'drive':
          ({ buffer: fileBuffer, extension: fileExtension } = await this.downloadFromGoogleDrive(fileUrl));
          break;
        case 'local':
          ({ buffer: fileBuffer, extension: fileExtension } = await this.downloadFromLocal(fileUrl));
          break;
        case 's3':
          ({ buffer: fileBuffer, extension: fileExtension } = await this.downloadFromS3(fileUrl));
          break;
        default:
          throw new Error(`Unsupported storage type: ${storageType}`);
      }

      if (fileBuffer && fileBuffer.length > 0) {
        const fileName = `${folderPath}${fileNamePrefix}${fileExtension}`;
        archive.append(fileBuffer, { name: fileName });
        console.log(`✅ Added ${fileName} to ZIP (${fileBuffer.length} bytes)`);
      } else {
        console.warn(`⚠️ Empty file buffer for ${fileNamePrefix}`);
      }
    } catch (error) {
      console.error(`❌ Failed to add ${fileNamePrefix} to ZIP:`, error.message);
      // Don't throw error, just log it and continue with other files
    }
  }

  // ✅ Enhanced Google Drive download with better error handling
  private async downloadFromGoogleDrive(fileUrl: string): Promise<{ buffer: Buffer; extension: string }> {
    try {
      console.log(`🔄 Downloading from Google Drive: ${fileUrl}`);
      
      // Extract file ID from various Google Drive URL formats
      let fileId = '';
      
      if (fileUrl.includes('/file/d/')) {
        const match = fileUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        fileId = match ? match[1] : '';
      } else if (fileUrl.includes('id=')) {
        const match = fileUrl.match(/id=([a-zA-Z0-9-_]+)/);
        fileId = match ? match[1] : '';
      } else if (fileUrl.includes('/preview')) {
        const match = fileUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)\/preview/);
        fileId = match ? match[1] : '';
      }

      if (!fileId) {
        throw new Error('Could not extract file ID from Google Drive URL');
      }

      console.log(`📋 Extracted file ID: ${fileId}`);

      // Try multiple download methods
      let response;
      const downloadUrls = [
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
        `https://docs.google.com/uc?export=download&id=${fileId}`
      ];

      for (const downloadUrl of downloadUrls) {
        try {
          console.log(`🔄 Trying download URL: ${downloadUrl}`);
          
          response = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            timeout: 60000, // 60 seconds timeout
            maxContentLength: 50 * 1024 * 1024, // 50MB max
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            // Handle redirects
            maxRedirects: 5,
            validateStatus: (status) => status >= 200 && status < 400
          });

          if (response.status === 200 && response.data) {
            console.log(`✅ Successfully downloaded from: ${downloadUrl}`);
            break;
          }
        } catch (urlError) {
          console.warn(`⚠️ Failed with URL ${downloadUrl}:`, urlError.message);
          continue;
        }
      }

      if (!response || response.status !== 200 || !response.data) {
        throw new Error(`Failed to download from Google Drive after trying multiple URLs`);
      }

      const buffer = Buffer.from(response.data);
      
      if (buffer.length === 0) {
        throw new Error('Downloaded file is empty');
      }

      console.log(`📊 Downloaded file size: ${buffer.length} bytes`);
      
      // Try to determine file extension from Content-Type or URL
      let extension = '';
      const contentType = response.headers['content-type'];
      
      if (contentType) {
        if (contentType.includes('pdf')) extension = '.pdf';
        else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = '.jpg';
        else if (contentType.includes('png')) extension = '.png';
        else if (contentType.includes('gif')) extension = '.gif';
        else if (contentType.includes('webp')) extension = '.webp';
        else if (contentType.includes('image')) extension = '.jpg'; // Default for images
      }

      // Fallback: try to extract from original URL
      if (!extension) {
        const urlExtension = path.extname(fileUrl);
        extension = urlExtension || '.pdf'; // Default to PDF
      }

      console.log(`📝 File extension detected: ${extension}`);

      return { buffer, extension };
    } catch (error) {
      console.error('❌ Error downloading from Google Drive:', error.message);
      throw new Error(`Google Drive download failed: ${error.message}`);
    }
  }

  // ✅ Download from local storage
  private async downloadFromLocal(fileUrl: string): Promise<{ buffer: Buffer; extension: string }> {
    try {
      let filePath = '';
      
      if (fileUrl.startsWith('http')) {
        // Extract path from full URL
        const url = new URL(fileUrl);
        filePath = path.join(process.cwd(), url.pathname);
      } else {
        // Relative path
        filePath = path.join(process.cwd(), fileUrl);
      }

      // Normalize path
      filePath = path.normalize(filePath);

      console.log(`📁 Local file path: ${filePath}`);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Local file not found: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      console.log(`📊 Local file size: ${stats.size} bytes`);

      const buffer = fs.readFileSync(filePath);
      const extension = path.extname(filePath);

      return { buffer, extension };
    } catch (error) {
      console.error('❌ Error downloading from local storage:', error.message);
      throw error;
    }
  }

  // ✅ Download from S3 (existing logic)
  private async downloadFromS3(fileUrl: string): Promise<{ buffer: Buffer; extension: string }> {
    const s3Bucket = this.s3Bucket;
    let s3Key = fileUrl.trim();

    // Extract only the object key from the full S3 URL
    const baseUrl1 = `https://${s3Bucket}.s3.ap-south-1.amazonaws.com/`;
    const baseUrl2 = `https://s3.ap-south-1.amazonaws.com/${s3Bucket}/`;

    if (s3Key.startsWith(baseUrl1)) {
      s3Key = s3Key.replace(baseUrl1, '');
    } else if (s3Key.startsWith(baseUrl2)) {
      s3Key = s3Key.replace(baseUrl2, '');
    }

    // Decode URL-encoded characters
    s3Key = decodeURIComponent(s3Key);
    s3Key = s3Key.replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '');

    try {
      // Check if the file exists in S3
      await this.s3.headObject({ Bucket: s3Bucket, Key: s3Key }).promise();

      // Fetch the file from S3
      const s3Object = await this.s3.getObject({ Bucket: s3Bucket, Key: s3Key }).promise();

      if (!s3Object.Body) {
        throw new Error('Empty file body from S3');
      }

      const buffer = s3Object.Body as Buffer;
      const extension = path.extname(s3Key) || '';

      return { buffer, extension };
    } catch (error) {
      console.error('❌ Error downloading from S3:', error.message);
      throw error;
    }
  }

  // ✅ Main method for downloading all documents
  async allDocuments(documentId: number, res: Response) {
    try {
      console.log(`🔄 Starting download process for document ID: ${documentId}`);

      // 1️⃣ Fetch Document, Receipts, and Certificates from Database
      const document = await this.documentRepository.findOne({ where: { document_id: documentId } });
      if (!document) {
        throw new NotFoundException('Document not found');
      }

      // Fetch certificates associated with the document
      const certificates = await this.certificateRepository.find({ where: { document_id: documentId } });

      // 2️⃣ Extract APPLICANT NAME from document_fields
      const documentFields = document.document_fields;
      let applicantName = 'Unknown_Applicant';

      if (Array.isArray(documentFields)) {
        const applicantField = documentFields.find(
          (field) => field.field_name === 'APPLICANT NAME',
        );
        if (applicantField) {
          applicantName = applicantField.field_value;
        }
      } else if (typeof documentFields === 'object' && documentFields !== null) {
        // Handle object format
        applicantName = String(documentFields['APPLICANT NAME'] || document.name || 'Unknown_Applicant');
      } else {
        applicantName = document.name || 'Unknown_Applicant';
      }

      // Clean the applicant name for filename
      applicantName = applicantName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');

      // 3️⃣ Setup Response Headers for ZIP Download
      const zipFileName = `${applicantName}_${documentId}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
      res.setHeader('Cache-Control', 'no-cache');

      // 4️⃣ Initialize Archiver for ZIP Creation
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Set up event handlers
      archive.on('warning', (err) => {
        console.warn('⚠️ Archiver Warning:', err.message);
      });

      archive.on('error', (err) => {
        console.error('❌ Archiver Error:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to create ZIP archive' });
        }
      });

      archive.on('end', () => {
        console.log('✅ ZIP file has been sent successfully.');
      });

      // Pipe the archive to the response
      archive.pipe(res);

      // 5️⃣ Add Documents to ZIP
      if (document.documents && document.documents.length > 0) {
        console.log(`📄 Processing ${document.documents.length} documents`);
        for (const [index, doc] of document.documents.entries()) {
          await this.addFileToZip(
            archive, 
            doc.file_path, 
            'documents/', 
            `${index + 1}_${doc.document_type.replace(/[^a-zA-Z0-9]/g, '_')}`
          );
        }
      }

      // 6️⃣ Add Receipt to ZIP
      if (document.receipt_url) {
        console.log(`🧾 Processing receipt`);
        await this.addFileToZip(
          archive, 
          document.receipt_url, 
          'receipts/', 
          'Receipt'
        );
      }

      // 7️⃣ Add Certificates to ZIP
      if (certificates && certificates.length > 0) {
        console.log(`📜 Processing ${certificates.length} certificates`);
        for (const [index, certificate] of certificates.entries()) {
          await this.addFileToZip(
            archive, 
            certificate.file_url, 
            'certificates/', 
            `${index + 1}_Certificate_${certificate.application_id}`
          );
        }
      }

      // 8️⃣ Finalize the ZIP
      await archive.finalize();

    } catch (err) {
      console.error('❌ Error during download process:', err);

      if (!res.headersSent) {
        if (err instanceof NotFoundException) {
          res.status(404).json({ message: err.message });
        } else {
          res.status(500).json({ message: 'Failed to download documents and files' });
        }
      } else {
        res.end();
      }
    }
  }

  // ✅ Remove this method since it's redundant with allDocuments
  // OR implement it if you need a different behavior
  async downloadDocuments(documentId: number, res: Response) {
    // This method is essentially the same as allDocuments
    // You can either remove it or make it call allDocuments
    return this.allDocuments(documentId, res);
  }
}