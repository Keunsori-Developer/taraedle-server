import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WordModule } from './word/word.module';

@Module({
  imports: [AuthModule, UserModule, WordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
