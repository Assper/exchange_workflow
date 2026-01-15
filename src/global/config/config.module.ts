import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { AppConfig } from './app.config'
import { BinanceConfig } from './binance.config'
import { config } from './config'
import { DbConfig } from './db.config'
import { N8NConfig } from './n8n.config'

const configs = [AppConfig, BinanceConfig, DbConfig, N8NConfig]

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ load: [config] })],
  providers: [...configs],
  exports: [...configs],
})
export class ConfigModule {}
