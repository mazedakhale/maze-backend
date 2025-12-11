import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FeildName } from './entities/feild_names.entity';
import { Category } from 'src/categories/entities/categories.entity';
import { Subcategory } from 'src/subcategories/entities/subcategories.entity';
import { DeletionCodeService } from '../common/deletion-code.service';

@Injectable()
export class FeildNamesService {
    getDocumentFields(categoryId: number, subcategoryId: number): string | PromiseLike<string> {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(FeildName)
        private readonly feildNamesRepository: Repository<FeildName>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,

        private readonly deletionCodeService: DeletionCodeService,
    ) { }

    async create(categoryId: number, subcategoryId: number, documentFeilds: any): Promise<FeildName> {
        try {
            // Ensure documentFeilds is a valid string
            if (!documentFeilds || typeof documentFeilds !== 'string') {
                throw new BadRequestException('document_fields must be a valid string');
            }

            // Trim whitespace
            const trimmedFields = documentFeilds.trim();
            if (trimmedFields === '') {
                throw new BadRequestException('document_fields cannot be empty');
            }

            // Fetch Category & Subcategory in a single query
            const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
            const subcategory = await this.subcategoryRepository.findOne({ where: { subcategory_id: subcategoryId } });

            if (!category) throw new NotFoundException('Category not found');
            if (!subcategory) throw new NotFoundException('Subcategory not found');

            // Create & save the entity
            const feildName = this.feildNamesRepository.create({
                category,
                subcategory,
                document_fields: trimmedFields,
            });

            return await this.feildNamesRepository.save(feildName);
        } catch (error) {
            console.error('Error in create method:', error.message);
            throw new InternalServerErrorException('Failed to create field name');
        }
    }

    async createBulk(categoryId: number, subcategoryId: number, documentFields: string[]): Promise<{ created: FeildName[], count: number }> {
        try {
            // Validate input
            if (!Array.isArray(documentFields) || documentFields.length === 0) {
                throw new BadRequestException('document_fields must be a non-empty array');
            }

            // Filter and validate each field
            const validFields = documentFields
                .map(field => field?.trim())
                .filter(field => field && field.length > 0);

            if (validFields.length === 0) {
                throw new BadRequestException('At least one valid field name is required');
            }

            // Fetch Category & Subcategory
            const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
            const subcategory = await this.subcategoryRepository.findOne({ where: { subcategory_id: subcategoryId } });

            if (!category) throw new NotFoundException('Category not found');
            if (!subcategory) throw new NotFoundException('Subcategory not found');

            // Check for duplicates in the request
            const uniqueFields = [...new Set(validFields)];
            if (uniqueFields.length !== validFields.length) {
                throw new BadRequestException('Duplicate field names found in the request');
            }

            // Check for existing field names
            const existingFields = await this.feildNamesRepository.find({
                where: {
                    category: { category_id: categoryId },
                    subcategory: { subcategory_id: subcategoryId },
                    document_fields: In(validFields)
                }
            });

            if (existingFields.length > 0) {
                const existingFieldNames = existingFields.map(f => f.document_fields).join(', ');
                throw new BadRequestException(`These field names already exist: ${existingFieldNames}`);
            }

            // Create all field entities
            const fieldEntities = validFields.map(fieldName => 
                this.feildNamesRepository.create({
                    category,
                    subcategory,
                    document_fields: fieldName
                })
            );

            // Save all entities
            const savedFields = await this.feildNamesRepository.save(fieldEntities);

            return {
                created: savedFields,
                count: savedFields.length
            };
        } catch (error) {
            console.error('Error creating bulk field names:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create field names in bulk');
        }
    }

    async findAll(): Promise<FeildName[]> {
        return await this.feildNamesRepository.find({ relations: ['category', 'subcategory'] });
    }

    async findOne(id: number): Promise<FeildName | null> {
        const feildName = await this.feildNamesRepository.findOne({ where: { id }, relations: ['category', 'subcategory'] });
        if (!feildName) throw new NotFoundException(`FeildName with ID ${id} not found`);
        return feildName;
    }

    async updateDocumentField(id: number, documentFields: string): Promise<FeildName> {
        // Update only the document_fields column
        await this.feildNamesRepository.update(id, { document_fields: documentFields });
      
        // Fetch the updated record
        const updatedField = await this.feildNamesRepository.findOne({ where: { id } });
      
        if (!updatedField) {
          throw new NotFoundException(`FieldName with ID ${id} not found`);
        }
      
        return updatedField;
      }
      

    async findByCategoryAndSubcategory(categoryId: number, subcategoryId: number): Promise<FeildName[]> {
        const fieldNames = await this.feildNamesRepository.find({
            where: {
                category: { category_id: categoryId },
                subcategory: { subcategory_id: subcategoryId },
            },
            relations: ['category', 'subcategory'],
        });

        if (!fieldNames.length) {
            throw new NotFoundException(`No FieldNames found for categoryId ${categoryId} and subcategoryId ${subcategoryId}`);
        }

        return fieldNames;
    }

    async remove(id: number, code?: string): Promise<void> {
        // Verify deletion code if provided
        if (code) {
            await this.deletionCodeService.verifyStaticCode(code);
        }

        const feildName = await this.feildNamesRepository.findOne({ where: { id } });

        if (!feildName) {
            throw new NotFoundException(`FeildName with ID ${id} not found`);
        }

        await this.feildNamesRepository.delete(id);
    }
}
