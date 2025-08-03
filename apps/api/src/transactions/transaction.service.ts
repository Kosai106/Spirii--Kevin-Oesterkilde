import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Transaction } from '@repo/api/transactions/entities/transaction.entity';

import { mockData } from './transactions.mock';

import { CreateTransactionDto } from '@repo/api/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@repo/api/transactions/dto/update-transaction.dto';

type RateLimiter = {
  canMakeRequest(): boolean;
  recordRequest(): void;
};

// TODO: A lot of these actions should be internally wrapped in try/catch blocks
//       I haven't done so here because we're not interfacing with an actual database

@Injectable()
export class TransactionsService implements RateLimiter {
  private readonly _transactions: Transaction[] = mockData;
  private readonly RATE_LIMIT = 5; // 5 requests per minute
  private readonly RATE_WINDOW = 60_000; // 1 minute in ms
  private readonly BATCH_SIZE = 1_000;
  private requestCount = 0;
  private requestWindowStart = Date.now();

  // TODO: The rate limiting should be handled through middleware, but I am not familiar
  //       enough wih Nestjs to have figured that out yet, nor do I have enough time
  canMakeRequest() {
    const now = Date.now();
    if (now - this.requestWindowStart > this.RATE_WINDOW) {
      this.requestCount = 0;
      this.requestWindowStart = now;
    }

    return this.requestCount < this.RATE_LIMIT;
  }

  recordRequest() {
    this.requestCount++;
  }

  create(createTransactionDto: CreateTransactionDto) {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

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
  findAll(page?: string, limit?: string, startDate?: string, endDate?: string) {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

    const itemsPerPage = parseInt(limit ?? String(this.BATCH_SIZE), 10);
    const currentPage = parseInt(page ?? '1', 10);
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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredTransactions.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      meta: {
        totalItems: filteredTransactions.length,
        itemCount: paginatedItems.length,
        itemsPerPage,
        totalPages: Math.ceil(filteredTransactions.length / itemsPerPage),
        currentPage: currentPage,
      },
    };
  }

  findOne(id: string) {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

    const found = this._transactions.find(({ id: _id }) => _id === id);

    if (!found) {
      throw new Error('No transaction found');
    }

    return found;
  }

  findByUserId(userId: string) {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

    return this._transactions.filter(
      ({ userId: _userId }) => _userId === userId,
    );
  }

  findByType(type: 'payout' | 'spent' | 'earned') {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

    return this._transactions.filter(({ type: _type }) => _type === type);
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

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
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    } else {
      this.recordRequest();
    }

    const index = this._transactions.findIndex(({ id: _id }) => _id === id);

    if (index === -1) {
      throw new Error('No transaction found');
    }

    this._transactions.splice(index, 1);

    return 'Successfully removed transaction';
  }
}
