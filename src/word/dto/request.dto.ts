import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddWordReqDto {
  @ApiProperty()
  @IsString()
  words: string;
}
