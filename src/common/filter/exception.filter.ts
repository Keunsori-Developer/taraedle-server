import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResDto } from '../exception/error-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      message: 'Internal Server Error',
    };

    const errorResponseForLog = {
      statusCode: status,
      message: exception instanceof Error ? exception.message : 'Internal Server Error',
      path: request.url,
    };
    const { ip, method, originalUrl } = request;
    const logMessage = `${method} ${originalUrl} ${status}  ${JSON.stringify(errorResponseForLog)} - ${ip}`;
    this.logger.error(logMessage);

    response.status(status).json(errorResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse: any = exception.getResponse();

    const responseJson: ErrorResDto = {
      statusCode: errorResponse.statusCode ?? status,
      errorCode: errorResponse.errorCode,
      message: errorResponse.message,
      error: errorResponse.error,
    };
    const { ip, method, originalUrl } = request;
    const logMessage = `${method} ${originalUrl} ${status}  ${JSON.stringify(responseJson)} - ${ip}`;

    this.logger.log(logMessage);
    response.status(status).json(responseJson);
  }
}
