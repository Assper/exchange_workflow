import { Injectable } from '@nestjs/common'
import type { ConfigService as NestConfigService } from '@nestjs/config'
import { IsBoolean, IsIn, IsInt, IsPositive } from 'class-validator'
import { ValidateEnv } from 'src/shared'

const envs = ['production', 'test', 'development']
type Env = 'production' | 'test' | 'development'

@ValidateEnv()
@Injectable()
export class AppConfig {
  @IsIn(['production', 'test', 'development'], {
    message: `${AppConfig.name} - Env should be some of ${envs.join(', ')}`,
  })
  readonly env: Env

  @IsInt({ message: `${AppConfig.name} - Port is required` })
  @IsPositive({
    message: `${AppConfig.name} - Port should be valid integer value`,
  })
  readonly port: number

  @IsBoolean({
    message: `${AppConfig.name} - IsDev should be valid boolean value`,
  })
  readonly isDev: boolean

  @IsBoolean({
    message: `${AppConfig.name} - IsTest should be valid boolean value`,
  })
  readonly isTest: boolean

  @IsBoolean({
    message: `${AppConfig.name} - IsProd should be valid boolean value`,
  })
  readonly isProd: boolean

  constructor(private readonly configService: NestConfigService) {
    this.env = this.configService.getOrThrow<Env>('appEnv')
    this.port = this.configService.getOrThrow<number>('port')
    this.isDev = this.env === 'development'
    this.isTest = this.env === 'test'
    this.isProd = this.env === 'production'
  }
}
