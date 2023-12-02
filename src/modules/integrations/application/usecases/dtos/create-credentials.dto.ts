export type CreateCredentialsUseCaseDTOInput = {
  integrationId: string;
  baas: BaaSCredencials;
};

export type CreateCredentialsUseCaseDTOOutput = {
  id: string;
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
