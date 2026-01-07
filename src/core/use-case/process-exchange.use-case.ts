import { Inject, Injectable } from '@nestjs/common';
import {
  EXCHANGE_REPO,
  EXCHANGE_WORKFLOW,
  LIMIT_REPO,
} from '../provider-tokens';
import {
  Exchange,
  ExchangeLimit,
  Limit,
  type LimitRepo,
  PersistedExchange,
  type ExchangeRepo,
  type ExchangeWorkflow,
} from '../domain';
import { UseCase } from 'src/shared';

@Injectable()
export class ProcessExchangeUseCase implements UseCase<Exchange, void> {
  constructor(
    @Inject(EXCHANGE_WORKFLOW)
    private readonly exchangeWorkflow: ExchangeWorkflow,
    @Inject(EXCHANGE_REPO) private readonly exchangeRepo: ExchangeRepo,
    @Inject(LIMIT_REPO) private readonly limitRepo: LimitRepo,
  ) {}

  private async getConfigs(): Promise<Limit[]> {
    return await this.limitRepo.getAll();
  }

  private async getConfigByExchange(exchange: Exchange): Promise<Limit | null> {
    const configs = await this.getConfigs();
    return (
      configs.find(
        (config) => config.from === exchange.from && config.to === exchange.to,
      ) || null
    );
  }

  async exec(entity: Exchange): Promise<void> {
    const exchange = new PersistedExchange(entity, this.exchangeRepo);
    const config = await this.getConfigByExchange(entity);
    if (!config) {
      throw new Error('Limit not found');
    }

    const limit = new ExchangeLimit(entity, config);
    const prev = await this.exchangeRepo.readPrev(entity);
    const diff = prev ? Math.abs(entity.rate - prev.rate) : config.threshold;
    if (diff >= config.threshold) {
      await exchange.save();
      if (!limit.isWithin()) {
        await this.exchangeWorkflow.runExchangeWorkflow({
          up: config.up,
          down: config.down,
          from: entity.from,
          to: entity.to,
          rate: entity.rate,
          id: entity.id,
        });
      }
    }
  }
}
