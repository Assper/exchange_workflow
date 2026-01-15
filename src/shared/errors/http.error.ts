import { HttpStatus } from '@nestjs/common'
import { InfraException } from './abstract/infra.exception'
import { ErrorCode } from './enums/error-code.enum'

export class HttpError extends InfraException {
  constructor(
    readonly status = HttpStatus.INTERNAL_SERVER_ERROR,
    message = 'HTTP request failed',
    cause?: Error,
  ) {
    super({
      code: ErrorCode.Http,
      message,
      cause,
    })
  }
}
