import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateClientIntegration } from '../usecases';

export const makeCreateClientIntegration = (): CreateClientIntegration =>
  new CreateClientIntegration(
    new ClientRepository(PrismaService.getInstance()),
  );
