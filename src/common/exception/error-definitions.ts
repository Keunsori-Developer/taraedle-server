import { ApiErrorResponseOption } from '../decorator/error-response.decorator';
import { CustomExceptionCode } from '../enum/custom-exception-code.enum';
import { InvalidUserException, InvalidWordException } from './invalid.exception';
import { ExpiredJwtException, InvalidJwtException } from './token.exception';

export const CustomErrorDefinitions: Record<CustomExceptionCode, ApiErrorResponseOption> = {
  [CustomExceptionCode.INVALID_USER]: {
    model: InvalidUserException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.INVALID_USER],
    exampleDescription: `유효하지 않은 유저 (${CustomExceptionCode.INVALID_USER})`,
    code: CustomExceptionCode.INVALID_USER,
  },

  [CustomExceptionCode.INVALID_JWT]: {
    model: InvalidJwtException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.INVALID_JWT],
    exampleDescription: `유효하지 않은 JWT토큰 (${CustomExceptionCode.INVALID_JWT})`,
    code: CustomExceptionCode.INVALID_JWT,
  },
  [CustomExceptionCode.EXPIRED_JWT]: {
    model: ExpiredJwtException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.EXPIRED_JWT],
    exampleDescription: `만료된 JWT토큰 (${CustomExceptionCode.EXPIRED_JWT})`,
    code: CustomExceptionCode.EXPIRED_JWT,
  },
  [CustomExceptionCode.INVALID_WORD]: {
    model: InvalidWordException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.INVALID_WORD],
    exampleDescription: `유효하지 않은 단어 (${CustomExceptionCode.INVALID_WORD})`,
    code: CustomExceptionCode.INVALID_WORD,
  },
};
