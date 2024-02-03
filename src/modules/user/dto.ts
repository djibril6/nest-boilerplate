import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { TUser } from 'src/shared/types';

export class addUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username!: TUser['username'];

  @IsString()
  @IsNotEmpty()
  readonly password!: TUser['password'];

  @IsDate()
  @IsNotEmpty()
  readonly created?: Date;
}

export class UpdateUserDto extends PartialType(addUserDto) {}
