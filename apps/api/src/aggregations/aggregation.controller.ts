import { Controller, Get, Param } from '@nestjs/common';
import { AggregationsService } from './aggregation.service';

@Controller('aggregations')
export class AggregationsController {
  constructor(private readonly aggregationsService: AggregationsService) {}

  @Get('user/:userId')
  getUserAggregation(@Param('userId') userId: string) {
    return this.aggregationsService.getUserAggregation(userId);
  }

  @Get('payouts/pending')
  getPendingPayouts() {
    return this.aggregationsService.getPendingPayouts();
  }
}
