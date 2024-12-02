import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const realIp = request.get('X-Forwarded-For') ?? ip;

    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${realIp}`);
    });

    next();
  }
}
