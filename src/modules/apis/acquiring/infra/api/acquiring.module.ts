import { Module } from '@nestjs/common';
import { AcquiringTransactionController } from './acquiring-transaction.controller';

@Module({
  controllers: [AcquiringTransactionController],
})
export class AcquiringModule {}
