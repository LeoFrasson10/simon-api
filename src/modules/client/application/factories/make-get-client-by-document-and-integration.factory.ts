import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { GetUserByDocumentAndIntegration } from '../usecases';

export const makeGetClientByDocumentAndIntegration =
  (): GetUserByDocumentAndIntegration =>
    new GetUserByDocumentAndIntegration(
      new ClientRepository(PrismaService.getInstance()),
    );
