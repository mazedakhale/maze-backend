import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PrivacyPolicy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    policyFileUrl: string; // Renamed from `fileUrl` to `policyFileUrl`

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}