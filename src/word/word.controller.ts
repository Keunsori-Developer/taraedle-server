import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_RESPONSES } from 'src/common/constant/swagger.constant';
import { WordService } from './word.service';
import { AddWordReqDto } from './dto/request.dto';

@ApiTags('Word')
@ApiUnauthorizedResponse(SWAGGER_RESPONSES.UNAUTHORIZED)
@Controller('word')
export class WordController {
  constructor(private wordService: WordService) {}

  @ApiOperation({ summary: '랜덤한 단어 한개 반환' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getWord() {
    return await this.wordService.getRandomWord();
  }

  @ApiOperation({ summary: '랜덤한 단어 한개 반환, jwt 인증 필요' })
  @ApiBearerAuth()
  @Get('authtest')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getWordAuth() {
    return await this.wordService.getRandomWord();
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
}
