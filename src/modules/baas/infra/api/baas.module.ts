import { Module } from '@nestjs/common';
import { BaaSController } from './baas.controller';

@Module({
  controllers: [BaaSController],
})
export class BaaSModule {}
