export type ListPaymentBillsDTORequest = {
    page: number;
    pageSize: number;
    economicGroupId?: string;
    document?: string;
    status?: string

};
  