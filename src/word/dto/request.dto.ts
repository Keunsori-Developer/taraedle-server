import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ToBoolean } from 'src/common/decorator/toboolean.decorator';

export class AddWordReqDto {
  @ApiProperty()
  @IsString()
  words: string;
}

export class GetWordReqDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(2)
  length?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(4)
  count?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  complexVowel?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  complexConsonant?: boolean;
}
