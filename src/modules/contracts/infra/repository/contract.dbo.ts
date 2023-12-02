import { DefaultDBOProps } from '@shared/types';

export type ContractDBO = DefaultDBOProps & {
  title: string;
  description?: string;
  version: number;
  filename: string;
  path: string;
  user_id?: string;
  details?: string;
  use_spreadsheet?: boolean;
};
