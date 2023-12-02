import { PrismaService } from '@shared/infra/db';

import { Result } from 'types-ddd';
import {
  AdapterClientDBOToDomain,
  Client,
  ClientAccountPlan,
  CreateClientOutput,
  IClientRepository,
  ListClientsInputFilters,
  ListClientsOutput,
} from '@modules/client/domain';
import { DefaultCreateActionOutput } from '@shared/types';
import { Prisma } from '@prisma/client';
import { PartnerTypeEnum } from '@shared/utils';

export class ClientRepository implements IClientRepository {
  constructor(private readonly orm: PrismaService) {}

  public async findClientById(clientId: string): Promise<Result<Client>> {
    try {
      const dbo = await this.orm.client.findFirst({
        where: {
          id: {
            in: [clientId],
          },
        },
        include: {
          serviceClient: true,
          integration: true,
          clientAccounts: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
          clientOperators: true,
          clientPartners: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
        },
      });

      if (dbo === null) return Result.fail('Cliente não encontrado');

      const adapter = new AdapterClientDBOToDomain();

      const adapted = adapter.build({
        ...dbo,
        income_value: Number(dbo.income_value),
        service_client_id: dbo.service_client_id,
        monthly_invoicing: Number(dbo.monthly_invoicing),
        integration: dbo.integration,
        ...(dbo.clientAccounts
          ? {
              accounts: dbo.clientAccounts[0],
            }
          : {}),
        ...(dbo.clientOperators
          ? {
              operators: dbo.clientOperators,
            }
          : {}),
        ...(dbo.clientPartners
          ? {
              partners: dbo.clientPartners.map((partner) => ({
                ...partner,
                documen_type: partner.document_type,
              })),
            }
          : {}),

        ...(dbo.serviceClient
          ? {
              service_client: dbo.serviceClient,
            }
          : {}),

        ...(dbo.economicGroup
          ? {
              economic_group: {
                ...dbo.economicGroup,
                contacts: dbo.economicGroup.economicGroupContact,
              },
            }
          : {}),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findClientByEstablishmentId(
    establishmentId: string,
  ): Promise<Result<Client>> {
    try {
      const dbo = await this.orm.client.findFirst({
        where: {
          establishment_id: {
            in: [establishmentId],
          },
        },
        include: {
          serviceClient: true,
          integration: true,
          clientAccounts: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
          clientOperators: true,
          clientPartners: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
        },
      });

      if (dbo === null) return Result.fail('Cliente não encontrado');

      const adapter = new AdapterClientDBOToDomain();

      const adapted = adapter.build({
        ...dbo,
        income_value: Number(dbo.income_value),
        service_client_id: dbo.service_client_id,
        monthly_invoicing: Number(dbo.monthly_invoicing),
        integration: dbo.integration,
        ...(dbo.clientAccounts
          ? {
              accounts: dbo.clientAccounts[0],
            }
          : {}),
        ...(dbo.clientOperators
          ? {
              operators: dbo.clientOperators,
            }
          : {}),
        ...(dbo.clientPartners
          ? {
              partners: dbo.clientPartners.map((partner) => ({
                ...partner,
                documen_type: partner.document_type,
              })),
            }
          : {}),

        ...(dbo.serviceClient
          ? {
              service_client: dbo.serviceClient,
            }
          : {}),

        ...(dbo.economicGroup
          ? {
              economic_group: {
                ...dbo.economicGroup,
                contacts: dbo.economicGroup.economicGroupContact,
              },
            }
          : {}),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findClientByBaaSId(baasId: string): Promise<Result<Client>> {
    try {
      const dbo = await this.orm.client.findFirst({
        where: {
          baas_id: {
            equals: baasId,
          },
        },
        include: {
          serviceClient: true,
          integration: true,
          clientAccounts: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
          clientOperators: true,
          clientPartners: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
        },
      });

      if (dbo === null) return Result.fail('Cliente não encontrado');

      const adapter = new AdapterClientDBOToDomain();

      const adapted = adapter.build({
        ...dbo,
        income_value: Number(dbo.income_value),
        service_client_id: dbo.service_client_id,
        monthly_invoicing: Number(dbo.monthly_invoicing),
        integration: dbo.integration,
        ...(dbo.clientAccounts
          ? {
              accounts: dbo.clientAccounts[0],
            }
          : {}),
        ...(dbo.clientOperators
          ? {
              operators: dbo.clientOperators,
            }
          : {}),
        ...(dbo.clientPartners
          ? {
              partners: dbo.clientPartners.map((partner) => ({
                ...partner,
                documen_type: partner.document_type,
              })),
            }
          : {}),

        ...(dbo.serviceClient
          ? {
              service_client: dbo.serviceClient,
            }
          : {}),
        ...(dbo.economicGroup
          ? {
              economic_group: {
                ...dbo.economicGroup,
                contacts: dbo.economicGroup.economicGroupContact,
              },
            }
          : {}),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findClientByDocument(document: string): Promise<Result<Client>> {
    try {
      const dbo = await this.orm.client.findFirst({
        where: {
          document: {
            equals: document,
          },
        },
        include: {
          serviceClient: true,
          integration: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
        },
      });

      if (dbo === null) return Result.fail('Cliente não encontrado');

      const adapter = new AdapterClientDBOToDomain();

      const adapted = adapter.build({
        ...dbo,
        income_value: Number(dbo.income_value),
        service_client_id: dbo.service_client_id,
        monthly_invoicing: Number(dbo.monthly_invoicing),
        integration: dbo.integration,
        ...(dbo.serviceClient
          ? {
              service_client: dbo.serviceClient,
            }
          : {}),
        ...(dbo.economicGroup
          ? {
              economic_group: {
                ...dbo.economicGroup,
                contacts: dbo.economicGroup.economicGroupContact,
              },
            }
          : {}),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findClientByDocumentAndIntegration(
    document: string,
    integrationId: string,
  ): Promise<Result<Client>> {
    try {
      const dbo = await this.orm.client.findFirst({
        where: {
          document: {
            equals: document,
          },
          AND: {
            integration_id: {
              equals: integrationId,
            },
          },
        },
        include: {
          serviceClient: true,
          integration: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
        },
      });

      if (dbo === null) return Result.fail('Cliente não encontrado');

      const adapter = new AdapterClientDBOToDomain();

      const adapted = adapter.build({
        ...dbo,
        income_value: Number(dbo.income_value),
        service_client_id: dbo.service_client_id,
        monthly_invoicing: Number(dbo.monthly_invoicing),
        ...(dbo.serviceClient
          ? {
              service_client: dbo.serviceClient,
            }
          : {}),
        integration: dbo.integration,
        ...(dbo.economicGroup
          ? {
              economic_group: {
                ...dbo.economicGroup,
                contacts: dbo.economicGroup.economicGroupContact,
              },
            }
          : {}),
      });

      return Result.Ok(adapted.value());
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async createClient(
    data: Client,
    standardServices: string[],
  ): Promise<Result<CreateClientOutput>> {
    try {
      const clientDBO = await this.orm.$transaction(async (tx) => {
        const clientDBO = await tx.client.create({
          data: {
            baas_id: data.get('baasId'),
            integration_id: data.get('integrationId').value(),
            name: data.get('name'),
            email: data.get('email'),
            document: data.get('document'),
            type: data.get('type'),
            subject: data.get('subject'),
            nature: data.get('nature'),
            exempt_state_registration: data.get('exemptStateRegistration'),
            state_registration: data.get('stateRegistration'),
            street: data.get('street'),
            number: data.get('number'),
            complement: data.get('complement'),
            zip: data.get('zip'),
            neighborhood: data.get('neighborhood'),
            city: data.get('city'),
            state: data.get('state'),
            country: data.get('country'),
            opening_date: data.get('openingDate'),
            approved_date: data.get('approvedDate'),
            monthly_invoicing: data.get('monthlyInvoicing'),
            phone: data.get('phone'),
            birthDate: data.get('birthDate'),
            gender: data.get('gender'),
            income_value: data.get('incomeValue'),
            motherName: data.get('motherName'),
            nationality: data.get('nationality'),
            nationalityState: data.get('nationalityState'),
            profession: data.get('profession'),
            establishment_id: data.get('establishmentId') || '',
            ...(data.get('operators') && {
              clientOperators: {
                createMany: {
                  data: data.get('operators').map((op) => ({
                    name: op.value().get('name'),
                    permission: op.value().get('permission'),
                    document: op.value().get('document'),
                    email: op.value().get('email'),
                    blocked: op.value().get('blocked'),
                  })),
                },
              },
            }),
            clientAccounts: {
              create: {
                account_number: data
                  .get('accounts')
                  .value()
                  .get('accountNumber'),
                account_type: data.get('accounts').value().get('accountType'),
                baas_account_id: data
                  .get('accounts')
                  .value()
                  .get('baasAccountId'),
                bank_number: data.get('accounts').value().get('bankNumber'),
                branch_digit:
                  data.get('accounts').value().get('branchDigit') ?? null,
                branch_number: data.get('accounts').value().get('branchNumber'),
              },
            },
            ...(data.get('partners') && {
              clientPartners: {
                createMany: {
                  data: data.get('partners').map((p) => ({
                    document: p.value().get('document'),
                    city: p.value().get('city') || null,
                    birthday_date: p.value().get('birthdayDate') || null,
                    complement: p.value().get('complement') || null,
                    number: p.value().get('number') || null,
                    document_type: p
                      .value()
                      .get('documenType') as PartnerTypeEnum,
                    name: p.value().get('name'),
                    country: p.value().get('country') || null,
                    neighborhood: p.value().get('neighborhood') || null,
                    phone: p.value().get('phone') || null,
                    zip: p.value().get('zip') || null,
                    state: p.value().get('state') || null,
                    street: p.value().get('street') || null,
                  })),
                },
              },
            }),
          },
        });

        if (!clientDBO) {
          throw new Error(`Erro ao inserir cliente`);
        }

        const serviceClient = await tx.service_client.create({
          data: {
            client_id: data.id.value(),
            modules_keys: standardServices,
          },
        });

        if (!serviceClient) {
          throw new Error(`Erro ao inserir serviço para o cliente`);
        }

        const clientFinalDBO = await tx.client.update({
          data: {
            service_client_id: serviceClient.id,
          },
          where: {
            id: clientDBO.id,
          },
          include: {
            serviceClient: true,
          },
        });

        return clientFinalDBO;
      });

      return Result.Ok({
        id: clientDBO.id,
        document: clientDBO.document,
        name: clientDBO.name,
        monthlyInvoicing: Number(clientDBO.monthly_invoicing),
        integrationId: clientDBO.integration_id,
        email: clientDBO.email,
        phone: clientDBO.phone,
        serviceClient: {
          id: clientDBO.serviceClient.id,
          modulesKeys: clientDBO.serviceClient.modules_keys,
        },
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async createByIntegration(
    data: Client,
    standardServices: string[],
  ): Promise<Result<CreateClientOutput>> {
    try {
      const clientDBO = await this.orm.$transaction(async (tx) => {
        const clientDBO = await tx.client.create({
          data: {
            baas_id: data.get('baasId') || null,
            integration_id: data.get('integrationId').value(),
            name: data.get('name'),
            email: data.get('email'),
            document: data.get('document'),
            type: data.get('type'),
            subject: data.get('subject'),
            nature: data.get('nature'),
            exempt_state_registration: data.get('exemptStateRegistration'),
            state_registration: data.get('stateRegistration'),
            street: data.get('street'),
            number: data.get('number'),
            complement: data.get('complement'),
            zip: data.get('zip'),
            neighborhood: data.get('neighborhood'),
            city: data.get('city'),
            state: data.get('state'),
            country: data.get('country'),
            opening_date: data.get('openingDate'),
            approved_date: data.get('approvedDate'),
            monthly_invoicing: data.get('monthlyInvoicing'),
            phone: data.get('phone'),
            establishment_id: data.get('establishmentId') || '',
          },
        });

        if (!clientDBO) {
          throw new Error(`Erro ao inserir cliente`);
        }

        const serviceClient = await tx.service_client.create({
          data: {
            client_id: data.id.value(),
            modules_keys: standardServices,
          },
        });

        if (!serviceClient) {
          throw new Error(`Erro ao inserir serviço para o cliente`);
        }

        const clientFinalDBO = await tx.client.update({
          data: {
            service_client_id: serviceClient.id,
          },
          where: {
            id: clientDBO.id,
          },
          include: {
            serviceClient: true,
          },
        });

        return clientFinalDBO;
      });

      return Result.Ok({
        id: clientDBO.id,
        document: clientDBO.document,
        name: clientDBO.name,
        monthlyInvoicing: Number(clientDBO.monthly_invoicing),
        integrationId: clientDBO.integration_id,
        email: clientDBO.email,
        phone: clientDBO.phone,
        serviceClient: {
          id: clientDBO.serviceClient.id,
          modulesKeys: clientDBO.serviceClient.modules_keys,
        },
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async listClients(
    filters: ListClientsInputFilters,
  ): Promise<Result<ListClientsOutput>> {
    try {
      const {
        page,
        pageSize,
        onlyAcquiring,
        document,
        name,
        nameOrDocument,
        approvedDateEnd,
        approvedDateStart,
        integrationId,
      } = filters;

      if (approvedDateEnd)
        approvedDateEnd.setDate(approvedDateEnd.getDate() + 1);

      const cnpj = nameOrDocument
        ? nameOrDocument.replace(/[^\d]+/g, '')
        : undefined;

      const where: Prisma.clientWhereInput = {
        ...(document
          ? {
              document: {
                contains: document,
              },
            }
          : {}),
        ...(name
          ? {
              name: {
                contains: name,
              },
            }
          : {}),
        ...(onlyAcquiring
          ? {
              establishment_id: {
                not: null || '',
              },
            }
          : {}),
        ...(nameOrDocument
          ? {
              OR: [
                { name: { contains: nameOrDocument, mode: 'insensitive' } },
                { document: { contains: cnpj } },
              ],
              AND: {
                baas_id: {
                  not: null || '',
                },
              },
            }
          : {}),
        ...(approvedDateStart || approvedDateEnd
          ? {
              approved_date: {
                ...(approvedDateStart ? { gte: approvedDateStart } : {}),
                ...(approvedDateEnd ? { lt: approvedDateEnd } : {}),
              },
            }
          : {}),
        ...(integrationId
          ? {
              integration_id: {
                equals: integrationId,
              },
            }
          : {}),
      };

      const dbos = await this.orm.client.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          integration: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
          serviceClient: true,
        },
        orderBy: {
          approved_date: 'desc',
        },
      });

      const adapter = new AdapterClientDBOToDomain();
      const data: Client[] = [];
      for (const dbo of dbos) {
        const adapted = adapter.build({
          ...dbo,
          income_value: Number(dbo.income_value),
          monthly_invoicing: Number(dbo.monthly_invoicing),
          establishment_id: dbo.establishment_id,
          economic_group: dbo.economicGroup
            ? {
                active: dbo.economicGroup.active,
                name: dbo.economicGroup.name,
                note: dbo.economicGroup.note,
                contacts: dbo.economicGroup.economicGroupContact,
              }
            : null,
        });

        if (adapted.isFail()) {
          return Result.fail(`${adapted.error()}: ${dbo.name}`);
        }

        data.push(adapted.value());
      }
      const countClients = await this.orm.client.count({ where });

      return Result.Ok({
        data,
        totalRecords: countClients,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async listClientsWithBaaSId(): Promise<Result<ListClientsOutput>> {
    try {
      const dbos = await this.orm.client.findMany({
        where: {
          baas_id: {
            not: null || '',
          },
        },
        include: {
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
          serviceClient: true,
        },
        orderBy: {
          economicGroup: {
            name: 'asc',
          },
        },
      });

      const adapter = new AdapterClientDBOToDomain();
      const data: Client[] = [];
      for (const dbo of dbos) {
        const adapted = adapter.build({
          ...dbo,
          income_value: Number(dbo.income_value),
          monthly_invoicing: Number(dbo.monthly_invoicing),
          establishment_id: dbo.establishment_id,
          economic_group: dbo.economicGroup
            ? {
                active: dbo.economicGroup.active,
                name: dbo.economicGroup.name,
                note: dbo.economicGroup.note,
                contacts: dbo.economicGroup.economicGroupContact,
              }
            : null,
        });

        if (adapted.isFail()) {
          return Result.fail(`${adapted.error()}: ${dbo.name}`);
        }

        data.push(adapted.value());
      }
      const countClients = await this.orm.client.count({
        where: {
          baas_id: {
            not: null || '',
          },
        },
      });

      return Result.Ok({
        data,
        totalRecords: countClients,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findClientsByEconomicGroup(
    economicGroupId: string,
  ): Promise<Result<Client[]>> {
    try {
      const dbos = await this.orm.client.findMany({
        where: {
          economic_group_id: {
            equals: economicGroupId,
          },
        },
        include: {
          serviceClient: true,
          integration: true,
          clientAccounts: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
          clientOperators: true,
          clientPartners: true,
          economicGroup: {
            include: {
              economicGroupContact: true,
            },
          },
        },
      });

      const adapter = new AdapterClientDBOToDomain();
      const data: Client[] = [];
      for (const dbo of dbos) {
        const adapted = adapter.build({
          ...dbo,
          income_value: Number(dbo.income_value),
          service_client_id: dbo.service_client_id,
          monthly_invoicing: Number(dbo.monthly_invoicing),
          integration: dbo.integration,
          ...(dbo.clientAccounts
            ? {
                accounts: dbo.clientAccounts[0],
              }
            : {}),
          ...(dbo.clientOperators
            ? {
                operators: dbo.clientOperators,
              }
            : {}),
          ...(dbo.clientPartners
            ? {
                partners: dbo.clientPartners.map((partner) => ({
                  ...partner,
                  documen_type: partner.document_type,
                })),
              }
            : {}),

          ...(dbo.serviceClient
            ? {
                service_client: dbo.serviceClient,
              }
            : {}),
          ...(dbo.economicGroup
            ? {
                economic_group: {
                  ...dbo.economicGroup,
                  contacts: dbo.economicGroup.economicGroupContact,
                },
              }
            : {}),
        });

        if (adapted.isFail()) {
          return Result.fail(`${adapted.error()}: ${dbo.name}`);
        }

        data.push(adapted.value());
      }

      return Result.Ok(data);
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async update(
    data: Client,
    standardServices: string[],
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const clientDBO = await this.orm.$transaction(async (tx) => {
        let serviceId = data.get('serviceClientId');
        if (
          data.get('serviceClient').value().get('keys').sort() !==
          standardServices.sort()
        ) {
          const serviceClient = await tx.service_client.create({
            data: {
              client_id: data.id.value(),
              modules_keys: standardServices,
            },
          });

          if (!serviceClient) {
            throw new Error(`Erro ao inserir serviço para o cliente`);
          }

          serviceId = serviceClient.id;
        }

        const clientFinalDBO = await tx.client.update({
          data: {
            economic_group_id: data.get('economicGroupId')
              ? data.get('economicGroupId').value()
              : null,
            establishment_id: data.get('establishmentId')
              ? data.get('establishmentId')
              : null,
            service_client_id: serviceId,
          },
          where: {
            id: data.id.value(),
          },
        });

        if (!clientFinalDBO) {
          throw new Error(`Erro ao alterar client`);
        }

        return clientFinalDBO;
      });

      return Result.Ok({
        id: clientDBO.id,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async changeClientApprovedDate(
    data: Client,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const dbo = await this.orm.client.update({
        data: {
          approved_date: data.get('approvedDate'),
        },
        where: {
          id: data.id.value(),
        },
      });

      return Result.Ok({
        id: dbo.id,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async createClientAccountPlan(
    data: ClientAccountPlan,
  ): Promise<Result<DefaultCreateActionOutput>> {
    try {
      const dbo = await this.orm.client_account_plan.create({
        data: {
          id: data.id.value(),
          baas_plan_id: data.get('baasPlanId'),
          description: data.get('description'),
          name: data.get('name'),
          client_id: data.get('clientId').value(),
          user_id: data.get('userId').value(),
          monthly_payment: data.get('monthlyPayment'),
        },
      });

      return Result.Ok({
        id: dbo.id,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }
}
