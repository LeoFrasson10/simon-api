export type GetBaaSCompanyUseCaseDTOInput = {
  search: string;
};

export type GetBaaSCompanyUseCaseDTOOutput = {
  data: {
    id: string;
    companyName: string;
    documentNumber: string;
    status: string;
    companyEmail: string;
    promotional_code: string;
    approved_date: Date;
    createdAt: Date;
  }[];
};
