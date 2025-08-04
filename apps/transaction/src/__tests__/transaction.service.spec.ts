import { Test, TestingModule } from '@nestjs/testing';
import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';

import { TransactionsService } from '../transaction.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2025-08-03T12:47:00.000Z') });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all transactions', () => {
      expect(service.findAll()).toEqual({
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
      const result = service.findAll(undefined, '2025-01-01', '2025-12-31');
      expect(result.items).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.meta.totalItems).toBeGreaterThanOrEqual(0);
      expect(result.meta.totalItems).toBeLessThanOrEqual(15000);
    });
  });

  describe('findOne', () => {
    it('should find a transaction by ID', () => {
      // @ts-expect-error - Access internal data is forbidden but this is just a test and I don't have time to do it better
      const firstTransaction = service._transactions[0];
      const transactionId = firstTransaction.id;

      expect(service.findOne(transactionId)).toEqual(firstTransaction);
    });

    it('should handle no match found', () => {
      expect(() => service.findOne('does-not-exist')).toThrowError(
        'No transaction found',
      );
    });
  });

  describe('create', () => {
    it('should create a transaction', () => {
      expect(
        service.create({
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

      expect(service.findAll().meta.totalItems).toEqual(15001);
    });
  });

  describe('update', () => {
    it('should update an existing transaction', () => {
      // @ts-expect-error - Access internal data is forbidden but this is just a test and I don't have time to do it better
      const firstTransaction = service._transactions[0];
      const transactionId = firstTransaction.id;

      expect(
        service.update(transactionId, {
          amount: 42,
          type: 'spent',
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
        service.update('does-not-exist', {
          amount: 42,
          type: 'spent',
        }),
      ).toThrowError('No transaction found');
    });
  });

  describe('remove', () => {
    it('should remove a transaction', () => {
      // @ts-expect-error - Access internal data is forbidden but this is just a test and I don't have time to do it better
      const firstTransaction = service._transactions[0];
      const transactionId = firstTransaction.id;
      const initialCount = service.findAll().meta.totalItems;

      expect(service.remove(transactionId)).toEqual(
        'Successfully removed transaction',
      );

      expect(service.findAll().meta.totalItems).toEqual(initialCount - 1);
      expect(() => service.findOne(transactionId)).toThrowError(
        'No transaction found',
      );
    });

    it('should handle no transaction match', () => {
      expect(() => service.remove('does-not-exist')).toThrowError(
        'No transaction found',
      );
    });
  });
});
