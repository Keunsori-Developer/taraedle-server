import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from './word.entity';

@Entity({ name: 'daily_challenge_word' })
export class DailyChallengeWord {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'date', type: 'date', unique: true })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Word)
  @JoinColumn({ name: 'word_id' })
  word: Word;
}
