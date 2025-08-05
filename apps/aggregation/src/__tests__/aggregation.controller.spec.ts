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

import { AggregationsController } from '../aggregation.controller';
import { AggregationsService } from '../aggregation.service';

describe('AggregationController', () => {
  let aggregationsController: AggregationsController;
  let aggregationsService: AggregationsService;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2025-08-03T12:47:00.000Z') });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const mockTransactionsClient = {
      send: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AggregationsController],
      providers: [
        AggregationsService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: mockTransactionsClient,
        },
      ],
    }).compile();

    aggregationsController = app.get<AggregationsController>(
      AggregationsController,
    );
    aggregationsService = app.get<AggregationsService>(AggregationsService);
  });

  describe('getUserAggregation', () => {
    it('should aggregate balance for user ID', async () => {
      const mockAggregation = {
        userId: '074092',
        balance: 50,
        earned: 100,
        spent: 30,
        payoutRequested: 20,
        paidOut: 0,
        lastUpdatedAt: '2025-08-03T12:47:00.000Z',
      };

      jest
        .spyOn(aggregationsService, 'getUserAggregation')
        .mockResolvedValue(mockAggregation);

      const result = await aggregationsController.getUserAggregation({
        userId: '074092',
      });

      expect(result).toEqual({
        userId: '074092',
        balance: 50,
        earned: 100,
        spent: 30,
        payoutRequested: 20,
        paidOut: 0,
        lastUpdatedAt: '2025-08-03T12:47:00.000Z',
      });
    });
  });

  describe('getPendingPayouts', () => {
    it('should aggregate pending payouts by user ID', async () => {
      const mockPayouts = [
        {
          totalPayoutAmount: 879.17,
          transactionCount: 17,
          userId: '074092',
        },
      ];

      jest
        .spyOn(aggregationsService, 'getPendingPayouts')
        .mockResolvedValue(mockPayouts);

      const result = await aggregationsController.getPendingPayouts();

      expect(result).toEqual([
        {
          totalPayoutAmount: 879.17,
          transactionCount: 17,
          userId: '074092',
        },
      ]);
    });
  });
});
