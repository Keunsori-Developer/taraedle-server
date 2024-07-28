import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const { id, name, emails, photos } = profile;

      const user = {
        id: id,
        email: emails[0].value,
        firstName: name.familyName,
        lastName: name.givenName,
        photo: photos[0].value,
      };

      return user;
    } catch (error) {
      return error;
    }
  }
}
