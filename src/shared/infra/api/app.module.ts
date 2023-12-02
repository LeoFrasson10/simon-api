import {
  UserModule,
  IntegrationModule,
  SpinModule,
  EconomicGroupModule,
  ServiceModule,
  ServiceClientModule,
  WaiverModule,
  AcquiringModule,
  ApolloModule,
  NotificationModule,
  BaaSModule,
  ContractModule,
} from '@modules/index';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  AuthorizationAdminMiddleware,
  AuthorizationIntegrationMiddleware,
  AuthorizationMiddleware,
  AuthorizationUserClientApolloMiddleware,
  AuthorizationUserPayerApolloMiddleware,
  JwtMiddleware,
} from './middlewares';
import { AuthorizationModule } from '@modules/authorization';
import { ClientModule } from '@modules/client';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PermissionGuardModule } from './guard';
import { SharedModule, SputnikModule } from '@modules/apis';

import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsModule } from './crons/cron.module';
import { APIDocumentations } from '@shared/config';
import { ServiceIntegrationModule } from '@modules/service-integration';
import { ThemeModule } from './theme.module';
import { StatusModule } from './status.module';

const nestModules = [
  ScheduleModule.forRoot(),
  EventEmitterModule.forRoot({
    delimiter: '.',
  }),
  // NestCron.forRoot()
];

const appModules = [
  ServiceIntegrationModule,
  StatusModule,
  ThemeModule,
  NotificationModule,
  UserModule,
  IntegrationModule,
  ClientModule,
  EconomicGroupModule,
  ServiceModule,
  ServiceClientModule,
  AuthorizationModule,
  PermissionGuardModule,
  BaaSModule,
  CronJobsModule,
  ContractModule,
];

const servicesModules = [
  SpinModule,
  WaiverModule,
  AcquiringModule,
  ApolloModule,
  SharedModule,
  SputnikModule,
];

@Module({
  imports: [...nestModules, ...appModules, ...servicesModules],
})
export class AppModule implements NestModule {
  static swaggerModules: Array<{
    name: string;
    title?: string;
    description?: string;
    version?: string;
    path: string;
    modules: any[];
    hasBearerAuth: boolean;
  }> = [
    {
      name: APIDocumentations.ApolloSupplier,
      title: 'API Antecipação de duplicatas by Fornecedor',
      path: 'api/supplier',
      modules: [ApolloModule],
      hasBearerAuth: true,
    },
    {
      name: APIDocumentations.Portal,
      title: 'API Painel Administrativo',
      path: 'api/portal',
      modules: [ApolloModule],
      hasBearerAuth: true,
    },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/authorization/session', method: RequestMethod.POST },
        { path: '/authorization/app', method: RequestMethod.POST },
        { path: '/authorization/ib', method: RequestMethod.POST },
        { path: '/apollo/user/session', method: RequestMethod.POST },
        { path: '/sputnik/user/session', method: RequestMethod.POST },
        {
          path: '/user/first-access',
          method: RequestMethod.POST,
        },
        {
          path: '/apollo/user/partner/first-access',
          method: RequestMethod.POST,
        },
        { path: '/theme/origin', method: RequestMethod.GET },
        { path: '/baas/callback/:integrationId', method: RequestMethod.POST },
      )
      .forRoutes('*');

    consumer
      .apply(AuthorizationMiddleware, AuthorizationIntegrationMiddleware)
      .exclude(
        { path: '/authorization/session', method: RequestMethod.POST },
        { path: '/authorization/app', method: RequestMethod.POST },
        { path: '/authorization/ib', method: RequestMethod.POST },
        { path: '/apollo/user/session', method: RequestMethod.POST },
        { path: '/sputnik/user/session', method: RequestMethod.POST },
        {
          path: '/user/first-access',
          method: RequestMethod.POST,
        },
        {
          path: '/apollo/user/partner/first-access',
          method: RequestMethod.POST,
        },
        { path: '/theme/origin', method: RequestMethod.GET },
        { path: '/baas/callback/:integrationId', method: RequestMethod.POST },
      )
      .forRoutes({ path: '/*', method: RequestMethod.ALL });

    consumer
      .apply(AuthorizationAdminMiddleware)
      .exclude(
        {
          path: '/authorization/session',
          method: RequestMethod.POST,
        },
        {
          path: '/authorization/ib',
          method: RequestMethod.POST,
        },
        {
          path: '/authorization/app',
          method: RequestMethod.POST,
        },
        { path: '/apollo/user/session', method: RequestMethod.POST },
        { path: '/sputnik/user/session', method: RequestMethod.POST },
        { path: '/theme/origin', method: RequestMethod.GET },
        { path: '/baas/callback/:integrationId', method: RequestMethod.POST },
        {
          path: '/client/services',
          method: RequestMethod.GET,
        },
        {
          path: '/acquiring/transactions',
          method: RequestMethod.GET,
        },
        {
          path: '/acquiring/transactions/receivables',
          method: RequestMethod.GET,
        },
        {
          path: '/acquiring/transactions/establishments',
          method: RequestMethod.GET,
        },
        {
          path: '/waiver/client/economic-group',
          method: RequestMethod.GET,
        },
        {
          path: '/waiver/withdrawal-solicitation/clients-balances',
          method: RequestMethod.GET,
        },
        {
          path: '/waiver/withdrawal-solicitation',
          method: RequestMethod.GET,
        },
        {
          path: '/waiver/withdrawal-solicitation/:id',
          method: RequestMethod.GET,
        },
        {
          path: '/waiver/withdrawal-solicitation',
          method: RequestMethod.POST,
        },
        {
          path: '/apollo/operation-assignor',
          method: RequestMethod.POST,
        },
        {
          path: '/apollo/user/partner',
          method: RequestMethod.GET,
        },
        {
          path: '/apollo/user/partner',
          method: RequestMethod.POST,
        },
        {
          path: '/apollo/user/partner/first-access',
          method: RequestMethod.POST,
        },
        {
          path: '/user/first-access',
          method: RequestMethod.POST,
        },
        { path: 'apollo/assignor/me', method: RequestMethod.GET },

        'spin/(.*)',
        'apollo/operation-assignor/(.*)',
        'apollo/operation/payer/(.*)',
        'apollo/operation-supplier/assignor/(.*)',
        'apollo/operation-supplier/payer/(.*)',
        'sputnik/operation/supplier/(.*)',
      )
      .forRoutes('/*');

    consumer
      .apply(AuthorizationUserPayerApolloMiddleware)
      .exclude(
        {
          method: RequestMethod.GET,
          path: '/apollo/user',
        },
        {
          path: '/apollo/user/partner/first-access',
          method: RequestMethod.POST,
        },

        '/apollo/operation-assignor/(.*)',
      )
      .forRoutes({
        path: '/apollo/operation/payer/*',
        method: RequestMethod.ALL,
      });

    consumer.apply(AuthorizationUserClientApolloMiddleware).forRoutes({
      path: '/apollo/operation-assignor/*',
      method: RequestMethod.ALL,
    });
  }
}
