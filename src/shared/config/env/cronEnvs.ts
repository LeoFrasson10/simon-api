type CronEnvs = {
  searchNewClientsCronTime: string;
  searchNewClientsJobActive: boolean;
};

export const cronEnvs: CronEnvs = {
  searchNewClientsCronTime: process.env.NEW_CLIENTS_CRON_TIME,
  searchNewClientsJobActive: process.env.NEW_CLIENTS_JOB_ACTIVE === 'true',
};
