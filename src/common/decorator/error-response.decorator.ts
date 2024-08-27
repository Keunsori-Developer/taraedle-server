import { applyDecorators, HttpException, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResDto } from '../exception/error-response';

export interface ApiErrorResponseOption {
  model?: Type<HttpException>;

  exampleTitle: string;

  exampleDescription: string;

  message?: string;
  /**
   * Custom Exception Code
   */
  code?: number;
}

export const ApiErrorResponse = (errorResponseOptions: ApiErrorResponseOption[]) => {
  // Status code별로 에러를 그룹화
  const groupedByStatusCode = errorResponseOptions.reduce(
    (acc, error) => {
      const statusCode = error.model ? new error.model().getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      if (!acc[statusCode]) {
        acc[statusCode] = [];
      }
      acc[statusCode].push(error);
      return acc;
    },
    {} as Record<number, ApiErrorResponseOption[]>,
  );

  const decorators = Object.entries(groupedByStatusCode).map(([statusCode, errors]) => {
    const examples = errors
      .map((error: ApiErrorResponseOption) => {
        const innerErrorDto = new ErrorResDto(+statusCode, error.code, error.message);
        return {
          [error.exampleTitle]: {
            value: innerErrorDto,
            description: error.exampleDescription,
          },
        };
      })
      .reduce(function (result, item) {
        Object.assign(result, item);
        return result;
      }, {});

    return ApiResponse({
      status: +statusCode,
      content: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'application/json': {
          schema: {
            $ref: getSchemaPath(ErrorResDto),
          },
          examples: examples,
        },
      },
    });
  });

  return applyDecorators(ApiExtraModels(ErrorResDto), ...decorators);
};
