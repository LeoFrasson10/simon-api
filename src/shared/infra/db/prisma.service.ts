import { INestApplication, OnModuleInit } from '@nestjs/common';
import {
  integration,
  PrismaClient,
  user,
  client,
  client_account,
  client_operator,
  client_partner,
  economic_group,
  economic_group_contact,
  service,
  service_client,
  integration_log,
} from '@prisma/client';

export type IntegrationDB = integration & {
  due_date?: Date;
  integration_log?: integration_log[];
};
export type UserDB = user;
export type ClientDB = client;
export type ClientAccountDB = client_account;
export type ClientOperatorDB = client_operator;
export type ClientPartnerDB = client_partner;
export type EconomicGroupDB = economic_group;
export type EconomicGroupContactDB = economic_group_contact;
export type ServiceDB = service;
export type ServiceClientDB = service_client;
export type ClientCompletedDB = ClientDB & {
  economicGroup?: economic_group;
  serviceClient?: ServiceClientDB;
  clientPartners?: ClientPartnerDB[];
  clientOperators?: ClientOperatorDB[];
  clientAccounts?: ClientAccountDB[];
};

export class PrismaService extends PrismaClient implements OnModuleInit {
  protected orm: PrismaClient;
  protected static instance: PrismaService;

  private constructor() {
    super();

    this.orm = new PrismaClient();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) PrismaService.instance = new PrismaService();

    return PrismaService.instance;
  }
}
