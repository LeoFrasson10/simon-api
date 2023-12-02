export type GetTransactionsUseCaseInput = {
  startDate: string;
  endDate: string;
  establishment: string;
  limitData?: number;
  page?: number;
};

export type GetTransactionsByEconomicGroupUseCaseInput = {
  startDate: string;
  endDate: string;
  economicGroupId?: string;
  establishmentId?: string;
};

export type GetTransactionsByEconomicGroupUseCaseOutput = {
  data: ItemOutput[];
  totals: Totals;
};

type ItemOutput = ItemResponse & {
  name: string;
  document: string;
};

export type GetTransactionsByEstablishmentIdsResponse = {
  data: ItemResponse[];
  totals: Totals;
};

type ItemResponse = {
  establishmentId: string;
  credit: Value;
  debit: Value;
  totalBrute: number;
  totalLiquid: number;
};

type Totals = {
  credit: Value;
  debit: Value;
};

type Value = {
  brute: number;
  liquid: number;
};

export type Establishment = {
  establishmentId: string;
  name: string;
  document: string;
};
