import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { validateConfig } from './util/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;
}

export default registerAs('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    googleOauthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
  };
});
