// src/wallet/entities/wallet.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { WalletTransaction } from './transaction.entity';
import { User } from '../../users/entities/users.entity';

@Entity({ name: 'wallet' })
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    balance: number;

    // ← new column to accumulate all credits
    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    totalBalance: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    @OneToMany(() => WalletTransaction, (tx) => tx.wallet)
    transactions: WalletTransaction[];
}
