import { server } from './server';

type ModalEnvs = {
  baseUrl: string;
  subscriptionKey: string;
  authEmail: string;
  authPassword: string;
  tokenMaxLifetimeInMinutes: string;
};

export const modal: ModalEnvs = {
  authEmail:
    server.env === 'production'
      ? process.env.MODAL_AUTH_EMAIL_PROD
      : process.env.MODAL_AUTH_EMAIL_HOMOL,
  authPassword:
    server.env === 'production'
      ? process.env.MODAL_AUTH_PASSWORD_PROD
      : process.env.MODAL_AUTH_PASSWORD_HOMOL,
  baseUrl:
    server.env === 'production'
      ? process.env.MODAL_BASE_URL_PROD
      : process.env.MODAL_BASE_URL_HOMOL,
  subscriptionKey:
    server.env === 'production'
      ? process.env.MODAL_SUBSCRIPTION_KEY_PROD
      : process.env.MODAL_SUBSCRIPTION_KEY_HOMOL,
  tokenMaxLifetimeInMinutes: process.env.MODAL_JWT_MAX_LIFETIME_MINUTES ?? '10',
};
