import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportantDocumentsService } from './important-documents.service';

interface CreateImportantDocumentDto {
  title: string;
  description?: string;
  type: 'document' | 'link';
  link_url?: string;
  category?: string;
}

interface UpdateImportantDocumentDto {
  title?: string;
  description?: string;
  type?: 'document' | 'link';
  link_url?: string;
  category?: string;
  is_active?: boolean;
}

@Controller('important-documents')
export class ImportantDocumentsController {
  constructor(
    private readonly importantDocumentsService: ImportantDocumentsService,
  ) {}

  @Get()
  async findAll() {
    return this.importantDocumentsService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.importantDocumentsService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.importantDocumentsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDto: CreateImportantDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📥 Create Important Document DTO:', createDto);
    console.log('📎 Uploaded File:', file);

    let result;
    if (file) {
      // Use hybrid storage for file upload
      result = await this.importantDocumentsService.createWithFile(
        createDto,
        file,
      );
    } else {
      // No file, just create the document (for links)
      result = await this.importantDocumentsService.create(createDto);
    }

    console.log('✅ Important Document Created:', result);
    return result;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateImportantDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📥 Update Important Document DTO:', updateDto);
    console.log('📎 Uploaded File:', file);

    let result;
    if (file) {
      // Use hybrid storage for file upload
      result = await this.importantDocumentsService.updateWithFile(
        id,
        updateDto,
        file,
      );
    } else {
      // No file, just update the document data
      result = await this.importantDocumentsService.update(id, updateDto);
    }

    console.log('✅ Important Document Updated:', result);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.importantDocumentsService.remove(id);
  }
}
