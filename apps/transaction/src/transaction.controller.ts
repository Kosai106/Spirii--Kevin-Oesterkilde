import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateTransactionDto } from '@repo/api/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@repo/api/transactions/dto/update-transaction.dto';

import { TransactionsService } from './transaction.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern({ cmd: 'get_transactions' })
  findAll(
    @Payload()
    data: {
      page?: string;
      limit?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ) {
    return this.transactionsService.findAll(
      data.page,
      data.limit,
      data.startDate,
      data.endDate,
    );
  }

  @MessagePattern({ cmd: 'get_transaction' })
  findOne(@Payload() data: { id: string }) {
    return this.transactionsService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'get_transactions_by_user' })
  findByUserId(@Payload() data: { userId: string }) {
    return this.transactionsService.findByUserId(data.userId);
  }

  @MessagePattern({ cmd: 'get_transactions_by_type' })
  findByType(@Payload() data: { type: 'payout' | 'spent' | 'earned' }) {
    return this.transactionsService.findByType(data.type);
  }

  @MessagePattern({ cmd: 'create_transaction' })
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
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
