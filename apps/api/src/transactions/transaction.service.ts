import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Transaction } from '@repo/api/transactions/entities/transaction.entity';

import { mockData } from './transactions.mock';

import { CreateTransactionDto } from '@repo/api/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@repo/api/transactions/dto/update-transaction.dto';

// TODO: A lot of these actions should be internally wrapped in try/catch blocks
//       I haven't done so here because we're not interfacing with an actual database
@Injectable()
export class TransactionsService {
  private readonly _transactions: Transaction[] = mockData;

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction = {
      ...createTransactionDto,
      createdAt: new Date().toISOString(),
      id: uuidv4(),
    };

    this._transactions.push(newTransaction);

    return newTransaction;
  }

  findAll() {
    return this._transactions;
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

    console.log(id, index);
    if (index === -1) {
      throw new Error('No transaction found');
    }

    this._transactions.splice(index, 1);

    return 'Successfully removed transaction';
  }
}
