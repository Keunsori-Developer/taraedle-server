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

export class QuizResDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  @Type(() => QuizWordResDto)
  word: QuizWordResDto;
}

export class QuizSolveResDto {
  @ApiProperty()
  @Expose()
  status: QuizStatus;

  @ApiProperty()
  @Expose()
  attempts: number;
}
