import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  getHealthCheck() {
    return 'ok';
  }
}
