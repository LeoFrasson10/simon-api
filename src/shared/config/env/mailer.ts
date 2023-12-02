import { EnvServer } from './server';

type MailerEnvs = {
  fromEmail: string;
  fromTitle: string;
  maxLifeTokenInNotification: string;
  linkClientCallback: string;
  linkClientPortalCallback: string;
  Pidgey: {
    URL: string;
    Token: string;
  };
  defaultEmailsRecipients: string[];
};

const serverEnv: EnvServer = process.env.SERVER_ENV as EnvServer;

export const Mailer: MailerEnvs = {
  // host: process.env.MAILER_HOST,
  // SMTPPort: parseInt(process.env.MAILER_SMTP_PORT),
  // secure: process.env.MAILER_SECURE === 'true' ? true : false,
  // username: process.env.MAILER_USERNAME,
  // password: process.env.MAILER_PASSWORD,
  fromEmail:
    serverEnv === 'production'
      ? process.env.MAILER_FROM_EMAIL
      : process.env.MAILER_FROM_EMAIL_DEV,
  fromTitle:
    serverEnv === 'production'
      ? process.env.MAILER_FROM_TITLE
      : process.env.MAILER_FROM_TITLE_DEV,
  Pidgey: {
    URL:
      serverEnv === 'production'
        ? process.env.MAILER_PIDGEY_URL
        : process.env.MAILER_PIDGEY_URL_DEV,
    Token:
      serverEnv === 'production'
        ? process.env.MAILER_PIDGEY_TOKEN
        : process.env.MAILER_PIDGEY_TOKEN_DEV,
  },
  maxLifeTokenInNotification: process.env.MAX_LIFE_TOKEN_IN_NOTIFICATION,
  linkClientPortalCallback:
    serverEnv === 'production'
      ? process.env.LINK_PORTAL_CALLBACK_PROD
      : serverEnv === 'homologation'
      ? process.env.LINK_PORTAL_CALLBACK_HOMOL
      : process.env.LINK_PORTAL_CALLBACK_DEV,

  linkClientCallback:
    serverEnv === 'production'
      ? process.env.LINK_CLIENT_CALLBACK_PROD
      : serverEnv === 'homologation'
      ? process.env.LINK_CLIENT_CALLBACK_HOMOL
      : process.env.LINK_CLIENT_CALLBACK_DEV,

  defaultEmailsRecipients: !!process.env.MAILER_DEFAULT_EMAIL_RECIPIENTS
    ? process.env.MAILER_DEFAULT_EMAIL_RECIPIENTS.split(',')
    : [],
};
