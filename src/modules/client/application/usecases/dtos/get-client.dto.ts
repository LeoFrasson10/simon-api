export type GetClientUseCaseDTOInput = {
  clientId?: string;
  document?: string;
  integrationId?: string;
  economicGroupId?: string;
};

export type GetClientUseCaseDTOOutput = Client;

export type GetClientsUseCaseDTOOutput = Client[];

type Client = {
  id: string;
  integrationId: string;
  economicGroupId?: string;
  baasId?: string;
  name: string;
  email: string;
  document: string;
  type?: string;
  subject?: string;
  nature?: string;
  exemptStateRegistration?: boolean;
  stateRegistration?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  openingDate?: Date;
  monthlyInvoicing?: number;
  phone?: string;
  establishmentId?: string;
  accounts?: ClientAccount;
  operators?: ClientOperator[];
  partners?: ClientPartner[];
  createdAt: Date;
  updatedAt: Date;
  serviceClient?: {
    id: string;
    keys: string[];
  };
};

type ClientPartner = {
  id: string;
  name: string;
  document: string;
  documenType: string;
  birthdayDate?: Date;
  phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
};

type ClientOperator = {
  id: string;
  name: string;
  email: string;
  document: string;
  permission: string;
  blocked: boolean;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
};

type ClientAccount = {
  id: string;
  baasAccountId: string;
  accountNumber: string;
  accountType: string;
  bankNumber: string;
  branchDigit?: string;
  branchNumber: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
};
