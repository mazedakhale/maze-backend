// src/documents/entities/document.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  document_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  category_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  category_name: string;

  @Column({ type: 'int', nullable: false })
  subcategory_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  subcategory_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column('json', { nullable: false })
  documents: {
    is_receipt_url: any;
    document_type: string;
    mimetype: string;
    file_path: string;
  }[];

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected', 'Uploaded', 'Completed', 'Sent', 'Received'],
    default: 'Pending',
  })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  distributor_id: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  uploaded_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  status_updated_at: Date;

  @Column('json', { nullable: true })
  status_history: Array<{ status: string; updated_at: Date }>;

  @Column('json', { nullable: false })
  document_fields: Record<string, string | number>;

  @Column({ type: 'varchar', length: 50, unique: true })
  application_id: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  receipt_url: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column('json', { nullable: true })
  selected_document_names: string[] | null;
}
