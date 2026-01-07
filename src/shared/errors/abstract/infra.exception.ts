import { BaseException } from './base-exception.abstract'

export abstract class InfraException extends BaseException {
  readonly layer = 'infra'
}
