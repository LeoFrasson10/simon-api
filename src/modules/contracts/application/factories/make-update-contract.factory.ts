import { PrismaService } from '@shared/infra/db';
import { UpdateContract } from '../usecases';
import { ContractRepository } from '@modules/contracts/infra';
import {
  MakeDateProvider,
  makeAzureFileBucketProvider,
} from '@shared/providers';

export const makeUpdateContract = (): UpdateContract => {
  const orm = PrismaService.getInstance();

  return new UpdateContract(
    new ContractRepository(orm),
    makeAzureFileBucketProvider(),
    MakeDateProvider.getProvider(),
  );
};
