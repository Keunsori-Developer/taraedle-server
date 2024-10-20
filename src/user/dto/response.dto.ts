import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

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

export class UserSolveResDto {
  @ApiProperty({ example: 2, type: 'number' })
  @Expose()
  solveCount: number;

  @ApiProperty({ example: '2024. 8. 1. 오전 11:00:00' })
  @Expose()
  lastSolve: string;
}

export class UserDetailResDto extends UserResDto {
  @ApiProperty()
  @Expose()
  @Type(() => UserSolveResDto)
  solveData: UserSolveResDto;
}
