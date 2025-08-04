import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { TransactionController } from './transaction.controller';
import { AggregationController } from './aggregation.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE', // An injection token
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001, // Port of the Transactions microservice
        },
      },
      {
        name: 'AGGREGATION_SERVICE', // An injection token
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3002, // Port of the Aggregations microservice
        },
      },
    ]),
  ],
  controllers: [AppController, TransactionController, AggregationController],
  providers: [],
})
export class AppModule {}
