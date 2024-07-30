import { registerAs } from '@nestjs/config';
import { validateConfig } from './util/validate-config';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

type DatabaseConfig = {
  host: string;
  port: number;
  password: string;
  name: string;
  username: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
  };
});
