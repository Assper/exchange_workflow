import { Module } from '@nestjs/common';
import { ExchangeProducer } from './exchange.producer';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [ExchangeProducer],
  exports: [ExchangeProducer],
})
export class BinanceModule {}
