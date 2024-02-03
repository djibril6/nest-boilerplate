import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TokenSchema } from './schema';
import { AuthService } from './service';
import { EModelName } from 'src/shared/types';
import { UserModule } from '../user';
import { AuthController } from './controller';

/**
 * User authentication flow management
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EModelName.TOKEN, schema: TokenSchema },
    ]),
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
