import { PrismaService } from '@shared/infra/db';
import { GetAllContracts } from '../usecases';
import { ContractRepository } from '@modules/contracts/infra';

export const makeGetAllContracts = (): GetAllContracts =>
  new GetAllContracts(new ContractRepository(PrismaService.getInstance()));
