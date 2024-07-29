import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '30m';
  private readonly refreshTokenExpiresIn = '30d';

  constructor(private jwtService: JwtService) {}
  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async refresh(id: string) {
    const accessToken = this.generateAccessToken(id);
    const newRefreshToken = this.generateRefreshToken(id);

    return { accessToken: accessToken, refreshToken: newRefreshToken };
  }

  private generateAccessToken(id: string) {
    const payload = { sub: id, tokenType: 'access' };
    const options = { expiresIn: this.accessTokenExpiresIn, secret: process.env.JWT_SECRET };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken(id: string) {
    const payload = { sub: id, tokenType: 'refresh' };
    const options = { expiresIn: this.refreshTokenExpiresIn, secret: process.env.JWT_SECRET };

    return this.jwtService.sign(payload, options);
  }
}
