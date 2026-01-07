import { BaseException } from './base-exception.abstract'

export abstract class UseCaseException extends BaseException {
  readonly layer = 'use-case'
}
