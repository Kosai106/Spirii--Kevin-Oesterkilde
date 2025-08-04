import { v4 as uuidv4 } from 'uuid';

import { Transaction } from '@repo/api/transactions';

const generateMockData = (
  numberOfTransactions: number,
  numberOfUsers: number,
) => {
  const users: string[] = Array.from({ length: numberOfUsers }, () =>
    Math.floor(100000 + Math.random() * 900000).toString(),
  );

  const transactionTypes: Transaction['type'][] = ['payout', 'spent', 'earned'];
  const mockData: Transaction[] = [];

  for (let i = 0; i < numberOfTransactions; i++) {
    const userId = users[Math.floor(Math.random() * users.length)];
    const type =
      transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

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
      type: type,
      amount: parseFloat((Math.random() * 99 + 1).toFixed(2)),
    };

    mockData.push(transaction);
  }

  return mockData;
};

export const mockData = generateMockData(5000, 5);
