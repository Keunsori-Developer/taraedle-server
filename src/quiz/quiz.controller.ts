import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { Jwt, JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';
import { QuizResDto, QuizSolveResDto } from './dto/quiz.response.dto';
import { plainToInstance } from 'class-transformer';
import { QuizAttemptReqDto, QuizStartReqDto } from './dto/quiz.request.dto';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiErrorResponse } from 'src/common/decorator/error-response.decorator';
import { CustomExceptionCode } from 'src/common/enum/custom-exception-code.enum';
import { CustomErrorDefinitions } from 'src/common/exception/error-definitions';

@ApiTags('Quiz')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiOperation({ summary: '새 단어퀴즈 요청' })
  @ApiPostResponse(QuizResDto)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async startNewQuiz(@Jwt() JwtPayload: JwtPayLoad, @Body() dto: QuizStartReqDto) {
    const quiz = await this.quizService.startNewQuiz(JwtPayload.id, dto);
    return plainToInstance(QuizResDto, quiz, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: '퀴즈 풀이 요청' })
  @ApiParam({ name: 'uuid', description: '퀴즈 UUID', type: String })
  @ApiErrorResponse([
    CustomErrorDefinitions[CustomExceptionCode.INVALID_WORD],
    CustomErrorDefinitions[CustomExceptionCode.NOTFOUND_WORD],
    CustomErrorDefinitions[CustomExceptionCode.FINISHED_QUIZ],
  ])
  @ApiPostResponse(QuizSolveResDto)
  @Post(':uuid')
  @HttpCode(HttpStatus.CREATED)
  async solveQuiz(@Jwt() JwtPayload: JwtPayLoad, @Param('uuid') uuid: string, @Body() dto: QuizAttemptReqDto) {
    const result = await this.quizService.solveQuiz(JwtPayload.id, uuid, dto);
    return plainToInstance(QuizSolveResDto, result, { excludeExtraneousValues: true });
  }
}
