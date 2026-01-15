import { UseCaseException } from './abstract/use-case.error'
import { ErrorCode } from './enums/error-code.enum'

export class ValidateError extends UseCaseException {
  constructor(errors: unknown[], message = 'Validation error', cause?: Error) {
    super({
      code: ErrorCode.Validate,
      message,
      cause,
      details: { errors },
    })
  }
}
