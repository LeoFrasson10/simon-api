import { DefaultDBOProps } from '@shared/types';

export type ServiceClientDBO = DefaultDBOProps & {
  client_id: string;
  modules_keys: string[];
};
