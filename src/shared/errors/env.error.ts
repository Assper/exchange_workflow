import { InfraException } from './abstract/infra.exception';
import { ErrorCode } from './enums/error-code.enum';

export class EnvError extends InfraException {
  constructor(message = 'Environment error', cause?: Error) {
    super({
      code: ErrorCode.Env,
      message,
      cause,
    });
  }
}
