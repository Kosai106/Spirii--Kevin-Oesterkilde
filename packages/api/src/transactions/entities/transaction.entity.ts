export class Transaction {
  id: string;
  userId: string;
  createdAt: string; // Stringified date
  type: 'payout' | 'spent' | 'earned';
  amount: number;
}
