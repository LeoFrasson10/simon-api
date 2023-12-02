export type Installments = {
  number: number;
  amount: number;
  total_amount: number;
};

export type CalculatorParams = {
  amount: number;
  interestRate?: number;
  cnpj?: string;
};

export type CalculatorResponse = {
  amount: number;
  monthly_fee: number;
  installments: Installments[];
};
