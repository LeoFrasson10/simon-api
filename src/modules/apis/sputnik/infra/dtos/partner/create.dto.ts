export type SputnikCreatePartnerDTORequest = {
  name: string;
  active?: boolean;
  email: string;
  clientId: string;
  ruleId: string;
  branches: {
    document: string;
    headquarter: boolean;
    active: boolean;
  }[];
};
