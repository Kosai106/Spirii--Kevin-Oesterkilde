import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class TransactionController {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientProxy,
  ) {}

  @Get('/transactions')
  findAll() {
    return this.transactionsClient.send(
      { cmd: 'get_transactions' },
      {
        page: '1',
        limit: '10',
      },
    );
  }
}
