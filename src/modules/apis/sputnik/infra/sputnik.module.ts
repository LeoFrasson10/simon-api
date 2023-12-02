import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SputnikClientController } from './sputnik-client.controller';
import { SputnikRuleController } from './sputnik-rule.controller';
import { SputnikUserController } from './sputnik-user.controller';
import { SputnikPartnerController } from './sputnik-partner.controller';
import { SputnikSupplierController } from './sputnik-supplier.controller';
import { SputnikOperationController } from './sputnik-operation-supplier.controller';
import { SputnikMiddleware } from './sputnik.middleware';
import { SputnikOperationPortalController } from './sputnik-operation-portal.controller';

@Module({
  controllers: [
    SputnikClientController,
    SputnikRuleController,
    SputnikUserController,
    SputnikPartnerController,
    SputnikSupplierController,
    SputnikOperationController,
    SputnikOperationPortalController,
  ],
})
export class SputnikModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SputnikMiddleware).forRoutes('/sputnik/operation/supplier');
  }
}
