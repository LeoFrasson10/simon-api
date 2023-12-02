import { GetClientFromBaaSByDocument } from '../usecases';

export const makeGetClientFromBaaS = (): GetClientFromBaaSByDocument =>
  new GetClientFromBaaSByDocument();
