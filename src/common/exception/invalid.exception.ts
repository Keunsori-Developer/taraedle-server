import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';

import { CustomExceptionCode } from '../enum/custom-exception-code.enum';
import { ErrorResponse } from './error-response';
import { CustomException } from './http-custom.exception';

class InvalidException extends CustomException {
  constructor(error: ErrorResponse) {
    super(HttpStatus.BAD_REQUEST, error, error.message);
  }
}

export class InvalidUserException extends InvalidException {
  constructor(message?: string | HttpExceptionOptions) {
    super({ errorCode: CustomExceptionCode.INVALID_USER, message: message });
  }
}

export class InvalidWordException extends InvalidException {
  constructor(message?: string | HttpExceptionOptions) {
    super({ errorCode: CustomExceptionCode.INVALID_WORD, message: message });
  }
}

export class InvalidJwtTokenException extends InvalidException {
  constructor(message?: string | HttpExceptionOptions) {
    super({ errorCode: CustomExceptionCode.INVALID_JWT, message: message });
  }
}
