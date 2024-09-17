import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsOptional, IsUUID } from 'class-validator';

export class RefreshTokenReqDto {
  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}

export class LogoutReqDto {
  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}

export class AppLoginReqDto {
  @ApiProperty()
  @IsJWT()
  jwt: string;
}

export class AppGuestLoginReqDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  guestId: string;
}
