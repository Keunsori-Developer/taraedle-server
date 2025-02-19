import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyChallengeWord } from 'src/entity/daily-challenge-word';
import { Word } from 'src/entity/word.entity';
import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word, DailyChallengeWord])],
  exports: [WordService],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}
