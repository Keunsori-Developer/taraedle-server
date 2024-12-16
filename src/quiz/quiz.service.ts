import { Injectable } from '@nestjs/common';
import { Quiz } from 'src/entity/quiz.entity';
import { UserService } from 'src/user/user.service';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';
import { QuizAttemptReqDto } from './dto/quiz.request.dto';
import {
  FinishedQuizException,
  InvalidQuizException,
  InvalidUserException,
} from 'src/common/exception/invalid.exception';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizStatus } from './enum/quiz.enum';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly userService: UserService,
    private readonly wordService: WordService,
  ) {}

  async startNewQuiz(userId: string) {
    const user = await this.userService.fineOneById(userId);

    if (!user) {
      throw new InvalidUserException();
    }

    const uuid = uuidv4();
    const randomWord = await this.wordService.getRandomWordForQuiz(userId, {});

    const quiz = await this.quizRepository.save({
      uuid,
      word: randomWord,
      user,
    });
    console.log(quiz);
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

    if (quiz.status === QuizStatus.SOLVED) {
      throw new FinishedQuizException();
    }

    // 문제 풀이 성공
    if (answer == quiz.word.value) {
      quiz.status = QuizStatus.SOLVED;
      quiz.attempts = (quiz.attempts ?? 0) + 1;
    } else {
      quiz.attempts = (quiz.attempts ?? 0) + 1;
    }

    const updatedQuiz = await this.quizRepository.save(quiz);
    return updatedQuiz;
  }
}
