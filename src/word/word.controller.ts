import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_RESPONSES } from 'src/common/constant/swagger.constant';
import { WordService } from './word.service';

@ApiTags('Word')
@ApiUnauthorizedResponse(SWAGGER_RESPONSES.UNAUTHORIZED)
@Controller('word')
export class WordController {
  constructor(private wordService: WordService) {}

  @ApiOperation({ summary: '랜덤한 단어 한개 반환' })
  @Get()
  @HttpCode(HttpStatus.OK)
  getWord() {
    return this.wordService.getRandomWord();
  }

  @ApiOperation({ summary: '랜덤한 단어 한개 반환, jwt 인증 필요' })
  @ApiBearerAuth()
  @Get('authtest')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getWordAuth() {
    return this.wordService.getRandomWord();
  }
}
