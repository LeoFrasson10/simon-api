import { PaginationUseCaseInput, PaginationUseCaseOutput } from '@shared/types';

export type ListIntegrationsUseCaseDTOInput = PaginationUseCaseInput<{
  name?: string;
}>;

export type ListIntegrationsUseCaseDTOOutput =
  PaginationUseCaseOutput<IntegrationsListItem>;

type IntegrationsListItem = {
  id: string;
  name: string;
  email: string;
  autoApproved: boolean;
  active: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
