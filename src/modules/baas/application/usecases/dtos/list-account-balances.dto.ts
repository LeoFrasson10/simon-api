export type GetAccountBalancesUseCaseDTOInput = {
  documents: string;
};

export type GetAccountBalancesUseCaseDTOOutput = {
  data: Balance[];
};

type Balance = {
  name: string;
  balance: number;
  document: string;
  lastUpdate: string;
};
