import { Injectable } from '@nestjs/common'
import type { ConfigService as NestConfigService } from '@nestjs/config'
import { IsUrl } from 'class-validator'
import { ValidateEnv } from 'src/shared'

@ValidateEnv()
@Injectable()
export class BinanceConfig {
  @IsUrl(
    { protocols: ['wss'] },
    {
      message: `${BinanceConfig.name} - Binance stream socket url should be valid url`,
    },
  )
  readonly streamSocket: string

  constructor(private readonly configService: NestConfigService) {
    this.streamSocket = this.configService.getOrThrow<string>('binance.streamSocket')
  }
}
