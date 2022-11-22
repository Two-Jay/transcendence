import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
