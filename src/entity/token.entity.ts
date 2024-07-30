import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'token' })
export class Token {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'refresh_token', type: 'varchar', unique: true })
  @Index()
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
