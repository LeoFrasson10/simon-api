import { PrismaService } from '@shared/infra/db';
import { Result } from 'types-ddd';
import { DefaultCreateActionOutput } from '@shared/types';
import { Prisma } from '@prisma/client';
import {
  AdapterContractOperatorDBOToDomain,
  Contract,
  IContractRepository,
  ListContractsInputFilters,
  ListContractsOutput,
} from '@modules/contracts/domain';

export class ContractRepository implements IContractRepository {
  constructor(private readonly orm: PrismaService) {}

  public async findById(contractId: string): Promise<Result<Contract>> {
    const dbo = await this.orm.contract.findFirst({
      where: {
        id: {
          in: [contractId],
        },
      },
    });

    if (dbo === null) return Result.fail('Contrato não encontrado');

    const adapter = new AdapterContractOperatorDBOToDomain();

    const adapted = adapter.build({
      ...dbo,
    });

    return Result.Ok(adapted.value());
  }

  public async create(
    data: Contract,
  ): Promise<Result<DefaultCreateActionOutput>> {
    await this.orm.$transaction(async (tx) => {
      return await tx.contract.create({
        data: {
          filename: data.get('filename'),
          title: data.get('title'),
          version: data.get('version'),
          id: data.id.value(),
          description: data.get('description'),
          use_spreadsheet: data.get('useSpreadsheet'),
          path: data.get('path'),
          contract_logs: {
            create: {
              details: data.get('details'),
              filename: data.get('filename'),
              user_id: data.get('userId').value(),
            },
          },
        },
      });
    });

    return Result.Ok({
      id: data.id.value(),
    });
  }

  public async list(
    filters: ListContractsInputFilters,
  ): Promise<Result<ListContractsOutput>> {
    const { page, pageSize, search } = filters;

    const where: Prisma.contractWhereInput = {
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                description: {
                  contains: search,
                },
              },
            ],
          }
        : {}),
    };

    const dbos = await this.orm.contract.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const adapter = new AdapterContractOperatorDBOToDomain();
    const data: Contract[] = [];
    for (const dbo of dbos) {
      const adapted = adapter.build({
        ...dbo,
      });

      if (adapted.isFail()) {
        return Result.fail(`${adapted.error()}: ${dbo.title}`);
      }

      data.push(adapted.value());
    }
    const count = await this.orm.contract.count({ where });

    return Result.Ok({
      data,
      totalRecords: count,
    });
  }

  public async update(
    data: Contract,
  ): Promise<Result<DefaultCreateActionOutput>> {
    const clientDBO = await this.orm.$transaction(async (tx) => {
      const clientFinalDBO = await tx.contract.update({
        data: {
          filename: data.get('filename'),
          title: data.get('title'),
          version: data.get('version'),
          id: data.id.value(),
          description: data.get('description'),
          use_spreadsheet: data.get('useSpreadsheet'),
          path: data.get('path'),
          contract_logs: {
            create: {
              details: data.get('details'),
              filename: data.get('filename'),
              user_id: data.get('userId').value(),
            },
          },
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
  }
}
