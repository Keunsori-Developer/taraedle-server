import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from 'src/common/interface/provider-user.interface';
import { Token } from 'src/entity/token.entity';
import { UserProvider } from 'src/user/enum/user-provider.enum';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '30m';
  private readonly refreshTokenExpiresIn = '30d';

  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private configservice: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateGoogleUser(googleUser: GoogleUser): Promise<any> {
    const { name, provider, providerId, email } = googleUser;
    const user = await this.userService.findOneByProviderId(UserProvider.GOOGLE, providerId);

    if (user) {
      return user;
    } else {
      const newUser = await this.userService.createGoogleUser(googleUser);
      return newUser;
    }
  }

  async loginCallback(payload: any) {
    const { providerId } = payload;
    const newAccessToken = this.generateAccessToken(providerId);
    const newRefreshToken = this.generateRefreshToken(providerId);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async refresh(token: string) {
    const prevRefreshToken = await this.tokenRepository.findOne({ where: { refreshToken: token } });

    if (!prevRefreshToken) {
      throw new BadRequestException();
    }

    const newAccessToken = this.generateAccessToken(token);
    const newRefreshToken = this.generateRefreshToken(token);

    prevRefreshToken.refreshToken = newRefreshToken;
    await this.tokenRepository.save(prevRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  private generateAccessToken(id: string) {
    const payload = { sub: id, tokenType: 'access' };
    const options = { expiresIn: this.accessTokenExpiresIn, secret: this.configservice.get('app.jwtSecret') };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken(id: string) {
    const payload = { sub: id, tokenType: 'refresh' };
    const options = { expiresIn: this.refreshTokenExpiresIn, secret: this.configservice.get('app.jwtSecret') };

    return this.jwtService.sign(payload, options);
  }
}
