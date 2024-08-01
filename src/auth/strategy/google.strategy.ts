import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GoogleUser } from 'src/common/interface/provider-user.interface';
import { UserProvider } from 'src/user/enum/user-provider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authservice: AuthService,
  ) {
    super({
      clientID: configService.get('app.googleOauthClientId'),
      clientSecret: configService.get('app.googleOauthClientSecret'),
      callbackURL: configService.get('app.googleLoginCallbackUrl'),
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const { id, displayName, emails } = profile;

      const googleUser: GoogleUser = {
        provider: UserProvider.GOOGLE,
        providerId: id,
        name: displayName,
        email: emails[0]?.value,
      };

      const user = await this.authservice.validateGoogleUser(googleUser);

      return user;
    } catch (error) {
      return error;
    }
  }
}
