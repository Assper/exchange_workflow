import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProcessExchangeUseCase, Exchange } from 'src/core';
import { ExchangeProducer } from 'src/infra/binance/exchange.producer';
import type { Plain } from 'src/shared';

@Injectable()
export class ExchangeConsumer implements OnModuleDestroy, OnModuleInit {
  constructor(
    private readonly processExchange: ProcessExchangeUseCase,
    private readonly exchangeProducer: ExchangeProducer,
  ) {}

  async onModuleInit() {
    await this.exchangeProducer.connect();
  }

  onModuleDestroy() {
    this.exchangeProducer.disconnect();
  }

  @OnEvent('exchange')
  async process(data: Plain<Exchange>) {
    try {
      const entity = Exchange.fromPlain(data);
      await this.processExchange.exec(entity);
    } catch (error) {
      console.error(error);
    }
  }
}
