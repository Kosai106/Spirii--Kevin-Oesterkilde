import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@repo/api/transactions';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientProxy,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsClient.send(
      { cmd: 'get_transactions' },
      { page, startDate, endDate },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsClient.send({ cmd: 'get_transaction' }, { id });
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsClient.send(
      { cmd: 'create_transaction' },
      { createTransactionDto },
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsClient.send(
      { cmd: 'update_transaction' },
      { id, updateTransactionDto },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsClient.send({ cmd: 'remove_transaction' }, { id });
  }
}
