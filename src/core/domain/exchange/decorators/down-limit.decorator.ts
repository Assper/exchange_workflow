import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNumber,
} from 'class-validator';

export function IsDownLimit(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDownLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const upLimit = (args.object as any)['up'];
          return isNumber(value) && value >= 0 && value < upLimit;
        },
      },
    });
  };
}
