import { CreateApolloAssignor } from '../../usecases';

export const makeCreateApolloAssignor = (): CreateApolloAssignor =>
  new CreateApolloAssignor();
