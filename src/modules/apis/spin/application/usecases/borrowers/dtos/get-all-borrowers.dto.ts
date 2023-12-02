export type GetBorrowersUseCaseDTOInput = {
  integrationId: string;
  filters: {
    page?: number;
    pageSize?: number;
    name?: string;
  };
};
