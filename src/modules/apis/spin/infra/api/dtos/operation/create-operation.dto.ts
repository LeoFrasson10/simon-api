export enum StatusOperation {
  received = 'received',
  sent = 'sent',
  error = 'error',
  created = 'created',
  generated = 'generated',
  signed = 'signed',
  paid = 'paid',
  settled = 'settled',
}

export type PartnerDTO = {
  name: string;
  document: string;
};

export type CreateOperationDTO = {
  borrowerId: string;
  ratingRuleId: string;
  email: string;
  phone: string;
  address: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  bankCode: string;
  agency: string;
  account: string;
  amount: number;
  totalAmount?: number;
  tranches: number;
  status?: StatusOperation;
  termId?: string;
  partners: PartnerDTO[];
  ipAddress?: string;
  timezone?: string;
};

export type ProposalFormEntries = {
  amount: string;
  installments: string;
  timezone?: string;
};
