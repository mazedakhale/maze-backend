import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('distributor_payment_details')
export class DistributorPaymentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  distributor_id: number;

  @Column({ length: 100, nullable: true })
  account_holder_name: string;

  @Column({ length: 20, nullable: true })
  account_number: string;

  @Column({ length: 100, nullable: true })
  bank_name: string;

  @Column({ length: 15, nullable: true })
  ifsc_code: string;

  @Column({ length: 50, nullable: true })
  upi_id: string;

  @Column({ type: 'text', nullable: true })
  qr_code_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}