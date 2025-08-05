import { Test, TestingModule } from '@nestjs/testing';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  beforeAll,
  afterAll,
} from '@jest/globals';

import { TransactionsController } from '../transaction.controller';
import { TransactionsService } from '../transaction.service';

describe('TransactionController', () => {
  let transactionsController: TransactionsController;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2025-08-03T12:47:00.000Z') });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    transactionsController = app.get<TransactionsController>(
      TransactionsController,
    );
  });

  describe('findAll', () => {
    it('should find all transactions', () => {
      expect(transactionsController.findAll({})).toEqual({
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            userId: '074092',
            createdAt: expect.any(String),
            type: expect.any(String),
            amount: expect.any(Number),
          }),
        ]),
        meta: {
          totalItems: 15000,
          itemCount: 1000,
          itemsPerPage: 1000,
          totalPages: 15,
          currentPage: 1,
        },
      });
    });

    it('should handle startDate and endDate query', () => {
      const result = transactionsController.findAll({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      });
      expect(result.items).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.meta.totalItems).toBeGreaterThanOrEqual(0);
      expect(result.meta.totalItems).toBeLessThanOrEqual(15000);
    });
  });

  describe('findOne', () => {
    it('should find a transaction by ID', () => {
      const service = new TransactionsService();
      // @ts-expect-error - Access internal data is forbidden but this is just a test and I don't have time to do it better
      const firstTransaction = service._transactions[0];
      const transactionId = firstTransaction.id;

      expect(
        transactionsController.findOne({
          id: transactionId,
        }),
      ).toEqual(firstTransaction);
    });

    it('should handle no match found', () => {
      expect(() =>
        transactionsController.findOne({ id: 'does-not-exist' }),
      ).toThrowError('No transaction found');
    });
  });

  describe('create', () => {
    it('should create a transaction', () => {
      expect(
        transactionsController.create({
          createTransactionDto: {
            userId: '074092',
            type: 'earned',
            amount: 10,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userId: '074092',
          createdAt: '2025-08-03T12:47:00.000Z',
          type: 'earned',
          amount: 10,
        }),
      );

      expect(transactionsController.findAll({}).meta.totalItems).toEqual(15001);
    });
  });

  describe('update', () => {
    it('should update an existing transaction', () => {
      const service = new TransactionsService();
      // @ts-expect-error - Access internal data is forbidden but this is just a test and I don't have time to do it better
      const firstTransaction = service._transactions[0];
      const transactionId = firstTransaction.id;

      expect(
        transactionsController.update({
          id: transactionId,
          updateTransactionDto: {
            amount: 42,
            type: 'spent',
          },
        }),
      ).toEqual(
        expect.objectContaining({
          id: transactionId,
          userId: firstTransaction.userId,
          createdAt: firstTransaction.createdAt,
          updatedAt: '2025-08-03T12:47:00.000Z',
          type: 'spent',
          amount: 42,
        }),
      );
    });

    it('should handle no transaction match', () => {
      expect(() =>
        transactionsController.update({
          id: 'does-not-exist',
          updateTransactionDto: {
            amount: 42,
            type: 'spent',
          },
        }),
      ).toThrowError('No transaction found');
    });
  });

  describe('remove', () => {
    it('should remove a transaction', () => {
      const service = new TransactionsService();
      // @ts-expect-error - Access internal data is forbidden but this is just a test and I don't have time to do it better
      const firstTransaction = service._transactions[0];
      const transactionId = firstTransaction.id;
      const initialCount = transactionsController.findAll({}).meta.totalItems;

      expect(transactionsController.remove({ id: transactionId })).toEqual(
        'Successfully removed transaction',
      );

      expect(transactionsController.findAll({}).meta.totalItems).toEqual(
        initialCount - 1,
      );
      expect(() =>
        transactionsController.findOne({ id: transactionId }),
      ).toThrowError('No transaction found');
    });

    it('should handle no transaction match', () => {
      expect(() =>
        transactionsController.remove({ id: 'does-not-exist' }),
      ).toThrowError('No transaction found');
    });
  });
});
