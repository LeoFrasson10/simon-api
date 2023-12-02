import { UserRepository } from '@modules/user';
import { GetApolloOperationSupplierToFundClients } from '../../usecases';
import { PrismaService } from '@shared/infra/db';

export const makeListApolloOperationToFund =
  (): GetApolloOperationSupplierToFundClients =>
    new GetApolloOperationSupplierToFundClients(
      new UserRepository(PrismaService.getInstance()),
    );
