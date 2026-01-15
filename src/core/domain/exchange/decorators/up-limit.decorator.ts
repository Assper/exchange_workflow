import { isNumber, registerDecorator, type ValidationArguments, type ValidationOptions } from 'class-validator'
import type { Limit } from '../entities/limit.entity'

export function IsUpLimit(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isUpLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const downLimit = (args.object as Limit).down
          return isNumber(value) && value > 0 && value > downLimit
        },
      },
    })
  }
}
