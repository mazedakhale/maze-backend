import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { HeaderService } from './header.service';
import { Header } from './header.entity';

interface CreateHeaderDto { description: string; }
interface UpdateHeaderDto { description: string; }

@Controller('header')
export class HeaderController {
    constructor(private readonly headerService: HeaderService) { }

    @Post()
    create(@Body() dto: CreateHeaderDto): Promise<Header> {
        return this.headerService.create(dto);
    }

    @Get()
    findAll(): Promise<Header[]> {
        return this.headerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Header> {
        return this.headerService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateHeaderDto,
    ): Promise<Header> {
        return this.headerService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.headerService.remove(id);
        return { message: 'News removed' };
    }
}
