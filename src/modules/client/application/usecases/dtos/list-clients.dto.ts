import { PaginationUseCaseInput, PaginationUseCaseOutput } from '@shared/types';

export type ListClientsUseCaseDTOInput = PaginationUseCaseInput<{
  name?: string;
  document?: string;
  onlyAcquiring?: boolean;
  nameOrDocument?: string;
  approvedDateStart?: string;
  approvedDateEnd?: string;
}>;

export type ListClientsUseCaseDTOOutput =
  PaginationUseCaseOutput<ClientsListItem>;

type ClientsListItem = {
  id: string;
  name: string;
  document: string;
  baasId?: string;
  approvedDate: Date;
  integrationName?: string;
  economicGroup?: {
    id: string;
    name: string;
  };
  createdAt: Date;
};
