import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    status: HttpStatus,
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    const { description, httpExceptionOptions } = HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    super(HttpException.createBody(objectOrError, description, status), status, httpExceptionOptions);
  }
}
