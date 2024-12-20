import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Jwt = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export interface JwtPayLoad {
  id: string;
  tkn: string;
}
