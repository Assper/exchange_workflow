import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { RootModule } from './root.module';
import { AppConfig } from './global/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(RootModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const config = app.get(AppConfig);
  await app.listen(config.port);
}
bootstrap().catch(console.error);
