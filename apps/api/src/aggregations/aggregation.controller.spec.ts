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
import { AggregationsController } from './aggregation.controller';
import { AggregationsService } from './aggregation.service';
import { TransactionsService } from '../transactions/transaction.service';

describe('AggregationController', () => {
  let aggregationsController: AggregationsController;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2025-08-03T12:47:00.000Z') });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AggregationsController],
      providers: [AggregationsService, TransactionsService],
    }).compile();

    aggregationsController = app.get<AggregationsController>(
      AggregationsController,
    );
  });

  describe('getUserAggregation', () => {
    it('should aggregate balance for user ID', () => {
      expect(aggregationsController.getUserAggregation('074092')).toEqual({
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

  describe('getPendingPayouts', () => {
    it('should aggregate pending payouts by user ID', () => {
      expect(aggregationsController.getPendingPayouts()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            totalPayoutAmount: expect.any(Number),
            transactionCount: expect.any(Number),
            userId: '074092',
          }),
        ]),
      );
    });
  });
});
