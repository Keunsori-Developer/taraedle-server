import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';

import { CustomExceptionCode } from '../enum/custom-exception-code.enum';
import { ErrorResponse } from './error-response';
import { CustomException } from './http-custom.exception';

class NotFoundException extends CustomException {
  constructor(error: ErrorResponse) {
    super(HttpStatus.NOT_FOUND, error, error.message);
  }
}

export class NotFoundWordException extends NotFoundException {
  constructor(message?: string | HttpExceptionOptions) {
    super({ errorCode: CustomExceptionCode.NOTFOUND_WORD, message: message });
  }
}
