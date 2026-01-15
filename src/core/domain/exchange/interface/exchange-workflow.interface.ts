import type { Exchange } from '../entities/exchange.entity'
import type { Limit } from '../entities/limit.entity'

export type ExchangeWorkflowData = Pick<Limit, 'up' | 'down'> &
  Pick<Exchange, 'from' | 'to' | 'rate' | 'id'>

export interface ExchangeWorkflow {
  runExchangeWorkflow(data: ExchangeWorkflowData): Promise<void>
}
