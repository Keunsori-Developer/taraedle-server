import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';
import { QuizStatus } from 'src/quiz/enum/quiz.enum';

@Entity({ name: 'quiz' })
export class Quiz {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'uuid', type: 'varchar', length: 36 })
  uuid: string;

  @ManyToOne(() => Word)
  @JoinColumn({ name: 'word_id' })
  word: Word;

  @ManyToOne(() => User, (user) => user.solvedWords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'attempts', type: 'integer', nullable: true })
  attempts: number;

  @Column({ name: 'status', type: 'enum', enum: QuizStatus, default: QuizStatus.IN_PROGRESS })
  status: QuizStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
