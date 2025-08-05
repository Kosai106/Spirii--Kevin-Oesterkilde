import { Module } from '@nestjs/common';

import { AggregationsService } from './aggregation.service';
import { AggregationsController } from './aggregation.controller';

@Module({
  controllers: [AggregationsController],
  providers: [AggregationsService],
  exports: [AggregationsService],
})
export class AggregationsModule {}
