import type { DynamicModule } from '@nestjs/common'
import type { ModuleDefinition } from '@nestjs/core/interfaces/module-definition.interface'
import { ProcessExchangeUseCase } from './use-case/process-exchange.use-case'

export class CoreModule {
  static forRoot(deps: ModuleDefinition[]): DynamicModule {
    return {
      global: true,
      module: CoreModule,
      imports: deps,
      providers: [ProcessExchangeUseCase],
      exports: [ProcessExchangeUseCase],
    }
  }
}
