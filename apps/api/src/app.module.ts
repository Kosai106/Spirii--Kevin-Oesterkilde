import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { AppController } from './app.controller';
import { TransactionController } from './transaction.controller';
import { AggregationController } from './aggregation.controller';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

const transactionMicroservice: ClientProviderOptions = {
  name: 'TRANSACTION_SERVICE',
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 3001, // Port of the Transactions microservice
  },
};

const aggregationMicroservice: ClientProviderOptions = {
  name: 'AGGREGATION_SERVICE',
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 3002, // Port of the Aggregations microservice
  },
};

@Module({
  imports: [
    ClientsModule.register([transactionMicroservice, aggregationMicroservice]),
  ],
  controllers: [AppController, TransactionController, AggregationController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes(TransactionController);
  }
}
