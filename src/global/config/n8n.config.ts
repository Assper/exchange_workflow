import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { IsString, IsUrl } from 'class-validator'
import { ValidateEnv } from 'src/shared'

@ValidateEnv()
@Injectable()
export class N8NConfig {
  @IsUrl(
    { require_tld: false },
    {
      message: `${N8NConfig.name} - N8N exchange workflow url should be valid url`,
    },
  )
  readonly exchangeUrl: string

  @IsString({ message: `${N8NConfig.name} - N8N api token should be string` })
  readonly apiToken: string

  constructor(private readonly configService: NestConfigService) {
    this.exchangeUrl = this.configService.getOrThrow<string>('n8n.exchangeUrl')
    this.apiToken = this.configService.getOrThrow<string>('n8n.apiToken')
  }
}
