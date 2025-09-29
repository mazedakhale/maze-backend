// employee.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { Subcategory } from '../../subcategories/entities/subcategories.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Subcategory, { eager: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;

  @Column()
  user_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
