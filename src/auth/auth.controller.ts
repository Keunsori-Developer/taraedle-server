import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GooglePayload } from 'src/common/decorator/google-payload.decorator';
import { ApiBadRequestResponse, ApiBody, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogoutResDto, RefreshTokenReqDto } from './dto/request.dto';
import { TokenResDto } from './dto/response.dto';
import { ApiGetResponse, ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SWAGGER_RESPONSES } from 'src/common/constant/swagger.constant';

@ApiTags('Auth')
@ApiExtraModels(TokenResDto, LogoutResDto, RefreshTokenReqDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @ApiOperation({})
  @ApiGetResponse(TokenResDto)
  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@GooglePayload() payload): Promise<TokenResDto> {
    return await this.authService.loginCallback(payload);
  }

  @ApiOperation({ summary: 'AccessToken 재발급 요청' })
  @ApiBody({ type: RefreshTokenReqDto })
  @ApiPostResponse(TokenResDto)
  @ApiBadRequestResponse(SWAGGER_RESPONSES.BADREQUEST)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenReqDto): Promise<TokenResDto> {
    const { refreshToken } = dto;
    return await this.authService.refresh(refreshToken);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBody({ type: LogoutResDto })
  @ApiOkResponse({ description: '성공' })
  @ApiBadRequestResponse(SWAGGER_RESPONSES.BADREQUEST)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: LogoutResDto): Promise<void> {
    const { refreshToken } = dto;
    await this.authService.logout(refreshToken);
  }
}
