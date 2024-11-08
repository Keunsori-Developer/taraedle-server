import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FINALS, INITIALS, MEDIALS } from 'src/common/constant/hangul.constant';
import { InvalidUserException, InvalidWordException } from 'src/common/exception/invalid.exception';
import { NotFoundWordException } from 'src/common/exception/notfound.exception';
import { SolvedWord } from 'src/entity/solved_word.entity';
import { User } from 'src/entity/user.entity';
import { Word } from 'src/entity/word.entity';
import { UserSolveResDto } from 'src/user/dto/response.dto';
import { DeepPartial, Repository } from 'typeorm';
import { GetWordReqDto, SolveWordReqDto } from './dto/request.dto';
import { WordResDto } from './dto/response.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');
@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
    @InjectRepository(SolvedWord) private solvedWordRepository: Repository<SolvedWord>,
  ) {}
  async getRandomWord(dto: GetWordReqDto): Promise<WordResDto> {
    const randomWordQueryBuilder = this.wordRepository.createQueryBuilder();

    if (dto.length) {
      randomWordQueryBuilder.andWhere('length = :length', { length: dto.length });
    }

    if (dto.count) {
      randomWordQueryBuilder.andWhere('count = :count', { count: dto.count });
    }

    if (dto.complexVowel !== undefined) {
      randomWordQueryBuilder.andWhere('has_complex_vowel = :complexVowel', { complexVowel: dto.complexVowel });
    }

    if (dto.complexConsonant !== undefined) {
      randomWordQueryBuilder.andWhere('has_complex_consonant = :complexConsonant', {
        complexConsonant: dto.complexConsonant,
      });
    }

    randomWordQueryBuilder.orderBy('RANDOM()').limit(1);

    const randomWord = await randomWordQueryBuilder.getOne();

    if (!randomWord) {
      throw new NotFoundWordException();
    }

    const resDto = plainToInstance(WordResDto, randomWord, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return resDto;
  }

  async addWordsIntoDatabase(words: string) {
    const wordList = words
      .split(',')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    const wordEntities: DeepPartial<Word>[] = [];

    for (const word of wordList) {
      const existingWord = await this.wordRepository.findOne({ where: { value: word } });
      if (!existingWord) {
        const { length, count, complexConsonantCount, complexVowelCount } = this.checkWord(word);
        const hasComplexConsonant = complexConsonantCount > 0;
        const hasComplexVowel = complexVowelCount > 0;

        wordEntities.push(
          this.wordRepository.create({ value: word, length, count, hasComplexConsonant, hasComplexVowel }),
        );
      }
    }

    if (wordEntities.length > 0) {
      await this.wordRepository.save(wordEntities);
    }
  }

  checkWord(word: string) {
    const { arr, complexConsonantCount, complexVowelCount } = this.decomposeConstantsHandle(
      this.decomposeHangulString(word),
    );
    const length = word.length;
    const count = arr.length;
    return { arr, length, count, complexConsonantCount, complexVowelCount };
  }

  /**
   * 한들버전
   * ㅃ,ㅉ,ㄸ,ㄲ,ㅆ,ㅒ,ㅖ는 한개로 처리, 복합 카운트 증가 시키지 않음.
   * ㅐ,ㅔ 등도 한개로 처리.
   */
  private decomposeConstantsHandle(arr: string[]) {
    let complexConsonantCount = 0;
    let complexVowelCount = 0;

    const decomposed = arr.flatMap((char) => {
      switch (char) {
        case 'ㄳ':
          complexConsonantCount++;
          return ['ㄱ', 'ㅅ'];
        case 'ㄵ':
          complexConsonantCount++;
          return ['ㄴ', 'ㅈ'];
        case 'ㄶ':
          complexConsonantCount++;
          return ['ㄴ', 'ㅎ'];
        case 'ㄺ':
          complexConsonantCount++;
          return ['ㄹ', 'ㄱ'];
        case 'ㄻ':
          complexConsonantCount++;
          return ['ㄹ', 'ㅁ'];
        case 'ㄼ':
          complexConsonantCount++;
          return ['ㄹ', 'ㅂ'];
        case 'ㄽ':
          complexConsonantCount++;
          return ['ㄹ', 'ㅅ'];
        case 'ㄾ':
          complexConsonantCount++;
          return ['ㄹ', 'ㅌ'];
        case 'ㄿ':
          complexConsonantCount++;
          return ['ㄹ', 'ㅍ'];
        case 'ㅀ':
          complexConsonantCount++;
          return ['ㄹ', 'ㅎ'];
        case 'ㅄ':
          complexConsonantCount++;
          return ['ㅂ', 'ㅅ'];
        case 'ㅘ':
          complexVowelCount++;
          return ['ㅗ', 'ㅏ'];
        case 'ㅙ':
          complexVowelCount++;
          return ['ㅗ', 'ㅐ'];
        case 'ㅚ':
          complexVowelCount++;
          return ['ㅗ', 'ㅣ'];
        case 'ㅝ':
          complexVowelCount++;
          return ['ㅜ', 'ㅓ'];
        case 'ㅞ':
          complexVowelCount++;
          return ['ㅜ', 'ㅔ'];
        case 'ㅟ':
          complexVowelCount++;
          return ['ㅜ', 'ㅣ'];
        case 'ㅢ':
          complexVowelCount++;
          return ['ㅡ', 'ㅣ'];
        default:
          return [char];
      }
    });
    return {
      arr: decomposed,
      complexConsonantCount,
      complexVowelCount,
    };
  }

  private decomposeHangulString(str: string): string[] {
    const result: string[] = [];

    for (const char of str) {
      const code = char.charCodeAt(0) - 0xac00;

      if (code < 0 || code > 11171) {
        result.push(char);
        continue;
      }

      const initialIndex = Math.floor(code / 588);
      const medialIndex = Math.floor((code % 588) / 28);
      const finalIndex = code % 28;

      result.push(INITIALS[initialIndex], MEDIALS[medialIndex]);
      if (FINALS[finalIndex]) result.push(FINALS[finalIndex]);
    }

    return result;
  }

  async solveWord(userId: User['id'], dto: SolveWordReqDto) {
    const { attempts, isSolved, wordId } = dto;

    const word = await this.wordRepository.findOne({ where: { id: wordId } });
    if (!word) {
      throw new InvalidWordException();
    }

    await this.solvedWordRepository.save(
      this.solvedWordRepository.create({ attempts, isSolved, word: { id: wordId }, user: { id: userId } }),
    );
  }

  async getUserSolveData(user: User) {
    if (!user) {
      throw new InvalidUserException();
    }
    const solveCount = (await this.solvedWordRepository.count({ where: { user: { id: user.id } } })) ?? 0;
    const lastSolveRaw = await this.solvedWordRepository.findOne({
      where: { user: { id: user.id }, isSolved: true },
      order: { id: 'desc' },
    });

    const lastSolve = lastSolveRaw.createdAt.toLocaleString();

    const solveResDto = plainToInstance(
      UserSolveResDto,
      { solveCount, lastSolve },
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );

    return solveResDto;
  }

  async getCurrentSolveStream() {
    const userId = '1';
    const solvedWords = await this.solvedWordRepository.find({
      select: { createdAt: true },
      where: { user: { id: userId }, isSolved: true },
      order: { createdAt: 'DESC' }, // 날짜 순서대로 정렬
    });

    const solvedWordsInKoreaTime = solvedWords.map((word) => ({
      ...word,
      createdAt: dayjs(word.createdAt).tz(),
    }));
    console.log('🚀 ~ WordService ~ solvedWordsInKoreaTime ~ solvedWordsInKoreaTime:', solvedWordsInKoreaTime);

    const today = dayjs().startOf('day'); // 오늘 날짜 (00:00 기준)
    let streak = 0; // 연속된 일수를 카운트할 변수

    for (let i = 0; i < solvedWordsInKoreaTime.length; i++) {
      const solvedDate = dayjs(solvedWordsInKoreaTime[i].createdAt).startOf('day');

      // 오늘 날짜와 같으면 카운트를 시작하고 넘어감
      if (streak === 0 && solvedDate.isSame(today)) {
        streak += 1;
        continue;
      }

      // 이전 문제와 날짜 차이를 확인하여 연속 여부 판단
      const previousDate = today.subtract(streak, 'day'); // 마지막 연속 일수에서 -1일씩 뺀 날짜

      if (solvedDate.isSame(previousDate)) {
        streak += 1; // 연속되면 카운트 증가
      } else {
        break; // 연속이 끊기면 종료
      }
    }
    console.log('🚀 ~ WordService ~ getCurrentSolveStream ~ streak:', streak);
  }
}
