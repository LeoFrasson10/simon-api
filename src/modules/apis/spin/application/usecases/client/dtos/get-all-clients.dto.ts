export type GetSpinClientsUseCaseDTOInput = {
  integrationId: string;
  filters: {
    page?: number;
    pageSize?: number;
    name?: string;
  };
};
