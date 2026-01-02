import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DistributorCommissionsService } from './distributor-commissions.service';
import { DistributorCommission } from './entities/distributor-commission.entity';

@Controller('distributor-commissions')
export class DistributorCommissionsController {
    constructor(private readonly service: DistributorCommissionsService) {}

    @Post()
    create(@Body() data: {
        distributor_id: number;
        category_id: number;
        subcategory_id: number;
        commission_amount: number;
    }): Promise<DistributorCommission> {
        return this.service.create(data);
    }

    @Get()
    findAll(): Promise<DistributorCommission[]> {
        return this.service.findAll();
    }

    @Get('distributor/:distributorId')
    findByDistributor(@Param('distributorId', ParseIntPipe) distributorId: number): Promise<DistributorCommission[]> {
        return this.service.findByDistributor(distributorId);
    }

    @Get(':distributorId/:categoryId/:subcategoryId')
    findSpecific(
        @Param('distributorId', ParseIntPipe) distributorId: number,
        @Param('categoryId', ParseIntPipe) categoryId: number,
        @Param('subcategoryId', ParseIntPipe) subcategoryId: number
    ): Promise<DistributorCommission | null> {
        return this.service.findSpecific(distributorId, categoryId, subcategoryId);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { commission_amount: number }
    ): Promise<DistributorCommission> {
        return this.service.update(id, data.commission_amount);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
