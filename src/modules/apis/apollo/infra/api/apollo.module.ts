import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApolloAssignorController } from './apollo-assignor.controller';
import { ApolloOperationController } from './apollo-operation.controller';
import { ApolloClientController } from './apollo-client.controller';
import { ApolloRatingRuleController } from './apollo-rating-rule.controller';
import { ApolloPartnerController } from './apollo-partner.controller';
import { ApolloUserController } from './apollo-user.controller';
import { ApolloMiddleware, ApolloPayerMiddleware } from './apollo.middleware';
import { ApolloOperationPayerController } from './apollo-operation-payer.controller';
import { ApolloOperationSupplierController } from './apollo-operation-supplier.controller';
import { ApolloSupplierController } from './apollo-supplier.controller';
import { ApolloFinancialEntityController } from './apollo-financial-entity.controller';

@Module({
  controllers: [
    ApolloAssignorController,
    ApolloOperationController,
    ApolloClientController,
    ApolloRatingRuleController,
    ApolloPartnerController,
    ApolloUserController,
    ApolloOperationPayerController,
    ApolloOperationSupplierController,
    ApolloSupplierController,
    ApolloFinancialEntityController,
  ],
})
export class ApolloModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApolloMiddleware)
      .exclude(
        {
          path: '/apollo/operation/payer/upload-invoices',
          method: RequestMethod.POST,
        },
        {
          path: '/apollo/operation/payer/list-invoices',
          method: RequestMethod.GET,
        },
        {
          path: '/apollo/operation/payer/delete-invoice/:invoiceId',
          method: RequestMethod.DELETE,
        },
      )
      .forRoutes(
        '/apollo/operation-assignor',
        '/apollo/operation-supplier/assignor',
      );

    consumer.apply(ApolloPayerMiddleware).forRoutes('/apollo/operation/payer');
  }
}
