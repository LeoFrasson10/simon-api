import { EnvServer } from './server';

type DiscordEnvs = {
  webhook: string;
  webhookCnpj: string;
  webhookEmails: string;
  webhookFlowInvest: string;
};

const serverEnv: EnvServer = process.env.SERVER_ENV as EnvServer;

export const discordWebhook: DiscordEnvs = {
  webhook: process.env.DISCORD_WEBHOOK,
  webhookCnpj: process.env.DISCORD_WEBHOOK_CNPJ,
  webhookEmails:
    serverEnv === 'production'
      ? process.env.DISCORD_WEBHOOK_EMAILS_PROD
      : serverEnv === 'homologation'
      ? process.env.DISCORD_WEBHOOK_EMAILS_HOMOL
      : process.env.DISCORD_WEBHOOK_EMAILS_DEV,

  webhookFlowInvest:
    serverEnv === 'production'
      ? process.env.DISCORD_WEBHOOK_FLOWINVEST_PROD
      : serverEnv === 'homologation'
      ? process.env.DISCORD_WEBHOOK_FLOWINVEST_HOMOL
      : process.env.DISCORD_WEBHOOK_FLOWINVEST_DEV,
};
