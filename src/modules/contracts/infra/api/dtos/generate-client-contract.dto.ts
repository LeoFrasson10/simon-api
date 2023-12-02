export type GenerateClientContractDTO = {
  client?: {
    name: string;
    email: string;
    accountNumber: string;
    address: string;
    zip: string;
    neighborhood: string;
    document: string;
    city: string;
    state: string;
    branches: string[];
  };
};
