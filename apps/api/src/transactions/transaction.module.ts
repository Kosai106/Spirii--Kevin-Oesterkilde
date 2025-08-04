import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';

import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { RateLimitMiddleware } from './rate-limit.middleware';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes(TransactionsController);
  }
}
