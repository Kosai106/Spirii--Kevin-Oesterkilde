import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

export const transactions = {
  dto: {
    CreateTransactionDto,
    UpdateTransactionDto,
  },
  entities: {
    Transaction,
  },
};

export { Transaction, CreateTransactionDto, UpdateTransactionDto };
