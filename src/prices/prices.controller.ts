// src/prices/prices.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Body,
    Param,
    ParseIntPipe,
    Delete,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { Price } from './entities/price.entity';

@Controller('prices')
export class PricesController {
    constructor(private readonly pricesService: PricesService) { }

    @Post()
    create(
        @Body()
        body: { category_id: number; subcategory_id: number; amount: number; distributor_commission?: number },
    ): Promise<Price> {
        return this.pricesService.create(body);
    }

    @Get()
    findAll(): Promise<Price[]> {
        return this.pricesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Price> {
        return this.pricesService.findOne(id);
    }

    // full-replace (PUT) – returns a Price
    @Put(':id')
    replace(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: { category_id: number; subcategory_id: number; amount: number; distributor_commission?: number },
    ): Promise<Price> {
        return this.pricesService.replace(id, body);
    }



    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Body('code') code: string): Promise<void> {
        return this.pricesService.remove(id, code);
    }

    @Get('category/:categoryId')
    async getPricesByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.pricesService.findByCategoryId(categoryId);
    }

    @Get('category/:categoryId/subcategory/:subcategoryId')
    async getPriceByCategory(@Param('categoryId', ParseIntPipe) categoryId: number, 
                            @Param('subcategoryId', ParseIntPipe) subcategoryId: number) {
        return this.pricesService.findByCategoryAndSubcategory(categoryId, subcategoryId);
    }
}
