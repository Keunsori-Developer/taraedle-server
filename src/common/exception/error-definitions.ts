import { ApiErrorResponseOption } from '../decorator/error-response.decorator';
import { CustomExceptionCode } from '../enum/custom-exception-code.enum';
import {
  FinishedQuizException,
  InvalidQuizException,
  InvalidUserException,
  InvalidWordException,
} from './invalid.exception';
import { NotFoundWordException } from './notfound.exception';
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

  [CustomExceptionCode.INVALID_QUIZ]: {
    model: InvalidQuizException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.INVALID_QUIZ],
    exampleDescription: `유효하지 않은 퀴즈 (${CustomExceptionCode.INVALID_QUIZ})`,
    code: CustomExceptionCode.INVALID_QUIZ,
  },

  [CustomExceptionCode.FINISHED_QUIZ]: {
    model: FinishedQuizException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.FINISHED_QUIZ],
    exampleDescription: `이미 풀린 퀴즈 (${CustomExceptionCode.FINISHED_QUIZ})`,
    code: CustomExceptionCode.FINISHED_QUIZ,
  },
  [CustomExceptionCode.NOTFOUND_WORD]: {
    model: NotFoundWordException,
    exampleTitle: CustomExceptionCode[CustomExceptionCode.NOTFOUND_WORD],
    exampleDescription: `해당 요청으로 단어가 존재하지 않음 (${CustomExceptionCode.NOTFOUND_WORD})`,
    code: CustomExceptionCode.NOTFOUND_WORD,
  },
};
