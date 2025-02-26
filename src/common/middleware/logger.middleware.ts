import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WinstonLogger } from '../util/winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = WinstonLogger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const realIp = request.get('X-Forwarded-For') ?? ip;

    response.on('finish', () => {
      const { statusCode } = response;
      const logData = {
        http: {
          method,
          url_details: {
            path: originalUrl,
          },
          status_code: statusCode,
          request: {
            body: request.body,
            params: request.params,
            query: request.query,
          },
        },
        client: {
          ip: realIp,
        },
        error: response?.locals?.error,
      };

      if (statusCode >= 500) {
        this.logger.error(logData);
      } else if (statusCode >= 400) {
        this.logger.warn(logData);
      } else {
        this.logger.log(logData);
      }
    });

    next();
  }
}
