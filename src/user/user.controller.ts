import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Jwt, JwtPayLoad } from 'src/common/decorator/jwt-payload.decorator';

import { UserResDto } from './dto/response.dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 반환' })
  @ApiResponse({ type: UserResDto })
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getMe(@Jwt() JwtPayload: JwtPayLoad) {
    return await this.userService.getMyUserData(JwtPayload.id);
  }
}
