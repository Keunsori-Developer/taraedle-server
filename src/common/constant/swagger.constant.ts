export const SWAGGER_RESPONSES = {
  UNAUTHORIZED: {
    description: 'Access Token이 없거나 유효하지 않음',
    status: 401,
    example: { message: 'Unauthorized', statusCode: 401 },
  },
  BADREQUEST: {
    description: '유효하지 않은 요청',
    status: 400,
    example: { message: 'Bad Request', statusCode: 400 },
  },
};
