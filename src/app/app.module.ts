import { Module } from '@nestjs/common'
import { BinanceModule } from 'src/infra/binance/binance.module'
import { ExchangeConsumer } from './exchange.consumer'

@Module({
  imports: [BinanceModule],
  providers: [ExchangeConsumer],
})
export class AppModule {}
