import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AggregationsService } from './aggregation.service';
import { AggregationsController } from './aggregation.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AggregationsController],
  providers: [AggregationsService],
  exports: [AggregationsService],
})
export class AggregationsModule {}
