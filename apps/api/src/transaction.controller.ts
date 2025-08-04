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

import { CreateTransactionDto } from '@repo/api/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@repo/api/transactions/dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientProxy,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsClient.send(
      { cmd: 'get_transactions' },
      { page, limit, startDate, endDate },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsClient.send({ cmd: 'get_transaction' }, { id });
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.transactionsClient.send(
      { cmd: 'get_transactions_by_user' },
      { userId },
    );
  }

  @Get('type/:type')
  findByType(@Param('type') type: 'payout' | 'spent' | 'earned') {
    return this.transactionsClient.send(
      { cmd: 'get_transactions_by_type' },
      { type },
    );
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
