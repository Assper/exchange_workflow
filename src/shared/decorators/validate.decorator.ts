import { validateSync } from 'class-validator'
import { ValidateError } from '../errors'
import type { Constructor } from '../types'

// biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] args
export const Validate = <T extends Constructor<object, any[]>>() => {
  return ((target: T): T => {
    return class extends target {
      // biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] args
      constructor(...args: any[]) {
        super(...args)

        const errors = validateSync(this)
        if (errors.length > 0) {
          throw new ValidateError(errors)
        }
      }
    }
  }) as ClassDecorator
}
