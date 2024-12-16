import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { QuizStatus } from '../enum/quiz.enum';

export class QuizResDto {
  @ApiProperty()
  @Expose()
  uuid: string;
}

export class QuizSolveResDto {
  @ApiProperty()
  @Expose()
  status: QuizStatus;

  @ApiProperty()
  @Expose()
  attempts: number;
}
