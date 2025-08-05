import { Injectable } from '@nestjs/common';

import {
  UserAggregationDto,
  PayoutAggregationDto,
} from '@repo/api/aggregations';
import type { Transaction } from '@repo/api/transactions';
import type { PaginatedResult } from '@repo/api/pagination';

@Injectable()
export class AggregationsService {
  private readonly apiGatewayUrl = 'http://localhost:3000';

  constructor() {}

  async getUserAggregation(userId: string): Promise<UserAggregationDto> {
    const allTransactions: Transaction[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const url = `${this.apiGatewayUrl}/transactions?page=${currentPage}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data: PaginatedResult<Transaction> = await response.json();

      console.log({ currentPage });

      const transactions = data.items ?? [];
      allTransactions.push(
        ...transactions.filter((transaction) => transaction.userId === userId),
      );

      if (data.meta && currentPage >= data.meta.totalPages) {
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
      const url = `${this.apiGatewayUrl}/transactions?page=${currentPage}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data: PaginatedResult<Transaction> = await response.json();

      const transactions = data.items || [];
      allTransactions.push(
        ...transactions.filter((transaction) => transaction.type === 'payout'),
      );

      if (data.meta && currentPage >= data.meta.totalPages) {
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
