import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('important_documents')
export class ImportantDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['document', 'link'],
    default: 'document',
  })
  type: string;

  @Column({ type: 'text', nullable: true })
  file_url: string;

  @Column({ type: 'text', nullable: true })
  link_url: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
