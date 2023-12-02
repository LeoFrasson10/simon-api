export type CreateNewClientsBaaSUseCaseOutput = {
  data: CreateClientOutput[];
};

export type CreateClientOutput = {
  error: boolean;
  document: string;
  baasId: string;
  details: string;
  clientId?: string;
};
