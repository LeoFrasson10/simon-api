type LoisEnvs = {
  baseUrl: string;
  subscriptionKey?: string;
  authEmail: string;
  authPassword: string;
};

export const lois: LoisEnvs = {
  authEmail: process.env.LOIS_AUTH_EMAIL,
  authPassword: process.env.LOIS_AUTH_PASSWORD,
  baseUrl: process.env.LOIS_BASE_URL,
  // subscriptionKey: process.env.MODAL_SUBSCRIPTION_KEY_HOMOL,
};
