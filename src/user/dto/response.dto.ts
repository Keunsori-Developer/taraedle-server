import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;
}
