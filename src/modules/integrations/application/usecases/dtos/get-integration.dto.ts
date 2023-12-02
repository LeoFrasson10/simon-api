export type GetIntegrationUseCaseDTOInput = {
  integrationId?: string;
};

export type GetIntegrationUseCaseDTOOutput = {
  id: string;
  name: string;
  email: string;
  autoApproved: boolean;
  origin: string;
  createdAt: Date;
  updatedAt: Date;
  fullAccess: boolean;
};

export type RefreshTokenIntegrationUseCaseDTOOutput = {
  newToken: string;
};
