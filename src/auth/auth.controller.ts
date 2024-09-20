import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LogoutReqDto,
  RefreshTokenReqDto,
  AppLoginReqDto,
  AppGuestLoginReqDto,
  WebGoogleLoginReqDto,
} from './dto/request.dto';
import { AppGuestLoginResDto, TokenResDto } from './dto/response.dto';
import { ApiGetResponse, ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { ApiErrorResponse } from 'src/common/decorator/error-response.decorator';
import { CustomErrorDefinitions } from 'src/common/exception/error-definitions';
import { CustomExceptionCode } from 'src/common/enum/custom-exception-code.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '앱 용 Google 로그인 요청',
    description: 'google에서 받은 jwt를 요청으로 보내고, 회원 확인 후 accesstoken과 refreshtoken 반환 ',
  })
  @ApiBody({ type: AppLoginReqDto })
  @ApiPostResponse(TokenResDto)
  @Post('login/app/google')
  @HttpCode(HttpStatus.CREATED)
  async appLogin(@Body() dto: AppLoginReqDto) {
    const { jwt: idToken } = dto;
    return await this.authService.appGoogleLogin(idToken);
  }

  @ApiOperation({
    summary: '앱 용 Guest 로그인 요청',
    description: `guestId를 보내지 않으면 새로운 guest 계정 생성 후 반환 \n\n guestId를 보낸다면 기존 게스트 계정 정보 반환`,
  })
  @ApiGetResponse(AppGuestLoginResDto)
  @ApiErrorResponse([CustomErrorDefinitions[CustomExceptionCode.INVALID_USER]])
  @Post('login/app/guest')
  @HttpCode(HttpStatus.CREATED)
  async appGuestLogin(@Body() dto: AppGuestLoginReqDto) {
    return await this.authService.appGuestLogin(dto);
  }

  @ApiOperation({
    summary: '웹 용 Google 로그인 요청',
    description: '/auth/login/google/callback 으로 리다이렉트 되고, 회원 확인 후 accesstoken과 refreshtoken 반환',
  })
  @ApiGetResponse(TokenResDto)
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  // @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Google oauth 로그인 이후 code를 사용한 회원 인증 TEST',
    description: 'Google 로그인 이후 리다이렉트 페이지, 회원 확인 이후 accesstoken과 refreshtoken 반환',
  })
  @Post('login/google/callback')
  async googleLoginCallback(@Body() dto: WebGoogleLoginReqDto) {
    await this.authService.googleLoginCallback(dto);
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
