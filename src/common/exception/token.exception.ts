import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';

import { CustomExceptionCode } from '../enum/custom-exception-code.enum';
import { ErrorResponse } from './error-response';
import { CustomException } from './http-custom.exception';

class UnauthorizedTokenException extends CustomException {
  constructor(error: ErrorResponse) {
    super(HttpStatus.UNAUTHORIZED, error, error.message);
  }
}

export class InvalidJwtException extends UnauthorizedTokenException {
  constructor(message?: string | HttpExceptionOptions) {
    super({ errorCode: CustomExceptionCode.INVALID_JWT, message: message });
  }
}

export class ExpiredJwtException extends UnauthorizedTokenException {
  constructor(message?: string | HttpExceptionOptions) {
    super({ errorCode: CustomExceptionCode.EXPIRED_JWT, message: message });
  }
}
