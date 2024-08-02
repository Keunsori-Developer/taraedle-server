import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GooglePayload } from 'src/common/decorator/google-payload.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LogoutResDto, RefreshTokenReqDto, TestResDto } from './dto/request.dto';
import { TokenResDto } from './dto/response.dto';
import { ApiGetResponse, ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SWAGGER_RESPONSES } from 'src/common/constant/swagger.constant';

@ApiTags('Auth')
@ApiExtraModels(TokenResDto, LogoutResDto, RefreshTokenReqDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '웹 용 Google 로그인 요청',
    description: '/auth/login/google/callback 으로 리다이렉트 되고, 회원 확인 후 accesstoken과 refreshtoken 반환',
  })
  @ApiGetResponse(TokenResDto)
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Google 로그인 이후 리다이렉트 페이지',
    description: 'Google 로그인 이후 리다이렉트 페이지, 회원 확인 이후 accesstoken과 refreshtoken 반환',
  })
  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@GooglePayload() payload): Promise<TokenResDto> {
    return await this.authService.loginCallback(payload);
  }

  @ApiOperation({})
  @ApiBody({ type: TestResDto })
  @Post('test')
  async verifyToken(@Body() dto: TestResDto) {
    const { idToken } = dto;
    const userInfo = await this.authService.test(idToken);
    return userInfo;
  }

  @ApiOperation({
    summary: 'AccessToken 재발급 요청',
    description: 'AccessToken 만료로 401을 받았을때 AccessToken 재발급 요청',
  })
  @ApiBody({ type: RefreshTokenReqDto })
  @ApiPostResponse(TokenResDto)
  @ApiBadRequestResponse(SWAGGER_RESPONSES.BADREQUEST)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenReqDto): Promise<TokenResDto> {
    const { refreshToken } = dto;
    return await this.authService.refresh(refreshToken);
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '프론트단에서 AccessToken 및 RefreshToken 삭제 후 서버에서 RefreshToken 삭제 처리',
  })
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
