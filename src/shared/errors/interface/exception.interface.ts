export type ExceptionLayer = 'infra' | 'domain' | 'use-case'
export type ExceptionDetails = Record<string, unknown>

export interface IException {
  readonly code: string
  readonly message: string
  readonly layer: ExceptionLayer
  readonly details?: ExceptionDetails
  readonly cause?: Error
}
