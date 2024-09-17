import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ description: 'uuid 형식의 게스트 id' })
  @IsOptional()
  @IsUUID()
  guestId: string;
}
