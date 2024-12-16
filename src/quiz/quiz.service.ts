import { Injectable } from '@nestjs/common';
import { Quiz } from 'src/entity/quiz.entity';
import { UserService } from 'src/user/user.service';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';
import { QuizAttemptReqDto, QuizStartReqDto } from './dto/quiz.request.dto';
import {
  FinishedQuizException,
  InvalidQuizException,
  InvalidUserException,
} from 'src/common/exception/invalid.exception';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizDifficulty, QuizStatus } from './enum/quiz.enum';
import * as hangul from 'hangul-js';
import { DIFFICULTY_MAP } from './interface/quiz-difficulty.interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly userService: UserService,
    private readonly wordService: WordService,
  ) {}

  async startNewQuiz(userId: string, dto: QuizStartReqDto) {
    const { difficulty } = dto;
    const user = await this.userService.fineOneById(userId);

    if (!user) {
      throw new InvalidUserException();
    }

    const uuid = uuidv4();
    const randomWord = await this.wordService.getRandomWordForQuiz(userId, difficulty);

    const quiz = await this.quizRepository.save({
      uuid,
      word: randomWord,
      user,
      difficulty,
    });

    return quiz;
  }

  async solveQuiz(userId: string, uuid: string, dto: QuizAttemptReqDto) {
    const { answer } = dto;
    const quiz = await this.quizRepository.findOne({
      where: { uuid, user: { id: userId } },
      relations: { word: true },
    });

    if (!quiz) {
      throw new InvalidQuizException();
    }

    if (quiz.status !== QuizStatus.IN_PROGRESS) {
      throw new FinishedQuizException();
    }

    const transformedAnswer = hangul.assemble(answer.split(''));
    quiz.attempts = (quiz.attempts ?? 0) + 1;

    // 문제 풀이 성공
    if (transformedAnswer == quiz.word.value) {
      quiz.status = QuizStatus.SOLVED;
    } else {
      if (quiz.attempts >= DIFFICULTY_MAP[QuizDifficulty[quiz.difficulty]].maxAttempts) {
        quiz.status = QuizStatus.FAILED;
      }
    }

    const updatedQuiz = await this.quizRepository.save(quiz);
    return updatedQuiz;
  }
}
