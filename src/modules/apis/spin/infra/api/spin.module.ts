import { Module } from '@nestjs/common';
import { BorrowerController } from './spin-borrower.controller';
import { SpinClientController } from './spin-client.controller';
import { OperationController } from './spin-operation.controller';
import { SpinTermController } from './spin-term.controller';
import { SpinRatingRuleController } from './spin-rating-rules.controller';

@Module({
  controllers: [
    BorrowerController,
    OperationController,
    SpinClientController,
    SpinTermController,
    SpinRatingRuleController,
  ],
})
export class SpinModule {}
