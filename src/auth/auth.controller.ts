import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayLoad, JwtPayload } from 'src/common/decorator/jwt-payload.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    const reqUser = req.user;
    const user = this.userService.findOne(reqUser.providerId);
    return user;
  }

  getToken(payload: JwtPayLoad) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @JwtPayload() user: JwtPayLoad) {
    const token = /Bearer\s(.+)/.exec(request.headers.authorization)[1];
    return await this.authService.refresh(user.id);
  }
}
