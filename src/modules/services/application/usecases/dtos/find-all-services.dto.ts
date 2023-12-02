import { PaginationUseCaseInput, PaginationUseCaseOutput } from '@shared/types';

export type ListServicesUseCaseDTOInput = PaginationUseCaseInput<{
  name?: string;
  keys?: string[];
}>;

export type ListServicesUseCaseDTOOutput =
  PaginationUseCaseOutput<ServicesListItem>;

export type ListServicesStandardUseCaseDTOOutput = {
  data: ServicesListItem[];
  totalRecords: number;
};

type ServicesListItem = {
  id: string;
  name: string;
  key: string;
  active: boolean;
  standard: boolean;
  label: string;
  createdAt: Date;
  updatedAt: Date;
};
