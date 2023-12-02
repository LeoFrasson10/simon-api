import { GetApolloAssignorByExternalId } from '../../usecases';

export const makeGetApolloAssignorByExternalId =
  (): GetApolloAssignorByExternalId => new GetApolloAssignorByExternalId();
