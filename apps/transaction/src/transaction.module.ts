import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes(TransactionsController);
  }
}
