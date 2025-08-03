import { Injectable } from '@nestjs/common';

import { UserAggregationDto } from '@repo/api/aggregations/dto/user-aggregation.dto';
import { PayoutAggregationDto } from '@repo/api/aggregations/dto/payout-aggregation.dto';

import { TransactionsService } from '../transactions/transaction.service';

@Injectable()
export class AggregationsService {
  constructor(private readonly transactionsService: TransactionsService) {}

  getUserAggregation(userId: string): UserAggregationDto {
    const transactions = this.transactionsService.findByUserId(userId);

    const aggregation: UserAggregationDto = {
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

  getPendingPayouts(): PayoutAggregationDto[] {
    const transactions = this.transactionsService.findByType('payout');

    const payoutMap: Record<string, { amount: number; count: number }> = {};

    for (const transaction of transactions) {
      if (!payoutMap[transaction.userId]) {
        payoutMap[transaction.userId] = { amount: 0, count: 0 };
      }
      payoutMap[transaction.userId].amount += transaction.amount;
      payoutMap[transaction.userId].count += 1;
    }

    return Object.entries(payoutMap).map(([userId, data]) => ({
      userId,
      totalPayoutAmount: data.amount,
      transactionCount: data.count,
    }));
  }
}
