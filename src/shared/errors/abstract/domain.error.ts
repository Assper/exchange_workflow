import { BaseException } from './base-exception.abstract'

export abstract class DomainException extends BaseException {
  readonly layer = 'domain'
}
