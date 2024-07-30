import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiGetResponse = <TModel extends Type<any>>(model: TModel | TModel[]) => {
  const isArray = Array.isArray(model);
  const modelSchema = isArray ? getSchemaPath((model as Type<any>[])[0]) : getSchemaPath(model as Type<any>);

  return applyDecorators(
    ApiOkResponse({
      schema: isArray ? { type: 'array', items: { $ref: modelSchema } } : { allOf: [{ $ref: modelSchema }] },
    }),
  );
};

export const ApiPostResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
      type: model,
    }),
  );
};
