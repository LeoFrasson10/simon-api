import { Module } from '@nestjs/common';
import { EconomicGroupController } from './economic-group.controller';

@Module({
  controllers: [EconomicGroupController],
})
export class EconomicGroupModule {}
