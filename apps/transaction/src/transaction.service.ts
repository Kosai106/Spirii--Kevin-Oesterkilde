import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@repo/api/transactions';
import { paginate } from '@repo/api/pagination';

import { mockData } from './transactions.mock';

// TODO: A lot of these actions should be internally wrapped in try/catch blocks
//       I haven't done so here because we're not interfacing with an actual database

@Injectable()
export class TransactionsService {
  private readonly _transactions: Transaction[] = mockData;
  private readonly BATCH_SIZE = process.env.BATCH_SIZE ?? 1_000;

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction = {
      ...createTransactionDto,
      createdAt: new Date().toISOString(),
      id: uuidv4(),
    };

    this._transactions.push(newTransaction);

    return newTransaction;
  }

  // Everything is typed as strings here because of how query params work
  // They could technically also be arrays but let's not worry about that now
  findAll(page?: string, startDate?: string, endDate?: string) {
    let filteredTransactions = this._transactions;

    if (startDate || endDate) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return transactionDate >= start && transactionDate <= end;
        } else if (startDate) {
          const start = new Date(startDate);
          return transactionDate >= start;
        } else if (endDate) {
          const end = new Date(endDate);
          return transactionDate <= end;
        }

        return true;
      });
    }

    return paginate(filteredTransactions, {
      page,
      limit: this.BATCH_SIZE,
    });
  }

  findOne(id: string) {
    const found = this._transactions.find(({ id: _id }) => _id === id);

    if (!found) {
      throw new Error('No transaction found');
    }

    return found;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const index = this._transactions.findIndex(({ id: _id }) => _id === id);

    if (index === -1) {
      throw new Error('No transaction found');
    }

    const update = {
      ...this._transactions[index],
      ...updateTransactionDto,
      updatedAt: new Date().toISOString(),
    };

    this._transactions[index] = update;

    return update;
  }

  remove(id: string) {
    const index = this._transactions.findIndex(({ id: _id }) => _id === id);

    if (index === -1) {
      throw new Error('No transaction found');
    }

    this._transactions.splice(index, 1);

    return 'Successfully removed transaction';
  }
}
