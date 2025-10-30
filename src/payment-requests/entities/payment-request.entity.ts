import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_requests')
export class PaymentRequest {
  @PrimaryGeneratedColumn()
  request_id: number;

  @Column({ type: 'int', nullable: false })
  document_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  application_id: string;

  @Column({ type: 'int', nullable: false })
  distributor_id: number;

  @Column({ type: 'int', nullable: false })
  customer_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected', 'Paid'],
    default: 'Pending',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subcategory_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  applicant_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
