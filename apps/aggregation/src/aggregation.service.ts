import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  UserAggregationDto,
  PayoutAggregationDto,
} from '@repo/api/aggregations';
import type { Transaction } from '@repo/api/transactions';
import type { PaginatedResult } from '@repo/api/pagination';

@Injectable()
export class AggregationsService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientProxy,
  ) {}

  async getUserAggregation(userId: string): Promise<UserAggregationDto> {
    const allTransactions: Transaction[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const pattern = { cmd: 'get_transactions' };
      const payload = {
        page: String(currentPage),
      };

      const response: PaginatedResult<Transaction> = await firstValueFrom(
        this.transactionsClient.send(pattern, payload),
      );

      const transactions = response.items ?? [];
      allTransactions.push(
        ...transactions.filter((transaction) => transaction.userId === userId),
      );

      if (response.meta && currentPage >= response.meta.totalPages) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }

    const aggregation: UserAggregationDto = {
      userId,
      balance: 0,
      earned: 0,
      spent: 0,
      payoutRequested: 0,
      lastUpdatedAt: new Date().toISOString(),
    };

    for (const transaction of allTransactions) {
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
    const allTransactions = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const pattern = { cmd: 'get_transactions' };
      const payload = {
        page: String(currentPage),
      };

      const response: PaginatedResult<Transaction> = await firstValueFrom(
        this.transactionsClient.send(pattern, payload),
      );

      const transactions = response.items || [];
      allTransactions.push(
        ...transactions.filter((transaction) => transaction.type === 'payout'),
      );

      if (response.meta && currentPage >= response.meta.totalPages) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }

    const payoutMap: Record<string, { amount: number; count: number }> = {};

    for (const transaction of allTransactions) {
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
