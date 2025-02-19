import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyChallengeWord } from 'src/entity/daily-challenge-word';
import { WordModule } from 'src/word/word.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyChallengeWord]), WordModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
