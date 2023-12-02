import { GetApolloClients } from '../../usecases';

export const makeGetApolloClients = (): GetApolloClients =>
  new GetApolloClients();
