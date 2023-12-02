import { PrismaService } from '@shared/infra/db';
import { CreateContract } from '../usecases';
import { ContractRepository } from '@modules/contracts/infra';
import {
  MakeDateProvider,
  makeAzureFileBucketProvider,
} from '@shared/providers';

export const makeCreateContract = (): CreateContract =>
  new CreateContract(
    new ContractRepository(PrismaService.getInstance()),
    makeAzureFileBucketProvider(),
    MakeDateProvider.getProvider(),
  );
