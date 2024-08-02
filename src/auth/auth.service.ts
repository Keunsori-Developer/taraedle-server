import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from 'src/common/interface/provider-user.interface';
import { Token } from 'src/entity/token.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { TokenResDto } from './dto/response.dto';
import { JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';
import { JwtTokenType } from './enum/jwt-token-type.enum';
import { User } from 'src/entity/user.entity';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '30m';
  private readonly refreshTokenExpiresIn = '30d';
  private client: OAuth2Client;
  private readonly CLIENT_ID = '236075874307-3i9rfec1lujamn3dih8g36sv5fi4f1vt.apps.googleusercontent.com';

  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private configservice: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    this.client = new OAuth2Client(this.CLIENT_ID);
  }

  async validateGoogleUser(googleUser: GoogleUser): Promise<any> {
    const { provider, providerId } = googleUser;
    const user = await this.userService.findOneByProviderId(provider, providerId);

    if (user) {
      return user;
    } else {
      const newUser = await this.userService.createGoogleUser(googleUser);
      return newUser;
    }
  }

  async loginCallback(payload: User): Promise<TokenResDto> {
    const { id } = payload;

    const newAccessToken = this.generateAccessToken(id);
    const newRefreshToken = this.generateRefreshToken(id);

    const refreshTokenEntity = this.tokenRepository.create({ refreshToken: newRefreshToken });
    await this.tokenRepository.save(refreshTokenEntity);

    const resDto = new TokenResDto(newAccessToken, newRefreshToken);

    return resDto;
  }

  async refresh(token: string): Promise<TokenResDto> {
    const prevRefreshToken = await this.tokenRepository.findOne({ where: { refreshToken: token } });
    if (!prevRefreshToken) {
      throw new BadRequestException('Invalid refreshtoken');
    }

    const { id } = this.jwtService.verify(token);

    const user = await this.userService.fineOneById(id);

    if (!user) {
      throw new BadRequestException('Invalid User');
    }

    const newAccessToken = this.generateAccessToken(id);
    const newRefreshToken = this.generateRefreshToken(id);

    prevRefreshToken.refreshToken = newRefreshToken;
    await this.tokenRepository.save(prevRefreshToken);

    const resDto = new TokenResDto(newAccessToken, newRefreshToken);

    return resDto;
  }

  async logout(token: string) {
    await this.tokenRepository.delete({ refreshToken: token });
  }
  // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token?hl=ko#node.js
  async test(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: idToken,
      audience: this.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token');
    }

    return {
      userId: payload['sub'],
      email: payload['email'],
      name: payload['name'],
    };
  }

  private generateAccessToken(id: string) {
    const payload: JwtPayLoad = { id: id, tkn: JwtTokenType.ACCESS };
    const options = { expiresIn: this.accessTokenExpiresIn, secret: this.configservice.get('app.jwtSecret') };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken(id: string) {
    const payload: JwtPayLoad = { id: id, tkn: JwtTokenType.REFRESH };
    const options = { expiresIn: this.refreshTokenExpiresIn, secret: this.configservice.get('app.jwtSecret') };

    return this.jwtService.sign(payload, options);
  }
}
