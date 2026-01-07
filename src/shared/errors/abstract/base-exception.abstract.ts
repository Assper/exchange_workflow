import {
  ExceptionDetails,
  ExceptionLayer,
  IException,
} from '../interface/exception.interface'

export abstract class BaseException extends Error implements IException {
  abstract readonly layer: ExceptionLayer
  readonly code: string
  readonly message: string
  readonly details?: ExceptionDetails
  readonly cause?: Error

  constructor({ code, message, details, cause }: Omit<IException, 'layer'>) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.message = message
    this.details = details
    this.cause = cause
  }
}
