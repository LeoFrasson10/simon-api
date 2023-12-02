export type UpdatePlanAccountsUseCaseDTOInput = {
  servicePlanId: string;
  isDebit: boolean; // Caso "true", o valor será cobrado na hora
  clientsId: string[];
  userId: string;
};

export type UpdatePlanAccountsUseCaseDTOOutput = {
  success: boolean;
  message: string;
  service_plan_id: string;
  documents: string[];
  errors: {
    data: {
      error_message: string;
      error_data: {
        code: string;
        message: string;
      };
    };
    document: string;
  }[];
};

export type ClientToPlan = {
  id: string;
  integrationId: string;
  economicGroupId?: string;
  baasId?: string;
  name: string;
  email: string;
  document: string;
  type?: string;
  subject?: string;
  nature?: string;
  exemptStateRegistration?: boolean;
  stateRegistration?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  openingDate?: Date;
  monthlyInvoicing?: number;
  phone?: string;
  establishmentId?: string;
  createdAt: Date;
  updatedAt: Date;
};
