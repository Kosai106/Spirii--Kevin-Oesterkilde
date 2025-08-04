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

import { AggregationsService } from './aggregation.service';
import { TransactionsService } from '../transactions/transaction.service';

describe('AggregationsService', () => {
  let service: AggregationsService;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2025-08-03T12:47:00.000Z') });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregationsService, TransactionsService],
    }).compile();

    service = module.get<AggregationsService>(AggregationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserAggregation', () => {
    it('should aggregate balance for user ID', () => {
      expect(service.getUserAggregation('074092')).toEqual({
        userId: '074092',
        balance: expect.any(Number),
        earned: expect.any(Number),
        spent: expect.any(Number),
        payoutRequested: expect.any(Number),
        paidOut: expect.any(Number),
        lastUpdatedAt: '2025-08-03T12:47:00.000Z',
      });
    });
  });

  it('should aggregate pending payouts by user ID', () => {
    expect(service.getPendingPayouts()).toEqual([
      {
        totalPayoutAmount: 879.1700000000001,
        transactionCount: 17,
        userId: '074092',
      },
    ]);
  });
});
