type ServicesEnvs = {
  baseUrlSpin: string;
  spinAppKey: string;
  baseUrlAcquiring: string;
  acquiringAppKey: string;
  baseUrlWaiver: string;
  waiverAppKey: string;
  baseUrlApollo: string;
  apolloAppKey: string;

  baseUrlSputnik: string;
  sputnikAppKey: string;
};

export const services: ServicesEnvs = {
  baseUrlSpin: process.env.SPIN_API_URL,
  spinAppKey: process.env.SPIN_APP_KEY,

  baseUrlAcquiring: process.env.ACQUIRING_API_URL,
  acquiringAppKey: process.env.ACQUIRING_APP_KEY,

  baseUrlWaiver: process.env.WAIVER_API_URL,
  waiverAppKey: process.env.WAIVER_APP_KEY,

  baseUrlApollo: process.env.APOLLO_API_URL,
  apolloAppKey: process.env.APOLLO_APP_KEY,

  baseUrlSputnik: process.env.SPUTNIK_API_URL,
  sputnikAppKey: process.env.SPUTNIK_APP_KEY,
};
