export type CreateIntegrationUseCaseDTOInput = {
  name: string;
  email: string;
  autoApproved?: boolean;
  active?: boolean;
  credentials: {
    baas: BaaSCredencials;
  };
  origin: string;
  document: string;
  fullAccess?: boolean;
};

export type CreateIntegrationUseCaseDTOOutput = {
  id: string;
  token: string;
};

type BaaSCredencials = {
  url: string;
  key: string;
  user: User;
};

type User = {
  email: string;
  password: string;
};
