import { validateSync } from 'class-validator';
import { Constructor } from '../types';
import { ValidateError } from '../errors';

export const Validate = <T extends Constructor<any>>() => {
  return ((target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);

        const errors = validateSync(this);
        if (errors.length > 0) {
          throw new ValidateError(errors);
        }
      }
    };
  }) as ClassDecorator;
};
