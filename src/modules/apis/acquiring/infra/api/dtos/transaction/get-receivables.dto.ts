export type GetReceivablesRequest = {
  startDate: string;
  endDate: string;
  establishment: string;
};

export type GetReceivablesByEstablishmentIdsRequest = {
  startDate: string;
  endDate: string;
  establishmentIds: string;
};
