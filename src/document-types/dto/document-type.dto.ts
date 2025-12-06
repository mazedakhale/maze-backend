import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentTypeDto {
    @IsString()
    @IsNotEmpty()
    doc_type_name: string;

    @IsString()
    @IsOptional()
    description?: string;
}
