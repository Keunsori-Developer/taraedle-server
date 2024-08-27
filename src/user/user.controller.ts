import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Jwt, JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';
import { UserResDto } from './dto/response.dto';
import { ApiErrorResponse } from 'src/common/decorator/error-response.decorator';
import { CustomExceptionCode } from 'src/common/enum/custom-exception-code.enum';
import { CustomErrorDefinitions } from 'src/common/exception/error-definitions';

@ApiTags('User')
@ApiBearerAuth()
@ApiErrorResponse([
  CustomErrorDefinitions[CustomExceptionCode.INVALID_JWT],
  CustomErrorDefinitions[CustomExceptionCode.EXPIRED_JWT],
])
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 반환' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResDto })
  @ApiErrorResponse([CustomErrorDefinitions[CustomExceptionCode.INVALID_USER]])
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getMe(@Jwt() JwtPayload: JwtPayLoad) {
    return await this.userService.getMyUserData(JwtPayload.id);
  }
}
