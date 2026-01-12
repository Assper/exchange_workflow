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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProcessExchangeUseCase implements UseCase<Exchange, void> {
  constructor(
    @Inject(EXCHANGE_WORKFLOW)
    private readonly exchangeWorkflow: ExchangeWorkflow,
    @InjectPinoLogger(ProcessExchangeUseCase.name)
    private readonly logger: PinoLogger,
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
      this.logger.error(`Limit not found for exchange: ${entity.id}`);
      throw new Error('Limit not found');
    }

    const limit = new ExchangeLimit(entity, config);
    const prev = await this.exchangeRepo.readPrev(entity);
    const diff = prev ? Math.abs(entity.rate - prev.rate) : config.threshold;
    if (diff >= config.threshold) {
      this.logger.info(`Detect exchange diff threshold overflow:`);
      this.logger.info(`Exchange: ${entity.id}`);
      if (prev) this.logger.info(`Prev: ${prev.rate}`);
      this.logger.info(`Current: ${entity.rate}`);
      this.logger.info(`Threshold: ${config.threshold}`);

      await exchange.save();
      if (!limit.isWithin()) {
        this.logger.info(`Limit overflow detected for exchange: ${entity.id}`);
        this.logger.info('Running exchange workflow...');
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
