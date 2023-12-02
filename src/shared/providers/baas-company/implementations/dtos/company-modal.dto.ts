export type CompanyItemListModal = {
  id: string;
  companyName: string;
  documentNumber: string;
  status: string;
  companyEmail: string;
  promotional_code: string;
  approved_date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CompanyModalResponse = {
  docs: CompanyItemListModal[];
  totalDocs: number;
  limit: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalPages: number;
  prevPage: number;
  nextPage: number;
};
