import { Module } from '@nestjs/common';

import { TransactionsModule } from './transactions/transaction.module';
import { AggregationsModule } from './aggregations/aggregation.module';

@Module({
  imports: [TransactionsModule, AggregationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
