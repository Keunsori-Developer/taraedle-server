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
import { QuizStatus } from './enum/quiz.enum';

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
    const { attempts, solved } = dto;

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

    //TODO: 현재 난이도의 maxAttempts 를 초과하는 attempts 는 허용하지 않도록 수정
    quiz.attempts = attempts;
    quiz.status = solved ? QuizStatus.SOLVED : QuizStatus.FAILED;

    const updatedQuiz = await this.quizRepository.save(quiz);
    return updatedQuiz;
  }
}
