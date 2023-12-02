export type CreateClientAccountPlanUseCaseDTOInput = {
  userId: string;
  clientId: string;
  baasPlanId: string;
  name: string;
  description: string;
  monthlyPayment: number;
};

export type CreateClientAccountPlanUseCaseDTOOutput = {
  id: string;
};
