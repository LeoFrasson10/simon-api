export type ChangeIntegrationUseCaseDTOInput = {
  id: string;
  name: string;
  autoApproved?: boolean;
  active?: boolean;
  origin: string;
  document: string;
};

export type ChangeIntegrationUseCaseDTOOutput = {
  id: string;
};
