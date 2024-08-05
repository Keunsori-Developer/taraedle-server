import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FINALS, INITIALS, MEDIALS } from 'src/common/constant/hangul.constant';
import { Word } from 'src/entity/word.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class WordService {
  constructor(@InjectRepository(Word) private wordRepository: Repository<Word>) {}
  async getRandomWord() {
    const randomWord = await this.wordRepository
      .createQueryBuilder()
      .select('value')
      .orderBy('RANDOM()')
      .limit(1)
      .getRawOne();

    if (!randomWord) {
      throw new BadRequestException();
    }

    return randomWord;
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
        const { length } = this.checkWord(word);
        wordEntities.push(this.wordRepository.create({ value: word, length }));
      }
    }

    if (wordEntities.length > 0) {
      await this.wordRepository.save(wordEntities);
    }
  }

  checkWord(word: string) {
    const { arr, complexConsonantCount, complexVowelCount } = this.decomposeConstants(this.decomposeHangulString(word));
    const length = word.length;
    const cnt = arr.length;
    return { arr, length, cnt, complexConsonantCount, complexVowelCount };
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
}
