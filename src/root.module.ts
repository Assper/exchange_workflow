import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LoggerModule } from 'nestjs-pino'
import pino from 'pino'
import { AppModule } from './app/app.module'
import { CoreModule } from './core/core.module'
import { ConfigModule } from './global/config/config.module'
import { DbModule } from './infra/db/db.module'
import { N8nModule } from './infra/n8n/n8n.module'

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty' },
        stream: pino.destination({
          dest: './exchange_workflow.log',
          minLength: 4096,
          sync: false,
        }),
      },
    }),
    EventEmitterModule.forRoot(),
    CoreModule.forRoot([DbModule, N8nModule]),
    AppModule,
  ],
})
export class RootModule {}
