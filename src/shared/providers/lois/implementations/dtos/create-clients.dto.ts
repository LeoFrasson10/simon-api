export type CreateClientsDTORequest = {
  clients: Client[];
};

export type CreateClientsDTOResponse = {
  data: ClientOutput[];
};

export type CreateClientDTORequest = Client;

export type CreateClientDTOResponse = {
  id: string;
  name: string;
  document: string;
};

type ClientOutput = {
  details?: string;
  isError?: boolean;
  client?: {
    id: string;
    name: string;
    document: string;
  };
};

type Client = {
  baasId: string;
  name: string;
  email: string;
  document: string;
  type: string;
  subject: string;
  nature: string;
  exemptStateRegistration: boolean;
  stateRegistration?: string;
  street: string;
  number: string;
  complement?: string;
  zip: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  openingDate: Date;
  monthlyInvoicing: number;
  phone: string;
  account?: Account;
  operators?: Operator[];
  partners?: Partner[];
};

type Account = {
  baasAccountId: string;
  accountNumber: string;
  accountType: string;
  bankNumber: string;
  branchDigit?: string;
  branchNumber: string;
};

type Operator = {
  name: string;
  email: string;
  document: string;
  permission: string;
  blocked: boolean;
};

type Partner = {
  name: string;
  document: string;
  documenType: string;
  birthdayDate?: Date;
  phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
};
