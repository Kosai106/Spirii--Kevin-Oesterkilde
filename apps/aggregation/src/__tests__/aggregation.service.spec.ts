import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import { of } from 'rxjs';

import { AggregationsService } from '../aggregation.service';

describe('AggregationsService', () => {
  let service: AggregationsService;
  let transactionsClient: ClientProxy;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AggregationsService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: mockTransactionsClient,
        },
      ],
    }).compile();

    service = module.get<AggregationsService>(AggregationsService);
    transactionsClient = module.get<ClientProxy>('TRANSACTION_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserAggregation', () => {
    it('should aggregate balance for user ID', async () => {
      const mockTransactions = [
        {
          id: '1',
          userId: '074092',
          type: 'earned',
          amount: 100,
          createdAt: '2023-01-01',
        },
        {
          id: '2',
          userId: '074092',
          type: 'spent',
          amount: 30,
          createdAt: '2023-01-02',
        },
        {
          id: '3',
          userId: '074092',
          type: 'payout',
          amount: 20,
          createdAt: '2023-01-03',
        },
      ];

      jest.spyOn(transactionsClient, 'send').mockReturnValue(
        of({
          items: mockTransactions,
          meta: {
            currentPage: 1,
            itemsPerPage: 1000,
            itemCount: mockTransactions.length,
            totalItems: mockTransactions.length,
            totalPages: 1,
          },
        }),
      );

      const result = await service.getUserAggregation('074092');

      expect(result).toEqual({
        userId: '074092',
        balance: 50, // 100 earned - 30 spent - 20 payout
        earned: 100,
        spent: 30,
        payoutRequested: 20,
        lastUpdatedAt: '2025-08-03T12:47:00.000Z',
      });
    });
  });

  it('should aggregate pending payouts by user ID', async () => {
    const mockPayoutTransactions = [
      {
        id: '1',
        userId: '074092',
        type: 'payout',
        amount: 100.5,
        createdAt: '2023-01-01',
      },
      {
        id: '2',
        userId: '074092',
        type: 'payout',
        amount: 200.3,
        createdAt: '2023-01-02',
      },
      {
        id: '3',
        userId: '074092',
        type: 'payout',
        amount: 578.37,
        createdAt: '2023-01-03',
      },
    ];

    jest.spyOn(transactionsClient, 'send').mockReturnValue(
      of({
        items: mockPayoutTransactions,
        meta: {
          currentPage: 1,
          itemsPerPage: 1000,
          itemCount: mockPayoutTransactions.length,
          totalItems: mockPayoutTransactions.length,
          totalPages: 1,
        },
      }),
    );

    const result = await service.getPendingPayouts();

    expect(result).toEqual([
      {
        totalPayoutAmount: 879.1700000000001,
        transactionCount: 3,
        userId: '074092',
      },
    ]);
  });
});
