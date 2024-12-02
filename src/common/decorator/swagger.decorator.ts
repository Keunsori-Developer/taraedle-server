import { Type, applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiGetResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
      type: model,
    }),
  );
};

export const ApiPostResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
      type: model,
      description,
    }),
  );
};
