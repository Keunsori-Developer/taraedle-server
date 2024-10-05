import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ToBoolean } from 'src/common/decorator/toboolean.decorator';

export class AddWordReqDto {
  @ApiProperty()
  @IsString()
  words: string;
}

export class GetWordReqDto {
  @ApiPropertyOptional({ description: '단어의 길이' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(2)
  length?: number;

  @ApiPropertyOptional({ description: '자모음의 총 개수' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(4)
  count?: number;

  @ApiPropertyOptional({ description: '복합모음의 유무' })
  @IsOptional()
  @ToBoolean()
  complexVowel?: boolean;

  @ApiPropertyOptional({ description: '복합자음의 유무' })
  @IsOptional()
  @ToBoolean()
  complexConsonant?: boolean;
}

export class SolveWordReqDto {
  @ApiProperty()
  @IsString()
  wordId: string;

  @ApiProperty()
  @IsNumber()
  attempts: number;

  @ApiProperty()
  @IsBoolean()
  isSolved: boolean;
}
