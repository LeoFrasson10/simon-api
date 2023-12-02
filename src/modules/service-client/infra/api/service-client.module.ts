import { Module } from '@nestjs/common';
import { ServiceClientController } from './service-client.controller';

@Module({
  controllers: [ServiceClientController],
})
export class ServiceClientModule {}
