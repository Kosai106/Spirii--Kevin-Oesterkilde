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

import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';

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
      expect(transactionsController.findAll()).toEqual({
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
          totalItems: 53,
          itemCount: 53,
          itemsPerPage: 1_000,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });

    it('should handle limit query', () => {
      expect(transactionsController.findAll(undefined, '10')).toEqual({
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
          totalItems: 53,
          itemCount: 10,
          itemsPerPage: 10,
          totalPages: 6,
          currentPage: 1,
        },
      });
    });

    it('should handle startDate and endDate query', () => {
      expect(
        transactionsController.findAll(
          undefined,
          undefined,
          '2023-01-01',
          '2023-02-31',
        ),
      ).toEqual({
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
          totalItems: 5,
          itemCount: 5,
          itemsPerPage: 1_000,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a transaction by ID', () => {
      expect(
        transactionsController.findOne('41bbdf81-735c-4aea-beb3-3e5fasfsdfef'),
      ).toEqual({
        id: '41bbdf81-735c-4aea-beb3-3e5fasfsdfef',
        userId: '074092',
        createdAt: '2023-03-12T12:33:11.000Z',
        type: 'spent',
        amount: 12,
      });
    });

    it('should handle no match found', () => {
      expect(() =>
        transactionsController.findOne('does-not-exist'),
      ).toThrowError('No transaction found');
    });
  });

  describe('findByUserId', () => {
    it('should find by user ID', () => {
      expect(transactionsController.findByUserId('074092')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            userId: '074092',
            createdAt: expect.any(String),
            type: expect.any(String),
            amount: expect.any(Number),
          }),
        ]),
      );
    });

    it('should handle no match', () => {
      expect(transactionsController.findByUserId('does-not-exist')).toEqual([]);
    });
  });

  describe('findByType', () => {
    it('should find by user ID', () => {
      expect(transactionsController.findByType('earned')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            userId: '074092',
            createdAt: expect.any(String),
            type: expect.any(String),
            amount: expect.any(Number),
          }),
        ]),
      );
    });

    it('should handle no match', () => {
      expect(transactionsController.findByUserId('does-not-exist')).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a transaction', () => {
      expect(
        transactionsController.create({
          userId: '074092',
          type: 'earned',
          amount: 10,
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

      expect(transactionsController.findAll().meta.totalItems).toEqual(54);
    });
  });

  describe('update', () => {
    it('should update an existing transaction', () => {
      expect(
        transactionsController.update('41bbdf81-735c-4aea-beb3-3e5fasfsdfef', {
          amount: 42,
          type: 'spent',
        }),
      ).toEqual(
        expect.objectContaining({
          id: '41bbdf81-735c-4aea-beb3-3e5fasfsdfef',
          userId: '074092',
          createdAt: '2023-03-12T12:33:11.000Z',
          updatedAt: '2025-08-03T12:47:00.000Z',
          type: 'spent',
          amount: 42,
        }),
      );
    });

    it('should handle no transaction match', () => {
      expect(() =>
        transactionsController.update('does-not-exist', {
          amount: 42,
          type: 'spent',
        }),
      ).toThrowError('No transaction found');
    });
  });

  describe('remove', () => {
    it('should remove a transaction', () => {
      const transactionId = '41bbdf81-735c-4aea-beb3-3e5fasfsdfef';
      expect(transactionsController.findAll().meta.totalItems).toEqual(54);

      expect(transactionsController.remove(transactionId)).toEqual(
        'Successfully removed transaction',
      );

      expect(transactionsController.findAll().meta.totalItems).toEqual(53);
      expect(() => transactionsController.findOne(transactionId)).toThrowError(
        'No transaction found',
      );
    });

    it('should handle no transaction match', () => {
      expect(() =>
        transactionsController.remove('does-not-exist'),
      ).toThrowError('No transaction found');
    });
  });
});
