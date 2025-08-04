import { PayoutAggregationDto } from './dto/payout-aggregation.dto';
import { UserAggregationDto } from './dto/user-aggregation.dto';

export const aggregations = {
  dto: {
    UserAggregationDto,
    PayoutAggregationDto,
  },
  entities: {},
};

export { UserAggregationDto, PayoutAggregationDto };
