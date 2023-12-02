export type EnvServer = 'production' | 'homologation' | 'development' | 'local';

type Server = {
  port: string;
  env: EnvServer;
  origin: string;
};

export const server: Server = {
  port: process.env.PORT,
  env: (process.env.SERVER_ENV as EnvServer) || 'local',
  origin: process.env.API_ORIGIN_DOMAIN,
};
