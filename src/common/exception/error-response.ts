import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorResponse {
  @ApiProperty({ example: 10000, type: 'number' })
  readonly errorCode: string;

  @ApiProperty({ example: '' })
  readonly message: any;
  constructor(errorCode?: string, message?: any) {
    this.errorCode = errorCode;
    this.message = message;
  }
}

export class ErrorResDto {
  @ApiProperty({ type: Number })
  @Expose()
  statusCode: number;

  @ApiPropertyOptional({ type: String })
  @Expose()
  errorCode?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  message?: string;

  @ApiPropertyOptional({})
  @Expose()
  error?: any;

  constructor(statusCode: number, errorCode?: string, message?: string, error?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;
    this.error = error;
  }
}
