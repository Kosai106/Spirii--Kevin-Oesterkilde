import { Module } from '@nestjs/common';

import { TransactionsModule } from './transactions/transaction.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
