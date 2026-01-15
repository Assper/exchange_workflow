import type { Exchange } from './entities/exchange.entity'
import type { ExchangeRepo } from './interface/exchange-repo.interface'

export class PersistedExchange {
  constructor(
    readonly exchange: Exchange,
    private readonly repo: ExchangeRepo,
  ) {}

  static async fromId(id: string, repo: ExchangeRepo): Promise<PersistedExchange> {
    const exchange = await repo.readById(id)
    if (!exchange) {
      throw new Error(`Exchange with id ${id} not found`)
    }
    return new PersistedExchange(exchange, repo)
  }

  async save() {
    await this.repo.create(this.exchange)
  }
}
