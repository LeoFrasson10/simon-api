import { CreateApolloClient } from '../../usecases';

export const makeCreateApolloClient = (): CreateApolloClient =>
  new CreateApolloClient();
