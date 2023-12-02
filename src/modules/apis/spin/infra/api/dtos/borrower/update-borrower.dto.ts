export type UpdateBorrowerDTO = {
  id: string;
  name?: string;
  document?: string;
  ratingRuleId?: string;
  clientId?: string;
  monthlyInvoicingOnboarding?: number;
  monthlyInvoicingEstimated?: number;
  monthlyInvoicing?: number;
  status?: string;
};
