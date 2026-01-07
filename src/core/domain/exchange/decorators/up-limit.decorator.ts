import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNumber,
} from 'class-validator';

export function IsUpLimit(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUpLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const downLimit = (args.object as any)['down'];
          return isNumber(value) && value > 0 && value > downLimit;
        },
      },
    });
  };
}
