import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc';
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
import axios from 'axios';
import * as xml2js from 'xml2js';
import { ConfigService } from '@nestjs/config';
import { mapJsonToStructuredData, parseXmlToJson, transformAndExtractDefinitions } from './mapper/word.mapper';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');
@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
    @InjectRepository(SolvedWord) private solvedWordRepository: Repository<SolvedWord>,
    private readonly configService: ConfigService,
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

    //TODO: null일때 리턴 이후에 db update 실행
    if (!randomWord.definitions || randomWord.length == 0) {
      randomWord.definitions = await this.getWordDefinitionsFromKrDictApi(randomWord.value);
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
        const { length, count, complexConsonantCount, complexVowelCount, definitions } = await this.checkWord(word);
        const hasComplexConsonant = complexConsonantCount > 0;
        const hasComplexVowel = complexVowelCount > 0;

        wordEntities.push(
          this.wordRepository.create({ value: word, length, count, hasComplexConsonant, hasComplexVowel, definitions }),
        );
      }
    }

    if (wordEntities.length > 0) {
      await this.wordRepository.save(wordEntities);
    }
  }

  async checkWord(word: string) {
    const { arr, complexConsonantCount, complexVowelCount } = this.decomposeConstantsHandle(
      this.decomposeHangulString(word),
    );
    const length = word.length;
    const count = arr.length;
    const definitions = await this.getWordDefinitionsFromKrDictApi(word);
    return { arr, length, count, complexConsonantCount, complexVowelCount, definitions };
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

    const solveStreak = await this.getCurrentSolveStreak(user.id);

    const lastSolve = lastSolveRaw?.createdAt.toLocaleString() ?? null;

    const solveResDto = plainToInstance(
      UserSolveResDto,
      { solveCount, lastSolve, solveStreak },
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );

    return solveResDto;
  }

  async getCurrentSolveStreak(userId: User['id']) {
    const solvedWords = await this.solvedWordRepository.find({
      select: { createdAt: true },
      where: { user: { id: userId }, isSolved: true },
      order: { createdAt: 'DESC' }, // 날짜 순서대로 정렬
    });

    const solvedWordsInKoreaTime = solvedWords.map((word) => ({
      ...word,
      createdAt: dayjs(word.createdAt).tz().startOf('day'),
    }));

    const solveDateArray = [...new Set(solvedWordsInKoreaTime.map((word) => word.createdAt))];

    if (solveDateArray.length === 0) {
      return 0;
    }
    // 처음은 오늘부터 확인
    let targetDay = dayjs().startOf('day');
    let streak = 0;

    //오늘 풀었으면 1 추가
    if (dayjs(solveDateArray[0]).isSame(targetDay)) {
      streak = 1;
    }

    // 어제부터 이어서 확인
    targetDay = targetDay.subtract(1, 'day');

    for (let i = 0; i < solveDateArray.length; i++) {
      const solvedDate = dayjs(solveDateArray[i]);
      if (solvedDate.isSame(targetDay)) {
        targetDay = targetDay.subtract(1, 'day');
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }

  async getWordDefinitionsFromKrDictApi(str: string) {
    const url = 'https://krdict.korean.go.kr/api/search';
    const params = {
      key: this.configService.get('app.krdictApiKey'),
      q: str,
      advanced: 'y',
      part: 'word',
      method: 'exact',
    };

    try {
      const response = await axios.get(url, { params });
      const xmlData = response.data;
      const jsonData = await parseXmlToJson(xmlData);
      const structuredData = mapJsonToStructuredData(jsonData);

      const definitions = transformAndExtractDefinitions(structuredData);
      return JSON.stringify(definitions);
    } catch (error) {
      console.error('Error fetching or processing data:', error.message);
    }
  }
}
