import { Module } from '@nestjs/common';
import pino from 'pino';
import { LoggerModule } from 'nestjs-pino';
import { CoreModule } from './core/core.module';
import { AppModule } from './app/app.module';
import { DbModule } from './infra/db/db.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { N8nModule } from './infra/n8n/n8n.module';
import { ConfigModule } from './global/config/config.module';

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
