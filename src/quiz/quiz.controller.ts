import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { Jwt, JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';
import { QuizResDto, QuizSolveResDto } from './dto/quiz.response.dto';
import { plainToInstance } from 'class-transformer';
import { QuizAttemptReqDto } from './dto/quiz.request.dto';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { AuthGuard } from '@nestjs/passport';

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
  async startNewQuiz(@Jwt() JwtPayload: JwtPayLoad) {
    const quiz = await this.quizService.startNewQuiz(JwtPayload.id);
    return plainToInstance(QuizResDto, quiz, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: '퀴즈 풀이 요청' })
  @ApiParam({ name: 'uuid', description: '퀴즈 UUID', type: String })
  @ApiPostResponse(QuizSolveResDto)
  @Post(':uuid')
  @HttpCode(HttpStatus.CREATED)
  async solveQuiz(@Jwt() JwtPayload: JwtPayLoad, @Param('uuid') uuid: string, @Body() dto: QuizAttemptReqDto) {
    const result = await this.quizService.solveQuiz(JwtPayload.id, uuid, dto);
    return plainToInstance(QuizSolveResDto, result, { excludeExtraneousValues: true });
  }
}
