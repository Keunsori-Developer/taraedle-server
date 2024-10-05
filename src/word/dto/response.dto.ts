import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WordResDto {
  @ApiProperty({ example: '단어' })
  @Expose()
  value: string;
}
