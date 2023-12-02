type JWT = {
  secret: string;
  maxLifetime: string;
  maxLifetimeToExpireSignature: string;
};

export const jwt: JWT = {
  secret: process.env.JWT_SECRET,
  maxLifetime: process.env.JWT_MAX_LIFETIME,
  maxLifetimeToExpireSignature:
    process.env.JWT_MAX_LIFETIME_TO_EXPIRE_SIGNATURE,
};

export const jwtIntegration: Omit<JWT, 'maxLifetimeToExpireSignature'> = {
  secret: process.env.JWT_INTEGRATION_SECRET,
  maxLifetime: process.env.JWT_INTEGRATION_MAX_LIFETIME,
};
