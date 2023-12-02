import { PrismaService } from '@shared/infra/db';
import { GenerateClientContract } from '../usecases';
import { ContractRepository } from '@modules/contracts/infra';
import {
  MakeDateProvider,
  makeAzureFileBucketProvider,
} from '@shared/providers';

export const makeGenerateClientContract = (): GenerateClientContract =>
  new GenerateClientContract(
    new ContractRepository(PrismaService.getInstance()),
    makeAzureFileBucketProvider(),
    MakeDateProvider.getProvider(),
  );
