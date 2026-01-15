import { Module } from '@nestjs/common'
import { DbModule } from '../db/db.module'
import { ExchangeProducer } from './exchange.producer'

@Module({
  imports: [DbModule],
  providers: [ExchangeProducer],
  exports: [ExchangeProducer],
})
export class BinanceModule {}
