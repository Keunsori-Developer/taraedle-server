import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { QuizStatus } from '../enum/quiz.enum';

export class QuizWordResDto {
  @ApiProperty()
  @Expose()
  value: string;

  @ApiProperty()
  @Expose()
  definitions: string;
}

export class QuizDifficultyResDto {
  @ApiProperty()
  @Expose()
  lengthMin: number;

  @ApiProperty()
  @Expose()
  lengthMax: number;

  @ApiProperty()
  @Expose()
  countMin: number;

  @ApiProperty()
  @Expose()
  countMax: number;

  @ApiProperty()
  @Expose()
  complexVowel: boolean;

  @ApiProperty()
  @Expose()
  complexConsonant: boolean;

  @ApiProperty()
  @Expose()
  maxAttempts: number;
}

export class QuizResDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  @Type(() => QuizWordResDto)
  word: QuizWordResDto;

  @ApiProperty()
  @Expose()
  @Type(() => QuizDifficultyResDto)
  difficulty: QuizDifficultyResDto;
}

export class QuizSolveResDto {
  @ApiProperty()
  @Expose()
  status: QuizStatus;

  @ApiProperty()
  @Expose()
  attempts: number;
}
