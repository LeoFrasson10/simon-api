import { DefaultDBOProps } from '@shared/types';

export type ServiceIntegrationDBO = DefaultDBOProps & {
  integration_id: string;
  service_ids: string[];
};
