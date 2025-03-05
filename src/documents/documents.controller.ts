import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Document } from './entities/documents.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 500 * 1024 }, // 200KB max file size
    }),
  )
  async uploadDocuments(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    try {
      console.log('📂 Received Files:', files);
      console.log('📝 Received Body:', body);

      if (!files || files.length === 0) {
        throw new BadRequestException('At least one file must be uploaded.');
      }

      return this.documentsService.uploadDocuments(files, body);
    } catch (error) {
      console.error('❌ Controller Error:', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }



  // Endpoint to get the most recent 10 applications
  @Get('recent')
  async getRecentApplications(): Promise<Document[]> {
    return this.documentsService.getRecentApplications();
  }


  // 📌 GET API to fetch all documents
  @Get('list')
  async getAllDocuments() {
    try {
      return this.documentsService.getAllDocuments();
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      throw new InternalServerErrorException('Failed to fetch documents');
    }
  }


  @Get('list_nodistributor')
  async getAllDocumentsNoDistributor() {
    try {
      return this.documentsService.getAllDocumentsNoDistributor(); // Call the correct method
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      throw new InternalServerErrorException('Failed to fetch documents');
    }
  }

  @Get('assigned-list')
  async getAssignedDocuments() {
    try {
      return this.documentsService.getAssignedDocuments();
    } catch (error) {
      console.error('❌ Error fetching assigned documents:', error);
      throw new InternalServerErrorException('Failed to fetch assigned documents');
    }
  }


  // 📌 PUT API to update document status
  // @Put('update-status/:id')
  // async updateDocumentStatus(
  //   @Param('id') documentId: number,
  //   @Body('status') status: string,
  // ) {
  //   try {
  //     if (!status) {
  //       throw new BadRequestException('Status is required.');
  //     }

  //     return this.documentsService.updateDocumentStatus(documentId, status);
  //   } catch (error) {
  //     console.error('❌ Error updating status:', error);
  //     throw new InternalServerErrorException('Failed to update document status');
  //   }
  // }



  @Put('update-status/:id')
  async updateDocumentStatus(
    @Param('id') documentId: number,
    @Body('status') status: string,
    @Body('rejectionReason') rejectionReason?: string, // Accept rejection reason
  ) {
    try {
      if (!status) {
        throw new BadRequestException('Status is required.');
      }

      return this.documentsService.updateDocumentStatus(documentId, status, rejectionReason);
    } catch (error) {
      console.error('❌ Error updating status:', error);
      throw new InternalServerErrorException('Failed to update document status');
    }
  }



  // 📌 PUT API to update document fields dynamically
  @Put('update-fields/:id')
  async updateDocumentFields(
    @Param('id') documentId: number,
    @Body() updatedFields: Record<string, any>,
  ) {
    try {
      console.log('🔄 Updating document fields for:', documentId);
      console.log('📑 New Fields:', updatedFields);

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        throw new BadRequestException('Updated fields cannot be empty.');
      }

      return this.documentsService.updateDocumentFields(documentId, updatedFields);
    } catch (error) {
      console.error('❌ Error updating document fields:', error);
      throw new InternalServerErrorException('Failed to update document fields');
    }
  }


  // 📌 PUT API to assign Distributor to a Document
  @Put('assign-distributor/:id')
  async assignDistributor(
    @Param('id') documentId: number,
    @Body() body: any, // Log the full body to debug
  ) {
    console.log("📩 Received request body:", body); // Debugging Log

    const distributorId = body.distributor_id;

    if (!distributorId) {
      throw new BadRequestException('Distributor user ID is required.');
    }

    return this.documentsService.assignDistributor(documentId, distributorId);
  }




  // 📌 GET API to fetch documents by distributor_id
  @Get('list/:distributorId')
  async getDocumentsByDistributor(@Param('distributorId') distributorId: string) {
    try {
      if (!distributorId) {
        throw new BadRequestException('Distributor ID is required.');
      }

      return this.documentsService.getAllDocumentsByDistributor(distributorId);
    } catch (error) {
      console.error('❌ Error fetching distributor documents:', error);
      throw new InternalServerErrorException('Failed to fetch documents for distributor');
    }
  }



  @Get(':categoryId/:subcategoryId')
  async findByCategoryAndSubcategory(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number
  ) {
    return this.documentsService.findByCategoryAndSubcategory(categoryId, subcategoryId);
  }


  @Get(':categoryId/:subcategoryId/:distributorId')
  async findDocuments(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
    @Param('distributorId') distributorId: string,
  ) {
    return this.documentsService.findByCategorySubcategoryAndDistributor(categoryId, subcategoryId, distributorId);
  }



  @Get('doc/:categoryId/:subcategoryId/:userId')
  async findDocumentsByUser(
    @Param('categoryId') categoryId: number,
    @Param('subcategoryId') subcategoryId: number,
    @Param('userId') userId: number,
  ) {
    return this.documentsService.findByCategorySubcategoryAndUser(categoryId, subcategoryId, userId);
  }








}
