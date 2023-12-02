export type CreateCredentialsDTO = {
  baas: BaaSCredencials;
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
