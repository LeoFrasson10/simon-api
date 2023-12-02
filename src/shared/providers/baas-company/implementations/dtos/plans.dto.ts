export type BaaSPlansOutput = {
  itens: BaaSPlan[];
};

export type BaaSPlansResponse = {
  success: boolean;
  itens: BaaSPlan[];
};

export type BaaSPlan = {
  id: string;
  list: boolean;
  default: boolean;
  deleted: boolean;
  name: string;
  description: string;
  monthly_payment: number;
  enable_pf: boolean;
  enable_pj: boolean;
  data: PlanData[];
};

type PlanData = {
  type: string;
  type_description: string;
  fee: number;
  free: number;
};
