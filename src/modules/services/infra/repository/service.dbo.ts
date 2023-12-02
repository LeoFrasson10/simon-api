import { DefaultDBOProps } from '@shared/types';

export type ServiceDBO = DefaultDBOProps & {
  name: string;
  label: string;
  key: string;
  active: boolean;
  standard: boolean;
};
