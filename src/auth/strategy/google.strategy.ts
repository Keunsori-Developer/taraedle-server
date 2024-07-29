import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('app.googleOauthClientId'),
      clientSecret: configService.get('app.googleOauthClientSecret'),
      callbackURL: 'http://localhost:8000/auth/google/callback',
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const { id, displayName } = profile;
      const user = {
        provider: 'google',
        providerId: id,
        name: displayName,
      };

      return user;
    } catch (error) {
      return error;
    }
  }
}
