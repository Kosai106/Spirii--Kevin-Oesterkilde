import { CreateTransactionDto } from 'transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from 'transactions/dto/update-transaction.dto';

import { Transaction } from 'transactions/entities/transaction.entity';

export const transactions = {
  dto: {
    CreateTransactionDto,
    UpdateTransactionDto,
  },
  entities: {
    Transaction,
  },
};
