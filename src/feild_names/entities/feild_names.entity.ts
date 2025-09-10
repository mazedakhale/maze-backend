import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { Subcategory } from 'src/subcategories/entities/subcategories.entity';

@Entity('feildname')
export class FeildName {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.requiredDocuments, { onDelete: 'CASCADE' })
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.requiredDocuments, {
    onDelete: 'CASCADE',
  })
  subcategory: Subcategory;

  @Column({ type: 'text', nullable: false })
  document_fields: string;

  // ✅ Fully MySQL 8+ compatible with microsecond precision
  @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
}
