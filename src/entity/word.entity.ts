import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'word' })
export class Word {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'value', type: 'varchar', unique: true })
  value: string;

  @Column({ name: 'length', type: 'int' })
  length: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
