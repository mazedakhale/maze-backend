import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('price')
export class Price {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category_id: number;

    @Column()
    subcategory_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    distributor_commission: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
