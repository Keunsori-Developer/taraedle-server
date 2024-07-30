import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayLoad, JwtPayload } from 'src/common/decorator/jwt-payload.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { GooglePayload } from 'src/common/decorator/google-payload.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@GooglePayload() payload) {
    return this.authService.loginCallback(payload);
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @JwtPayload() user: JwtPayLoad) {
    const token = /Bearer\s(.+)/.exec(request.headers.authorization)[1];
    return await this.authService.refresh(token);
  }
}
