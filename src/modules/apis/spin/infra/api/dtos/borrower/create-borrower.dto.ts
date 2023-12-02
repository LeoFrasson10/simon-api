export type CreateBorrowerDTO = {
  name: string;
  document: string;
  ratingRuleId?: string;
  clientId?: string;
  monthlyInvoicingOnboarding: number;
  monthlyInvoicingEstimated: number;
  monthlyInvoicing: number;
  integrationId: string;
  externalClientId: string;
  status?: string;
};
