import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';

@Entity({ name: 'solved_word' })
export class SolvedWord {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @ManyToOne(() => Word)
  @JoinColumn({ name: 'word_id' })
  word: Word;

  @ManyToOne(() => User, (user) => user.solvedWords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'attempts', type: 'integer' })
  attempts: number;

  @Column({ name: 'is_solved', type: 'boolean' })
  isSolved: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
