import { ClientRepository } from '@modules/client/infra';
import { PrismaService } from '@shared/infra/db';
import { CreateClientAccountPlan } from '../usecases';

export const makeCreateClientAccountPlan = (): CreateClientAccountPlan =>
  new CreateClientAccountPlan(
    new ClientRepository(PrismaService.getInstance()),
  );
