import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import type { ExchangeWorkflow, ExchangeWorkflowData } from 'src/core'
import { N8NConfig } from 'src/global/config/n8n.config'

@Injectable()
export class N8NClient implements ExchangeWorkflow {
  constructor(private readonly n8NConfig: N8NConfig, private readonly http: HttpService) {}

  async runExchangeWorkflow(data: ExchangeWorkflowData) {
    try {
      const req$ = this.http.post(this.n8NConfig.exchangeUrl, data, {
        headers: {
          Authorization: this.n8NConfig.apiToken,
        },
      })
      await firstValueFrom(req$)
    } catch (error) {
      console.error('Error running workflow:', error)
      throw error
    }
  }
}
