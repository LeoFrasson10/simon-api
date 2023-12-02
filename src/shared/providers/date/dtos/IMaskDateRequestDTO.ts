export type IMaskDateRequestDTO = {
  date: Date;
  mask: 'dd/MM/yyyy' | 'yyyy-MM-dd' | string;
  timezone?: string;
};
