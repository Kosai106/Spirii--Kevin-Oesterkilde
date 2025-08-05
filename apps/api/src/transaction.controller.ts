import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsClient.send(
      { cmd: 'get_transactions' },
      { page, startDate, endDate },
    );
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
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
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsClient.send(
      { cmd: 'update_transaction' },
      { id, updateTransactionDto },
    );
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.transactionsClient.send({ cmd: 'remove_transaction' }, { id });
  }
}
