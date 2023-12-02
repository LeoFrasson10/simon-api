export type FindTransactionsByClientRequest = {
  startDate: string;
  endDate: string;
  establishment: string;
  limitData?: number;
  page?: number;
};

export type FindTransactionsByEconomicGroupRequest = {
  startDate: string;
  endDate: string;
  economicGroupId?: string;
  establishmentId?: string;
};
