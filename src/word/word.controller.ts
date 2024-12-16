import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorator/error-response.decorator';
import { Jwt, JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';
import { ApiGetResponse } from 'src/common/decorator/swagger.decorator';
import { CustomExceptionCode } from 'src/common/enum/custom-exception-code.enum';
import { CustomErrorDefinitions } from 'src/common/exception/error-definitions';
import { AddWordReqDto, SolveWordReqDto, GetWordReqDto as WordReqDto } from './dto/request.dto';
import { WordResDto } from './dto/response.dto';
import { WordService } from './word.service';

@ApiTags('Word')
@Controller('word')
export class WordController {
  constructor(private wordService: WordService) {}

  @ApiOperation({ summary: '랜덤한 단어 한개 반환', deprecated: true })
  @ApiGetResponse(WordResDto)
  @ApiErrorResponse([CustomErrorDefinitions[CustomExceptionCode.NOTFOUND_WORD]])
  @Get()
  @HttpCode(HttpStatus.OK)
  async getWord(@Query() dto: WordReqDto) {
    return await this.wordService.getRandomWord(dto);
  }

  @ApiOperation({ summary: '랜덤한 단어 한개 반환, jwt 인증 필요', deprecated: true })
  @ApiBearerAuth()
  @ApiGetResponse(WordResDto)
  @ApiErrorResponse([CustomErrorDefinitions[CustomExceptionCode.NOTFOUND_WORD]])
  @UseGuards(AuthGuard('jwt'))
  @Get('authtest')
  @HttpCode(HttpStatus.OK)
  async getWordAuth(@Query() dto: WordReqDto) {
    return await this.wordService.getRandomWord(dto);
  }

  @ApiOperation({ summary: '단어 정보 확인', deprecated: true })
  @ApiParam({ name: 'word' })
  @Get('check/:word')
  @HttpCode(HttpStatus.OK)
  async checkWord(@Param('word') word: string) {
    return await this.wordService.checkWord(word);
  }

  @ApiOperation({ summary: 'db에 단어 추가', deprecated: true })
  @ApiBody({ type: AddWordReqDto })
  @Post('')
  @HttpCode(HttpStatus.OK)
  async addWords(@Body() dto: AddWordReqDto) {
    return await this.wordService.addWordsIntoDatabase(dto.words);
  }

  @ApiOperation({ summary: '풀이 결과 저장', deprecated: true })
  @ApiBody({ type: SolveWordReqDto })
  @ApiErrorResponse([CustomErrorDefinitions[CustomExceptionCode.INVALID_WORD]])
  @Post('solve')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async solveWord(@Jwt() JwtPayload: JwtPayLoad, @Body() dto: SolveWordReqDto) {
    return await this.wordService.solveWord(JwtPayload.id, dto);
  }
}
