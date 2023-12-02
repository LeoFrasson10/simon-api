export type CreateClientUseCaseDTOInput = {
  document: string;
  integrationId: string;
};

export type CreateClientUseCaseDTOOutput = {
  id: string;
  name: string;
  document: string;
  monthlyInvoicing: number;
  integrationId: string;
  email?: string;
  phone?: string;
  serviceClient?: {
    id: string;
    modulesKeys: string[];
  };
};
