import { GetBorrowerByExternalId } from '../../usecases';

export const makeGetBorrowerByExternalId = (): GetBorrowerByExternalId =>
  new GetBorrowerByExternalId();
