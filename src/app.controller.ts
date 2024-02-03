import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // Check the availability of the api
  @Get('health')
  checkHealth(): string {
    return 'I am alive';
  }
}
