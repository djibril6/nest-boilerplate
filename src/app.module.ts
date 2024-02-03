import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';

import { ENodeEnv } from './shared/types';
import { UserModule } from './modules/user';
import { AuthModule } from './modules/auth';

const appModules = [UserModule, AuthModule];

@Module({
  imports: [
    ...appModules,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      autoIndex: process.env.NODE_ENV == ENodeEnv.DEV,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
