import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { ChangeApprovedDateClient } from '../usecases';

export const makeChangeClientApprovedDate = (): ChangeApprovedDateClient =>
  new ChangeApprovedDateClient(
    new ClientRepository(PrismaService.getInstance()),
  );
