import { validateSync } from 'class-validator'
import { EnvError } from '../errors'
import type { Constructor } from '../types'

// biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] args
export const ValidateEnv = <T extends Constructor<object, any[]>>() => {
  return ((target: T): T => {
    return class extends target {
      // biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] args
      constructor(...args: any[]) {
        super(...args)

        const errors = validateSync(this)
        if (errors.length > 0) {
          throw new EnvError(
            errors.map((error) => error.toString()).join('\n'),
            errors as unknown as Error,
          )
        }
      }
    }
  }) as ClassDecorator
}
