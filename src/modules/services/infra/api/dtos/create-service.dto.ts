export type CreateServiceDTORequest = {
  name: string;
  key?: string;
  active?: boolean;
  standard: boolean;
  label: string;
};
