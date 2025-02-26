import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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
      error:
        exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : 'Internal Server Error',
      path: request.url,
    };

    response.locals.error = errorResponseForLog;
    response.status(status).json(errorResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse: any = exception.getResponse();

    const responseJson = {
      statusCode: errorResponse.statusCode ?? status,
      errorCode: errorResponse.errorCode,
      message: errorResponse.message,
      error: errorResponse.error,
    };

    response.locals.error = responseJson;
    response.status(status).json(responseJson);
  }
}
