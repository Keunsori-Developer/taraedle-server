import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { UserModule } from 'src/user/user.module';
import { WordModule } from 'src/word/word.module';
import { Quiz } from 'src/entity/quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]), UserModule, WordModule],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
