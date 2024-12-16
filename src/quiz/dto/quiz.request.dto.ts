import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  answer: string;
}
