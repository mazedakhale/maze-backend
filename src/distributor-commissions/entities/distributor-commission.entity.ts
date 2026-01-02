import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('distributor_commissions')
export class DistributorCommission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    distributor_id: number;

    @Column()
    category_id: number;

    @Column()
    subcategory_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    commission_amount: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
