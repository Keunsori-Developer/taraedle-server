import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorator/error-response.decorator';
import { GooglePayload } from 'src/common/decorator/google-payload.decorator';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { CustomExceptionCode } from 'src/common/enum/custom-exception-code.enum';
import { CustomErrorDefinitions } from 'src/common/exception/error-definitions';
import { AuthService } from './auth.service';
import {
  AppGuestLoginReqDto,
  AppLoginReqDto,
  LogoutReqDto,
  RefreshTokenReqDto,
  WebGoogleLoginReqDto,
} from './dto/request.dto';
import { AppGoogleLoginResDto, AppGuestLoginResDto, TokenResDto, WebGoogleLoginResDto } from './dto/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '앱 용 Google 로그인 요청',
    description: 'google에서 받은 jwt를 요청으로 보내고, 회원 확인 후 accesstoken과 refreshtoken 반환 ',
  })
  @ApiBody({ type: AppLoginReqDto })
  @ApiPostResponse(AppGoogleLoginResDto)
  @Post('login/app/google')
  @HttpCode(HttpStatus.CREATED)
  async appLogin(@Body() dto: AppLoginReqDto): Promise<AppGoogleLoginResDto> {
    const { jwt: idToken } = dto;
    return await this.authService.appGoogleLogin(idToken);
  }

  @ApiOperation({
    summary: '앱 용 Guest 로그인 요청',
    description: `guestId를 보내지 않으면 새로운 guest 계정 생성 후 반환 \n\n guestId를 보낸다면 기존 게스트 계정 정보 반환`,
  })
  @ApiPostResponse(AppGuestLoginResDto, '로그인 성공')
  @ApiErrorResponse([CustomErrorDefinitions[CustomExceptionCode.INVALID_USER]])
  @Post('login/app/guest')
  @HttpCode(HttpStatus.CREATED)
  async appGuestLogin(@Body() dto: AppGuestLoginReqDto) {
    return await this.authService.appGuestLogin(dto);
  }

  @ApiOperation({
    summary: '웹 용 Google 로그인 창 리다이렉트 링크 (SWAGGER에서 작동 X)',
    description: `구글 로그인 창으로 리다이렉트 되는 주소\n\n 구글 로그인 성공 후 프론트단 /callback?code={code}  로 받은 code를\n\n POST /auth/login/google/callback로 body에 담아 요청할것`,
  })
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  async googleLogin() {}

  @ApiOperation({
    summary: '웹 용 Google 로그인 요청',
    description: 'Google 로그인 이후 리다이렉트 페이지, 회원 확인 이후 accesstoken과 refreshtoken 반환',
  })
  @UseGuards(AuthGuard('google'))
  @ApiPostResponse(WebGoogleLoginResDto)
  @Post('login/google/callback')
  async googleLoginCallback(@GooglePayload() payload, @Body() dto: WebGoogleLoginReqDto) {
    return await this.authService.googleLoginCallback(payload);
  }

  @ApiOperation({
    summary: 'AccessToken 재발급 요청',
    description: 'AccessToken 만료로 401을 받았을때 AccessToken 재발급 요청',
  })
  @ApiBody({ type: RefreshTokenReqDto })
  @ApiPostResponse(TokenResDto)
  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refresh(@Body() dto: RefreshTokenReqDto): Promise<TokenResDto> {
    const { refreshToken } = dto;
    return await this.authService.refresh(refreshToken);
  }

  @ApiOperation({
    summary: 'AccessToken 재발급 요청 테스트!!!!!!!!!!!!',
    description: '사용하지마시오',
  })
  @ApiPostResponse(TokenResDto)
  @Post('refreshtest')
  @HttpCode(HttpStatus.OK)
  async refreshTEST(): Promise<TokenResDto> {
    return await this.authService.refreshTEST();
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '프론트단에서 AccessToken 및 RefreshToken 삭제 후 서버에서 RefreshToken 삭제 처리',
  })
  @ApiBody({ type: LogoutReqDto })
  @ApiOkResponse({ description: '성공' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: LogoutReqDto): Promise<void> {
    const { refreshToken } = dto;
    await this.authService.logout(refreshToken);
  }
}
