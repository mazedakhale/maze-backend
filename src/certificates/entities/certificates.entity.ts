import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  certificate_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  certificate_name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  file_url: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  document_id: number;

  @Column({ type: 'varchar', nullable: true })
  distributor_id: string;

  // ✅ Safe for MySQL 8+
  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  certified_date: Date;

  @Column({ type: 'varchar', length: 50, unique: true })
  application_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ nullable: true })
  receipt_url: string;
}
