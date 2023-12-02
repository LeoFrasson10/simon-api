import { PaginationUseCaseInput, PaginationUseCaseOutput } from '@shared/types';

export type ListContractsUseCaseDTOInput = PaginationUseCaseInput<{
  search?: string;
}>;

export type ListContractsUseCaseDTOOutput =
  PaginationUseCaseOutput<ContractsListItem>;

type ContractsListItem = {
  id: string;
  title: string;
  description: string;
  version: number;
  filename: string;
  createdAt: Date;
  useSpreadsheet: boolean;
};
