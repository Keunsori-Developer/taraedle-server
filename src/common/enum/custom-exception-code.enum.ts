/** https://app.clickup.com/9018040904/v/dc/8cr8rj8-13498/8cr8rj8-15818 예외 코드를 추가해야 한다면, 위 링크를 참고할 것! */
export enum CustomExceptionCode {
  // AUTH/USER 10000
  INVALID_USER = 10001,

  // JWT 20000
  INVALID_JWT = 20001,
  EXPIRED_JWT = 20002,

  // WORD 30000
  INVALID_WORD = 30001,
}
