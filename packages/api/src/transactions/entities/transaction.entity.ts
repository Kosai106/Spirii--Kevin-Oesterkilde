export class Transaction {
  id: string;
  userId: string;
  createdAt: string; // Stringified date
  updatedAt?: string; // Stringified date
  type: 'payout' | 'spent' | 'earned';
  amount: number;
}
