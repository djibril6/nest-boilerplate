import { Document } from 'mongoose';
import { ETokenType } from '.';

export interface TToken {
  token: string;
  user: string;
  type: ETokenType;
  expires: string;
}

export interface TTokenModel extends TToken, Document {
  readonly token: string;
  readonly user: string;
  readonly type: ETokenType;
  readonly expires: string;
}

export interface Auth {
  refresh: string;
  session: string;
}
