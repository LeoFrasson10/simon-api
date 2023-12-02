import { PrismaService } from '@shared/infra/db';
import { GetContractById } from '../usecases';
import { ContractRepository } from '@modules/contracts/infra';

export const makeGetContractById = (): GetContractById =>
  new GetContractById(new ContractRepository(PrismaService.getInstance()));
