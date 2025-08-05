import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@repo/api/transactions';

import { TransactionsService } from './transaction.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern({ cmd: 'get_transactions' })
  findAll(
    @Payload()
    data: {
      page?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ) {
    return this.transactionsService.findAll(
      data.page,
      data.startDate,
      data.endDate,
    );
  }

  @MessagePattern({ cmd: 'get_transaction' })
  findOne(@Payload() data: { id: string }) {
    return this.transactionsService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create_transaction' })
  create(@Payload() data: { createTransactionDto: CreateTransactionDto }) {
    return this.transactionsService.create(data.createTransactionDto);
  }

  @MessagePattern({ cmd: 'update_transaction' })
  update(
    @Payload() data: { id: string; updateTransactionDto: UpdateTransactionDto },
  ) {
    return this.transactionsService.update(data.id, data.updateTransactionDto);
  }

  @MessagePattern({ cmd: 'remove_transaction' })
  remove(@Payload() data: { id: string }) {
    return this.transactionsService.remove(data.id);
  }
}
