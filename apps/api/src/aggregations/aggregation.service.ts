import { Injectable } from '@nestjs/common';

import { UserAggregationDto } from '@repo/api/aggregations/dto/user-aggregation.dto';
import { PayoutAggregationDto } from '@repo/api/aggregations/dto/payout-aggregation.dto';

import { TransactionsService } from '../transactions/transaction.service';

@Injectable()
export class AggregationsService {
  constructor(private readonly transactionsService: TransactionsService) {}

  getUserAggregation(userId: string) {
    const transactions = this.transactionsService.findByUserId(userId);

    const aggregation = {
      userId,
      balance: 0,
      earned: 0,
      spent: 0,
      payoutRequested: 0,
      paidOut: 0,
      lastUpdatedAt: new Date().toISOString(),
    };

    for (const transaction of transactions) {
      switch (transaction.type) {
        case 'earned': {
          aggregation.earned += transaction.amount;
          aggregation.balance += transaction.amount;
          break;
        }
        case 'spent': {
          aggregation.spent += transaction.amount;
          aggregation.balance -= transaction.amount;
          break;
        }
        case 'payout': {
          aggregation.payoutRequested += transaction.amount;
          aggregation.balance -= transaction.amount;
          break;
        }
      }
    }

    return aggregation;
  }
}
