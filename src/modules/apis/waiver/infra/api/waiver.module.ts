import { Module } from '@nestjs/common';
import { WaiverClientController } from './waiver-client.controller';
import { WaiverBalanceController } from './waiver-balance.controller';
import { WaiverWithDrawalSolicitationController } from './waiver-withdrawal-solicitation.controller';

@Module({
  controllers: [
    WaiverClientController,
    WaiverBalanceController,
    WaiverWithDrawalSolicitationController,
  ],
})
export class WaiverModule {}
