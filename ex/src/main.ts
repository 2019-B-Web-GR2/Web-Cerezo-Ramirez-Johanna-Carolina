import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
//import * as session from 'express-session';
//const FileStore = require('session-file-store')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule) as any;
  app.set('view engine', 'ejs');

  await app.listen(3000);
}
bootstrap();
