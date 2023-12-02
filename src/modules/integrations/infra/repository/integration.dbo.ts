import { DefaultDBOProps } from '@shared/types';

export type IntegrationDBO = DefaultDBOProps & {
  id?: string;
  name: string;
  email: string;
  auto_approved?: boolean;
  active?: boolean;
  due_date?: Date;
  origin?: string;
  document?: string;
  credentials?: string;
  key?: string;
  full_access?: boolean;
  services?: ServiceIntegrationDBO[];
};

type ServiceIntegrationDBO = DefaultDBOProps & {
  integration_id: string;
  service_ids: string[];
};
