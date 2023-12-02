export type CreateIntegrationDTO = {
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

type BaaSCredencials = {
  url: string;
  key: string;
  user: User;
};

type User = {
  email: string;
  password: string;
};
