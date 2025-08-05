import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AggregationsService } from './aggregation.service';

@Controller()
export class AggregationsController {
  constructor(private readonly aggregationsService: AggregationsService) {}

  @MessagePattern({ cmd: 'get_user_aggregation' })
  async getUserAggregation(@Payload() data: { userId: string }) {
    return this.aggregationsService.getUserAggregation(data.userId);
  }

  @MessagePattern({ cmd: 'get_pending_payouts' })
  async getPendingPayouts() {
    return this.aggregationsService.getPendingPayouts();
  }
}
