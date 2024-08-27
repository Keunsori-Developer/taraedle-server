import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_RESPONSES } from 'src/common/constant/swagger.constant';
import { WordService } from './word.service';
import { AddWordReqDto, GetWordReqDto, SolveWordReqDto } from './dto/request.dto';
import { Jwt, JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';

@ApiTags('Word')
@ApiUnauthorizedResponse(SWAGGER_RESPONSES.UNAUTHORIZED)
@Controller('word')
export class WordController {
  constructor(private wordService: WordService) {}

  @ApiOperation({ summary: '랜덤한 단어 한개 반환' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getWord(@Query() dto: GetWordReqDto) {
    return await this.wordService.getRandomWord(dto);
  }

  @ApiOperation({ summary: '랜덤한 단어 한개 반환, jwt 인증 필요' })
  @ApiBearerAuth()
  @Get('authtest')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getWordAuth(@Query() dto: GetWordReqDto) {
    return await this.wordService.getRandomWord(dto);
  }

  @ApiOperation({})
  @ApiParam({ name: 'word' })
  @Get('check/:word')
  @HttpCode(HttpStatus.OK)
  checkWord(@Param('word') word: string) {
    return this.wordService.checkWord(word);
  }

  @ApiOperation({ summary: 'db에 단어 추가' })
  @ApiBody({ type: AddWordReqDto })
  @Post('')
  @HttpCode(HttpStatus.OK)
  addWords(@Body() dto: AddWordReqDto) {
    return this.wordService.addWordsIntoDatabase(dto.words);
  }

  @ApiOperation({ summary: '풀이 결과 저장' })
  @ApiBody({ type: SolveWordReqDto })
  @Post('solve')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  solveWord(@Jwt() JwtPayload: JwtPayLoad, @Body() dto: SolveWordReqDto) {
    return this.wordService.solveWord(JwtPayload.id, dto);
  }
}
