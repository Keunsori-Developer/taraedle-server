import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'word' })
export class Word {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'value', type: 'varchar', unique: true })
  value: string;

  @Column({ name: 'length', type: 'int' })
  length: number;

  @Column({ name: 'count', type: 'int', nullable: true })
  count: number;

  @Column({ name: 'has_complex_consonant', type: 'boolean', default: false })
  hasComplexConsonant: boolean;

  @Column({ name: 'has_complex_vowel', type: 'boolean', default: false })
  hasComplexVowel: boolean;

  @Column({ name: 'definitions', type: 'text', nullable: true })
  definitions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
