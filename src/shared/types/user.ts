import { Document } from 'mongoose';

export type TUser = {
  username: string;
  password: string;
  created?: Date;
};

export type UserField = {
  [key in keyof TUser]?: 1 | -1;
};

export interface TUserModel extends TUser, Document {
  readonly _id: string;
}
