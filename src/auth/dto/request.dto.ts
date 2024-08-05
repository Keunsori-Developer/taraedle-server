import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenReqDto {
  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}

export class LogoutResDto {
  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}

export class AppLoginDto {
  @ApiProperty()
  @IsJWT()
  jwt: string;
}
