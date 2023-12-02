export type ProcessBorrowerDTO = {
  integrationId: string;
  documents: {
    cnpj: string;
    companyName: string;
    monthlyInvoicing: number;
  }[];
};
