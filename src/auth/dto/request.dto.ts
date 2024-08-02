import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

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

export class TestResDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}
