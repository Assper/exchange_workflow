import { validateSync } from 'class-validator';
import { Constructor } from '../types';
import { EnvError } from '../errors';

export const ValidateEnv = <T extends Constructor<any>>() => {
  return ((target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);

        const errors = validateSync(this);
        if (errors.length > 0) {
          throw new EnvError(
            errors.map((error) => error.toString()).join('\n'),
          );
        }
      }
    };
  }) as ClassDecorator;
};
