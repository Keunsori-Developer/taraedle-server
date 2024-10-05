import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FINALS, INITIALS, MEDIALS } from 'src/common/constant/hangul.constant';
import { InvalidWordException } from 'src/common/exception/invalid.exception';
import { SolvedWord } from 'src/entity/solved_word.entity';
import { User } from 'src/entity/user.entity';
import { Word } from 'src/entity/word.entity';
import { DeepPartial, Repository } from 'typeorm';
import { GetWordReqDto, SolveWordReqDto } from './dto/request.dto';
import { WordResDto } from './dto/response.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
    @InjectRepository(SolvedWord) private solvedWordRepository: Repository<SolvedWord>,
  ) {}
  async getRandomWord(dto: GetWordReqDto): Promise<WordResDto> {
    const randomWordQueryBuilder = this.wordRepository.createQueryBuilder().select('value');

    if (dto.length) {
      randomWordQueryBuilder.andWhere('length = :length', { length: dto.length });
    }

    if (dto.count) {
      randomWordQueryBuilder.andWhere('count = :count', { count: dto.count });
    }

    if (dto.complexVowel) {
      randomWordQueryBuilder.andWhere('has_complex_vowel = :complexVowel', { complexVowel: dto.complexVowel });
    }

    if (dto.complexConsonant) {
      randomWordQueryBuilder.andWhere('has_complex_consonant = :complexConsonant', {
        complexConsonant: dto.complexConsonant,
      });
    }

    const randomWord = await randomWordQueryBuilder.orderBy('RANDOM()').limit(1).getRawOne();

    if (!randomWord) {
      throw new BadRequestException('해당하는 단어가 없습니다');
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

  private decomposeConstants(arr: string[]) {
    let complexConsonantCount = 0;
    let complexVowelCount = 0;

    const decomposed = arr.flatMap((char) => {
      switch (char) {
        case 'ㄲ':
          complexConsonantCount++;
          return ['ㄱ', 'ㄱ'];
        case 'ㄳ':
          complexConsonantCount++;
          return ['ㄱ', 'ㅅ'];
        case 'ㄵ':
          complexConsonantCount++;
          return ['ㄴ', 'ㅈ'];
        case 'ㄶ':
          complexConsonantCount++;
          return ['ㄴ', 'ㅎ'];
        case 'ㄸ':
          complexConsonantCount++;
          return ['ㄷ', 'ㄷ'];
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
        case 'ㅃ':
          complexConsonantCount++;
          return ['ㅂ', 'ㅂ'];
        case 'ㅄ':
          complexConsonantCount++;
          return ['ㅂ', 'ㅅ'];
        case 'ㅆ':
          complexConsonantCount++;
          return ['ㅅ', 'ㅅ'];
        case 'ㅉ':
          complexConsonantCount++;
          return ['ㅈ', 'ㅈ'];
        case 'ㅐ':
          complexVowelCount++;
          return ['ㅏ', 'ㅣ'];
        case 'ㅒ':
          complexVowelCount++;
          return ['ㅑ', 'ㅣ'];
        case 'ㅔ':
          complexVowelCount++;
          return ['ㅓ', 'ㅣ'];
        case 'ㅖ':
          complexVowelCount++;
          return ['ㅕ', 'ㅣ'];
        case 'ㅘ':
          complexVowelCount++;
          return ['ㅗ', 'ㅏ'];
        case 'ㅙ':
          complexVowelCount++;
          return ['ㅗ', 'ㅏ', 'ㅣ'];
        case 'ㅚ':
          complexVowelCount++;
          return ['ㅗ', 'ㅣ'];
        case 'ㅝ':
          complexVowelCount++;
          return ['ㅜ', 'ㅓ'];
        case 'ㅞ':
          complexVowelCount++;
          return ['ㅜ', 'ㅓ', 'ㅣ'];
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
}
