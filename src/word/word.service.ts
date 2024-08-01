import { Injectable } from '@nestjs/common';

@Injectable()
export class WordService {
  private readonly words = [
    '압력',
    '앨범',
    '한강',
    '약속',
    '약품',
    '명절',
    '낙엽',
    '만남',
    '분량',
    '불만',
    '합격',
    '불빛',
    '햇볕',
    '복습',
    '법률',
    '혈액',
    '화장',
    '의심',
  ];

  getRandomWord() {
    const randomIndex = Math.floor(Math.random() * this.words.length);
    return this.words[randomIndex];
  }
}
