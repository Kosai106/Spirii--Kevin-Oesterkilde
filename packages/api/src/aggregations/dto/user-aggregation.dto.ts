export class UserAggregationDto {
  userId: string;
  balance: number;
  earned: number;
  spent: number;
  payoutRequested: number;
  lastUpdatedAt: string; // Stringified date
}
