import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * User Entity for Authentication
 * This entity represents a user in the system with authentication capabilities
 */
@Entity('auth_users')
export class AuthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // This will be hashed using bcrypt

  @Column({ default: 'user' })
  role: string; // 'admin' or 'user'

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
