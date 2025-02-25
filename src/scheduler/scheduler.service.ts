import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyChallengeWord } from 'src/entity/daily-challenge-word';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(DailyChallengeWord)
    private readonly dailyChallengeRepository: Repository<DailyChallengeWord>,
    private readonly wordService: WordService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, { timeZone: 'Asia/Seoul' })
  async handleDailyChallenge() {
    const today = new Date();

    const todayDailyChallenge = await this.dailyChallengeRepository.findOne({ where: { date: today } });

    if (!todayDailyChallenge) {
      const randomDailyChallengeWord = await this.wordService.getRandomWordForDailyChallenge();

      if (!randomDailyChallengeWord) {
        return;
      }

      await this.dailyChallengeRepository.save({
        date: today,
        word: randomDailyChallengeWord,
      });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDailyChallenge = await this.dailyChallengeRepository.findOne({ where: { date: tomorrow } });

    if (!tomorrowDailyChallenge) {
      const randomDailyChallengeWord = await this.wordService.getRandomWordForDailyChallenge();

      if (!randomDailyChallengeWord) {
        return;
      }

      await this.dailyChallengeRepository.save({
        date: tomorrow,
        word: randomDailyChallengeWord,
      });
    }
  }
}
