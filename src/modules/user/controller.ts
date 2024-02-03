// import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './service';
import { UpdateUserDto } from './dto';
import { TUser } from 'src/shared/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @Version('1')
  find(@Query() filter: Partial<TUser>) {
    console.log(filter);
    return this.userService.getMany(filter);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Body() body) {
    const { selectedFields } = body;
    return this.userService.findById(id, selectedFields);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
}
