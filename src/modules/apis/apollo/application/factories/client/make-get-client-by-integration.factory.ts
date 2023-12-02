import { GetApolloClientByIntegration } from '../../usecases';

export const makeGetApolloClientByIntegration =
  (): GetApolloClientByIntegration => new GetApolloClientByIntegration();
