import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_RESPONSES } from 'src/common/constant/swagger.constant';

@ApiTags('Word')
@ApiUnauthorizedResponse(SWAGGER_RESPONSES.UNAUTHORIZED)
@Controller('word')
@UseGuards(AuthGuard('jwt'))
export class WordController {
  constructor() {}

  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  getWord() {
    return 'apple';
  }
}
