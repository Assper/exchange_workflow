import {
  isNumber,
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator'
import type { ExchangeLimit } from '../exchange-limit'

export function IsDownLimit(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isDownLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const upLimit = (args.object as ExchangeLimit).up
          return isNumber(value) && value >= 0 && value < upLimit
        },
      },
    })
  }
}
