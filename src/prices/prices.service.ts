// src/prices/prices.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { DeletionCodeService } from '../common/deletion-code.service';

@Injectable()
export class PricesService {
    constructor(
        @InjectRepository(Price)
        private readonly priceRepo: Repository<Price>,
        private readonly deletionCodeService: DeletionCodeService,
    ) { }

    create(data: {
        category_id: number;
        subcategory_id: number;
        amount: number;
        distributor_commission?: number;
    }): Promise<Price> {
        const price = this.priceRepo.create({
            ...data,
            distributor_commission: data.distributor_commission || 0,
        });
        return this.priceRepo.save(price);
    }

    findAll(): Promise<Price[]> {
        return this.priceRepo.find();
    }

    // Find prices by category_id
    async findByCategoryId(categoryId: number): Promise<Price[]> {
        return this.priceRepo.find({
            where: { category_id: categoryId }
        });
    }

    // Find price by category_id and subcategory_id
    async findByCategoryAndSubcategory(categoryId: number, subcategoryId: number): Promise<Price | null> {
        return this.priceRepo.findOne({
            where: { 
                category_id: categoryId,
                subcategory_id: subcategoryId 
            }
        });
    }

    // <-- updated to always return a Price or throw
    async findOne(id: number): Promise<Price> {
        const price = await this.priceRepo.findOneBy({ id });
        if (!price) {
            throw new NotFoundException(`Price with id ${id} not found`);
        }
        return price;
    }

    async replace(
        id: number,
        data: { category_id: number; subcategory_id: number; amount: number; distributor_commission?: number },
    ): Promise<Price> {
        // 1) fetch existing (throws 404 if not found)
        const price = await this.findOne(id);

        // 2) overwrite fields
        price.category_id = data.category_id;
        price.subcategory_id = data.subcategory_id;
        price.amount = data.amount;
        price.distributor_commission = data.distributor_commission !== undefined ? data.distributor_commission : 0;

        // 3) save back to the DB
        return this.priceRepo.save(price);
    }

    async remove(id: number, code?: string): Promise<void> {
        // Verify deletion code if provided
        if (code) {
            await this.deletionCodeService.verifyStaticCode(code);
        }

        const result = await this.priceRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Price with id ${id} not found`);
        }
    }
}
