import { Module } from '@nestjs/common';
import { ExchangeConsumer } from './exchange.consumer';
import { BinanceModule } from 'src/infra/binance/binance.module';

@Module({
  imports: [BinanceModule],
  providers: [ExchangeConsumer],
})
export class AppModule {}
