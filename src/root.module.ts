import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AppModule } from './app/app.module';
import { DbModule } from './infra/db/db.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { N8nModule } from './infra/n8n/n8n.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CoreModule.forRoot([DbModule, N8nModule]),
    AppModule,
  ],
})
export class RootModule {}
