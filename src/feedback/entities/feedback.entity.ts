import { User } from 'src/users/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('Feedback')
export class Feedback {
    @PrimaryGeneratedColumn()
    feedback_id: number;

    @Column()
    comment: string;

    @Column({ type: 'int', default: 5 })
    rating: number;

    @Column()
    user_id: number;  // Store user ID

    @ManyToOne(() => User, (users) => users.feedback) // ✅ Many feedbacks belong to one user
    user: User;
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
