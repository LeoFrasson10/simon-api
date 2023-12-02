export type GetClientsDTOParams = {
  document?: string;
  page?: number;
  pageSize?: number;
};

export type GetClientsDTOResponse = {
  data: Client[];
  totalRecords: number;
};

type Client = {
  id: string;
  name: number;
  document: string;
  accountId: string;
  createdAt: string;
};
