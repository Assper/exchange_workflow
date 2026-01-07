import { DynamicModule } from '@nestjs/common';
import { ProcessExchangeUseCase } from './use-case/process-exchange.use-case';
import { ModuleDefinition } from '@nestjs/core/interfaces/module-definition.interface';

export class CoreModule {
  static forRoot(deps: ModuleDefinition[]): DynamicModule {
    return {
      global: true,
      module: CoreModule,
      imports: deps,
      providers: [ProcessExchangeUseCase],
      exports: [ProcessExchangeUseCase],
    };
  }
}
