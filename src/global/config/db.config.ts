import { Injectable } from '@nestjs/common'
import type { ConfigService as NestConfigService } from '@nestjs/config'
import { IsString, IsUrl } from 'class-validator'
import { ValidateEnv } from 'src/shared'

@ValidateEnv()
@Injectable()
export class DbConfig {
  @IsUrl(
    { require_tld: false, protocols: ['http', 'https', 'ws', 'wss'] },
    {
      message: `${DbConfig.name} - rpc should be valid url`,
    },
  )
  readonly rpc: string

  @IsString({
    message: `${DbConfig.name} - user should be valid string`,
  })
  readonly user: string

  @IsString({
    message: `${DbConfig.name} - password should be valid string`,
  })
  readonly password: string

  @IsString({
    message: `${DbConfig.name} - db should be valid string`,
  })
  readonly db: string

  @IsString({
    message: `${DbConfig.name} - namespace should be valid string`,
  })
  readonly namespace: string

  constructor(private readonly configService: NestConfigService) {
    this.rpc = this.configService.getOrThrow<string>('db.rpc')
    this.user = this.configService.getOrThrow<string>('db.user')
    this.password = this.configService.getOrThrow<string>('db.password')
    this.db = this.configService.getOrThrow<string>('db.db')
    this.namespace = this.configService.getOrThrow<string>('db.namespace')
  }
}
