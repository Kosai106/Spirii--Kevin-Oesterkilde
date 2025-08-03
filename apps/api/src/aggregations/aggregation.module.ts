import { Module } from '@nestjs/common';

import { AggregationsService } from './aggregation.service';
import { AggregationsController } from './aggregation.controller';

import { TransactionsModule } from '../transactions/transaction.module';

@Module({
  imports: [TransactionsModule],
  controllers: [AggregationsController],
  providers: [AggregationsService],
})
export class AggregationsModule {}
