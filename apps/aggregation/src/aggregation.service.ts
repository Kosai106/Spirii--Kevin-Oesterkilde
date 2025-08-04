import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { UserAggregationDto } from '@repo/api/aggregations/dto/user-aggregation.dto';
import { PayoutAggregationDto } from '@repo/api/aggregations/dto/payout-aggregation.dto';

@Injectable()
export class AggregationsService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientProxy,
  ) {}

  async getUserAggregation(userId: string): Promise<UserAggregationDto> {
    const pattern = { cmd: 'get_transactions_by_user' };
    const payload = {
      userId,
    };

    const transactions = await firstValueFrom(
      this.transactionsClient.send(pattern, payload),
    );

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

  async getPendingPayouts(): Promise<PayoutAggregationDto[]> {
    const pattern = { cmd: 'get_transactions_by_type' };
    const payload = {
      type: 'payout',
    };

    const transactions = await firstValueFrom(
      this.transactionsClient.send(pattern, payload),
    );

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
