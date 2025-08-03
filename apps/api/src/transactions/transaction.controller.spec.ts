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
  let transactionController: TransactionsController;

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

    transactionController = app.get<TransactionsController>(
      TransactionsController,
    );
  });

  describe('findAll', () => {
    it('should find all transactions', () => {
      expect(transactionController.findAll()).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(String),
            userId: '074092',
            createdAt: '2023-03-16T12:33:11.000Z',
            type: 'payout',
            amount: 30,
          },
          {
            id: expect.any(String),
            userId: '074092',
            createdAt: '2023-03-12T12:33:11.000Z',
            type: 'spent',
            amount: 12,
          },
          {
            id: expect.any(String),
            userId: '074092',
            createdAt: '2023-03-15T12:33:11.000Z',
            type: 'earned',
            amount: 1.2,
          },
        ]),
      );
    });
  });

  describe('findOne', () => {
    it('should find a transaction by ID', () => {
      expect(
        transactionController.findOne('41bbdf81-735c-4aea-beb3-3e5fasfsdfef'),
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
        transactionController.findOne('does-not-exist'),
      ).toThrowError('No transaction found');
    });
  });

  describe('create', () => {
    it('should create a transaction', () => {
      expect(
        transactionController.create({
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

      expect(transactionController.findAll()).toHaveLength(54);
    });
  });

  describe('update', () => {
    it('should update an existing transaction', () => {
      expect(
        transactionController.update('41bbdf81-735c-4aea-beb3-3e5fasfsdfef', {
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
        transactionController.update('does-not-exist', {
          amount: 42,
          type: 'spent',
        }),
      ).toThrowError('No transaction found');
    });
  });

  describe('remove', () => {
    it('should remove a transaction', () => {
      const transactionId = '41bbdf81-735c-4aea-beb3-3e5fasfsdfef';
      expect(transactionController.findAll()).toHaveLength(54);

      expect(transactionController.remove(transactionId)).toEqual(
        'Successfully removed transaction',
      );

      expect(transactionController.findAll()).toHaveLength(53);
      expect(() => transactionController.findOne(transactionId)).toThrowError(
        'No transaction found',
      );
    });

    it('should handle no transaction match', () => {
      expect(() => transactionController.remove('does-not-exist')).toThrowError(
        'No transaction found',
      );
    });
  });
});
