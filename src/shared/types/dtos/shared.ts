import { UID } from 'types-ddd';

export type DefaultCreateActionOutput = {
  id: string;
};

export type DefaultPaginationPropsInput = {
  page: number;
  pageSize: number;
};

export type DefaultPaginationPropsOutput<T> = {
  totalRecords: number;
  data: T;
  metadata?: any;
};

export type DefaultAggregateProps = {
  id?: UID;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PaginationRequest = {
  page: number;
  pageSize: number;
};

export type DefaultDBOProps = {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type PaginationUseCaseInput<T = any> = {
  page: number;
  pageSize: number;
  filters: T;
};

export type PaginationUseCaseOutput<T = any, Y = any> = {
  page: number;
  pageSize: number;
  totalRecords: number;
  data: T[];
  metadata?: Y;
};
