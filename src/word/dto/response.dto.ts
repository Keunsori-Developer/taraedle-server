import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WordResDto {
  @ApiProperty({ example: '1' })
  @Expose()
  id: string;

  @ApiProperty({ example: '단어' })
  @Expose()
  value: string;

  @ApiProperty({ example: '의미' })
  @Expose()
  definitions: string;
}
