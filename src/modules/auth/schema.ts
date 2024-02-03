import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ETokenType } from 'src/shared/types';

@Schema()
export class Token {
  @Prop()
  token: string | undefined;
  @Prop()
  user: string | undefined;
  @Prop()
  type: ETokenType | undefined;
  @Prop()
  expires: string | undefined;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
