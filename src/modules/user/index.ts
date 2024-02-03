import { Module } from '@nestjs/common';
import { UserSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './service';
import { UserController } from './controller';
import { EModelName } from 'src/shared/types';

/**
 * Manage Users
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: EModelName.USER, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
