import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { EXCHANGE_WORKFLOW } from 'src/core/provider-tokens'
import { N8NClient } from './n8n.client'

const providers = [
  {
    provide: EXCHANGE_WORKFLOW,
    useClass: N8NClient,
  },
]

@Module({
  imports: [HttpModule],
  providers,
  exports: providers,
})
export class N8nModule {}
