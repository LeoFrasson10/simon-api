export type CreateApolloAssignorDTORequest = {
  name: string;
  document: string;
  ratingRuleId?: string;
  clientId?: string;
  monthlyInvoicingOnboarding: number;
  monthlyInvoicingEstimated: number;
  monthlyInvoicing: number;
  externalClientId: string;
};
