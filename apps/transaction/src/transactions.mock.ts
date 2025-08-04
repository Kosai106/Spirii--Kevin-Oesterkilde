import { v4 as uuidv4 } from 'uuid';

import { Transaction } from '@repo/api/transactions';

const USER_IDS = ['074092', '235335', '471315', '373448'];

const generateMockData = (numberOfTransactions: number, userIds: string[]) => {
  const transactionTypes = ['payout', 'spent', 'earned'] as const;
  const mockData: Transaction[] = [];

  for (let i = 0; i < numberOfTransactions; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    // Weighted type selection: 50% earned, 25% payout, 25% spent
    const random = Math.random();
    let type: (typeof transactionTypes)[number];
    if (random < 0.9) {
      type = 'earned';
    } else if (random < 0.95) {
      type = 'payout';
    } else {
      type = 'spent';
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );

    const transaction: Transaction = {
      id: uuidv4(),
      userId: userId,
      createdAt: randomDate.toISOString(),
      type,
      amount: parseFloat((Math.random() * 99 + 1).toFixed(2)),
    };

    mockData.push(transaction);
  }

  return mockData;
};

export const mockData = generateMockData(15_000, USER_IDS);
