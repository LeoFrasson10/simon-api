import { Module } from '@nestjs/common';
import { ServiceClientController } from './service-integration.controller';

@Module({
  controllers: [ServiceClientController],
})
export class ServiceIntegrationModule {}
