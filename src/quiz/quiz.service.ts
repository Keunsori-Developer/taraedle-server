import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtUserPayload } from 'src/common/decorator/jwt-payload.decorator';
import {
  AlreadySolvedDailyChallengeException,
  FinishedQuizException,
  InvalidQuizException,
} from 'src/common/exception/invalid.exception';
import { Quiz } from 'src/entity/quiz.entity';
import { WordService } from 'src/word/word.service';
import { Not, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { QuizAttemptReqDto, QuizStartReqDto } from './dto/quiz.request.dto';
import { QuizDifficulty, QuizStatus } from './enum/quiz.enum';
import { DIFFICULTY_MAP } from './interface/quiz-difficulty.interface';
import { QuizDifficultyStats, QuizRawStats } from './interface/quiz.interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly wordService: WordService,
  ) {}

  async startNewQuiz(user: JwtUserPayload, dto: QuizStartReqDto) {
    const { difficulty } = dto;

    if (difficulty === QuizDifficulty.CHALLENGE) {
      const todayDailyChallengeAttempt = await this.quizRepository
        .createQueryBuilder('quiz')
        .where('quiz.user_id = :userId', { userId: user.id })
        .andWhere('quiz.difficulty = :difficulty', { difficulty: QuizDifficulty.CHALLENGE })
        .andWhere('quiz.status != :status', { status: QuizStatus.IN_PROGRESS })
        .andWhere('DATE(quiz.created_at) >= DATE(:today)', { today: new Date() })
        .getMany();

      if (todayDailyChallengeAttempt.length >= 1) {
        throw new AlreadySolvedDailyChallengeException();
      }
    }

    const uuid = uuidv4();
    const randomWord = await this.wordService.getRandomWordForQuiz(user.id, difficulty);

    const quiz = await this.quizRepository.save({
      uuid,
      word: randomWord,
      user: { id: user.id },
      difficulty,
    });

    const difficultyConfig: any = DIFFICULTY_MAP[difficulty];
    return { quiz, difficultyConfig };
  }

  async solveQuiz(user: JwtUserPayload, uuid: string, dto: QuizAttemptReqDto) {
    const { attempts, solved } = dto;

    const quiz = await this.quizRepository.findOne({
      where: { uuid, user: { id: user.id } },
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

  async getQuizStats(user: JwtUserPayload) {
    const { id: userId } = user;
    const quizArray = await this.quizRepository.find({
      where: { user: { id: userId }, status: Not(QuizStatus.IN_PROGRESS) },
      order: { createdAt: 'DESC' },
    });

    const solvedCnt = quizArray.filter((quiz) => quiz.status === QuizStatus.SOLVED).length;
    const totalCnt = quizArray.length;
    const lastSolve = quizArray.find((quiz) => quiz.status === QuizStatus.SOLVED)?.createdAt?.toLocaleString() ?? null;

    const quizzesByDifficulty: Record<string, Quiz[]> = {};
    for (const quiz of quizArray) {
      if (!quizzesByDifficulty[quiz.difficulty]) {
        quizzesByDifficulty[quiz.difficulty] = [];
      }
      quizzesByDifficulty[quiz.difficulty].push(quiz);
    }

    // 난이도별 통계 계산
    const formattedResult: QuizDifficultyStats = {};

    for (const [difficulty, quizzes] of Object.entries(quizzesByDifficulty)) {
      const diffStats = this.getQuizDifficultyStats(quizzes);

      formattedResult[difficulty] = diffStats;
    }

    return { solvedCnt, totalCnt, lastSolve, details: formattedResult };
  }

  private getQuizDifficultyStats(quizzes: Quiz[]) {
    let streakOn = true;

    const rawResults: QuizRawStats = {
      solvedCnt: 0,
      totalCnt: 0,
      solvedAttemptsStats: {},
      solveStreak: 0,
    };

    for (const quiz of quizzes) {
      rawResults.totalCnt++;

      if (quiz.status === QuizStatus.FAILED) {
        streakOn = false;
        continue;
      }

      //SOLVED 인 경우 밑의 로직 실행행
      rawResults.solvedCnt++;

      if (!rawResults.solvedAttemptsStats[quiz.attempts]) {
        rawResults.solvedAttemptsStats[quiz.attempts] = 0;
      }
      rawResults.solvedAttemptsStats[quiz.attempts]++;

      if (streakOn) {
        rawResults.solveStreak++;
      }
    }

    return rawResults;
  }
}
