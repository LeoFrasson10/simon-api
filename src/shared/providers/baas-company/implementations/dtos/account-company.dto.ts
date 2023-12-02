export type AccountCompany = {
  bank_name?: string;
  bank_number: string;
  branch_number: string;
  branch_digit: string;
  account_number: string;
  account_digit: string;
  account_type: string;
  account_status: string;
};

export type AccountCompanyResponse = {
  id: string;
  alias_account: AccountCompany;
  account_number: string;
  email: string;
  individual_id?: string;
  company_id?: string;
  full_name: string;
  document: string;
  account_type: string;
  status: string;
  status_description: string;
  canceled_date?: Date;
  blocked: boolean;
  username: string;
  balance: string;
  balance_cents: number;
  last_access: Date;
};
