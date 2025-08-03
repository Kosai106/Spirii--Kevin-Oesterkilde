import { CreateTransactionDto } from 'transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from 'transactions/dto/update-transaction.dto';

import { Transaction } from 'transactions/entities/transaction.entity';

import { UserAggregationDto } from 'aggregations/dto/user-aggregation.dto';
import { PayoutAggregationDto } from 'aggregations/dto/payout-aggregation.dto';

export const transactions = {
  dto: {
    CreateTransactionDto,
    UpdateTransactionDto,
  },
  entities: {
    Transaction,
  },
};

export const aggregations = {
  dto: {
    UserAggregationDto,
    PayoutAggregationDto,
  },
  entities: {},
};
