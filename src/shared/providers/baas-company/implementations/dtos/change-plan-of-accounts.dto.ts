export type ChangePlanAccountInputRequest = {
  service_plan_id: string;
  debit: boolean; // Caso "true", o valor será cobrado na hora
  documents: string[];
};

export type ChangePlanAccountResponse = {
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
