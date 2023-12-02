export type UpdatePlanAccountsDTORequest = {
  servicePlanId: string;
  isDebit: boolean; // Caso "true", o valor será cobrado na hora
  clientsId: string[];
};
