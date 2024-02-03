import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Response, Request, urlencoded, json } from 'express';
import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use(compression());

  // the base url of the api will be https://{domain}/v1/
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // You can control what kind of config are allowed by your api here
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT,PATCH, DELETE, OPTIONS',
    );
    next();
  });

  await app.listen(process.env.PORT);
}
bootstrap();
