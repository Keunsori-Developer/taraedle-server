import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsUUID } from 'class-validator';

import { IsNotEmpty } from 'class-validator';
import { QuizDifficulty } from '../enum/quiz.enum';

export class QuizStartReqDto {
  @ApiProperty({ enum: QuizDifficulty })
  @IsEnum(QuizDifficulty)
  @IsNotEmpty()
  difficulty: QuizDifficulty;
}

export class QuizAttemptReqDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  attempts: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  solved: boolean;
}
