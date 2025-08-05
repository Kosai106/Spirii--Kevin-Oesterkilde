import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AggregationController {
  constructor(
    @Inject('AGGREGATION_SERVICE')
    private readonly aggregationsClient: ClientProxy,
  ) {}

  @Get('/aggregations/user/:userId')
  getUserAggregation(@Param('userId') userId: string) {
    return this.aggregationsClient.send(
      { cmd: 'get_user_aggregation' },
      { userId },
    );
  }

  @Get('/aggregations/payouts/pending')
  getPendingPayouts() {
    return this.aggregationsClient.send({ cmd: 'get_pending_payouts' }, {});
  }
}
