export type GetBaaSPlansUseCaseDTOOutput = {
  itens: BaaSPlan[];
};

type BaaSPlan = {
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
