import { Module } from '@nestjs/common'
import { EXCHANGE_REPO, LIMIT_REPO } from 'src/core/provider-tokens'
import { ExchangeRepoIml } from './repos/exchange.repo'
import { LimitRepoIml } from './repos/limit.repo'
import { SurrealClient } from './surreal/surreal.client'

const repositories = [
  {
    provide: EXCHANGE_REPO,
    useClass: ExchangeRepoIml,
  },
  {
    provide: LIMIT_REPO,
    useClass: LimitRepoIml,
  },
]

@Module({
  providers: [...repositories, SurrealClient],
  exports: [...repositories],
})
export class DbModule {}
