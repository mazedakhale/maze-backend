import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    InternalServerErrorException,
    NotFoundException,
    Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequiredDocumentsService } from './required-documents.service';

@Controller('required-documents')
export class RequiredDocumentsController {
    constructor(private readonly requiredDocumentsService: RequiredDocumentsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form-data
    async create(
        @Body('category_id', ParseIntPipe) categoryId: number,
        @Body('subcategory_id', ParseIntPipe) subcategoryId: number,
        @Body('document_names') documentNames: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            const result = await this.requiredDocumentsService.create(
                categoryId,
                subcategoryId,
                documentNames,
                file,
            );
            return result;
        } catch (error) {
            console.error('Error in create controller:', error);
            throw new InternalServerErrorException('Failed to create document.');
        }
    }
    @Post('employee')
    async createlist(
        @Body('category_id', ParseIntPipe) categoryId: number,
        @Body('subcategory_id', ParseIntPipe) subcategoryId: number,
        @Body('user_id', ParseIntPipe) userId: number,
    ) {
        try {
            const result = await this.requiredDocumentsService.createlist(
                categoryId,
                subcategoryId,
                userId,
            );
            return result;
        } catch (error) {
            console.error('Error in create controller:', error);
            throw new InternalServerErrorException('Failed to create document.');
        }
    }
    // Edit API
    @Put('employee/:id')
    async updateList(
        @Param('id', ParseIntPipe) id: number,
        @Body('category_id', ParseIntPipe) categoryId: number,
        @Body('subcategory_id', ParseIntPipe) subcategoryId: number,
        @Body('user_id', ParseIntPipe) userId: number,
    ) {
        try {
            const result = await this.requiredDocumentsService.updateList(
                id,
                categoryId,
                subcategoryId,
                userId,
            );
            return result;
        } catch (error) {
            console.error('Error in update controller:', error);
            throw new InternalServerErrorException('Failed to update document.');
        }
    }

    // Delete API
    @Delete('employee/:id')
    async deleteList(
        @Param('id', ParseIntPipe) id: number,
    ) {
        try {
            const result = await this.requiredDocumentsService.deleteList(id);
            return result;
        } catch (error) {
            console.error('Error in delete controller:', error);
            throw new InternalServerErrorException('Failed to delete document.');
        }
    }


    // Endpoint to fetch documents by category and subcategory
    @Get('category-docs/:categoryId/:subcategoryId/:userId')
    async findByCategoryAndSubcategoryUserId(
        @Param('categoryId') categoryId: number,
        @Param('subcategoryId') subcategoryId: number,
        @Param('userId') userId: number,
    ) {
        return this.requiredDocumentsService.findByCategoryAndSubcategoryUserId(
            categoryId,
            subcategoryId,
            userId
        );
    }


    @Get()
    async findAll() {
        return this.requiredDocumentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.requiredDocumentsService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form-data
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body('category_id', ParseIntPipe) categoryId: number,
        @Body('subcategory_id', ParseIntPipe) subcategoryId: number,
        @Body('document_names') documentNames: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            const result = await this.requiredDocumentsService.update(
                id,
                categoryId,
                subcategoryId,
                documentNames,
                file,
            );
            return result;
        } catch (error) {
            console.error('Error in update controller:', error);
            throw new InternalServerErrorException('Failed to update document.');
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.requiredDocumentsService.remove(id);
    }

    @Get(':categoryId/:subcategoryId')
    async findByCategoryAndSubcategory(
        @Param('categoryId', ParseIntPipe) categoryId: number,
        @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
    ) {
        return this.requiredDocumentsService.findByCategoryAndSubcategory(categoryId, subcategoryId);
    }
}