// import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './service';
import { addUserDto } from '../user/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // @Version('1')
  login(@Body() data: { username: string; password: string }) {
    return this.authService.login(data);
  }

  @Post('signin')
  signIn(@Body() data: Omit<addUserDto, 'created'>) {
    return this.authService.signIn(data);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken);
  }
}
