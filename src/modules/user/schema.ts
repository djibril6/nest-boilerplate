import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TUser } from 'src/shared/types';

@Schema()
class User {
  @Prop({ type: mongoose.Schema.Types.String })
  username: TUser['username'];
  @Prop({ type: mongoose.Schema.Types.String })
  password?: TUser['password'];
  @Prop({ type: mongoose.Schema.Types.Date })
  created?: TUser['created'];
}
export const UserSchema = SchemaFactory.createForClass(User);
