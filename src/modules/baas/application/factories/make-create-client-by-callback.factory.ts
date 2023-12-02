import { makeCompany } from '@shared/providers';
import { CreateClientByCallbackBaaS } from '../usecases';

export const makeCreateClientByCallback = (): CreateClientByCallbackBaaS =>
  new CreateClientByCallbackBaaS(makeCompany());
