import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsJWT } from 'class-validator';

export class addTokenDto {
  @IsJWT()
  @IsNotEmpty()
  readonly token: string | undefined;

  @IsString()
  @IsNotEmpty()
  readonly user: string | undefined;

  @IsString()
  @IsNotEmpty()
  readonly type: string | undefined;

  @IsString()
  @IsNotEmpty()
  readonly expires: string | undefined;
}

export class UpdateTokenDto extends PartialType(addTokenDto) {}
