import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';
import { JwtTokenType } from '../enum/jwt-token-type.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwtSecret'),
    });
  }

  async validate(payload: JwtPayLoad) {
    if (payload.tkn !== JwtTokenType.ACCESS) {
      throw new UnauthorizedException('유효하지 않은 토큰');
    }

    return payload;
  }
}
