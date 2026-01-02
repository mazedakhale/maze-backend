import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributorCommission } from './entities/distributor-commission.entity';

@Injectable()
export class DistributorCommissionsService {
    constructor(
        @InjectRepository(DistributorCommission)
        private readonly repo: Repository<DistributorCommission>,
    ) {}

    async create(data: {
        distributor_id: number;
        category_id: number;
        subcategory_id: number;
        commission_amount: number;
    }): Promise<DistributorCommission> {
        // Check if already exists
        const existing = await this.findSpecific(
            data.distributor_id,
            data.category_id,
            data.subcategory_id
        );

        if (existing) {
            throw new ConflictException('Commission rate already exists for this distributor and document type');
        }

        const commission = this.repo.create(data);
        return this.repo.save(commission);
    }

    findAll(): Promise<DistributorCommission[]> {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }

    findByDistributor(distributorId: number): Promise<DistributorCommission[]> {
        return this.repo.find({
            where: { distributor_id: distributorId },
            order: { created_at: 'DESC' }
        });
    }

    findSpecific(
        distributorId: number,
        categoryId: number,
        subcategoryId: number
    ): Promise<DistributorCommission | null> {
        return this.repo.findOne({
            where: {
                distributor_id: distributorId,
                category_id: categoryId,
                subcategory_id: subcategoryId
            }
        });
    }

    async update(id: number, commissionAmount: number): Promise<DistributorCommission> {
        const commission = await this.repo.findOne({ where: { id } });
        if (!commission) {
            throw new NotFoundException('Commission rate not found');
        }

        commission.commission_amount = commissionAmount;
        return this.repo.save(commission);
    }

    async remove(id: number): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Commission rate not found');
        }
    }
}
