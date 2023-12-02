import { verify } from 'jsonwebtoken';
import { jwtIntegration, jwt } from '@shared/config';

type IntegrationJWTData = {
  integrationId: string;
};

export type TokenJWTData = {
  clientID?: string;
  userId?: string;
  integrationId?: string;
  userPartnerId?: string;
};

export const verifyJWT = (
  token: string,
  maxLifetime?: string,
): TokenJWTData => {
  const secret = jwt.secret;
  const defaultMaxLifetime = jwt.maxLifetime ? jwt.maxLifetime : '1h';
  try {
    const data = verify(token, secret, {
      maxAge: maxLifetime ? maxLifetime : defaultMaxLifetime,
    });
    return data as TokenJWTData;
  } catch (error) {
    return null;
  }
};

export const verifyJWTIntegration = (
  token: string,
  maxLifetime?: string,
): IntegrationJWTData => {
  const secret = jwtIntegration.secret;
  const defaultMaxLifetime = jwtIntegration.maxLifetime
    ? jwtIntegration.maxLifetime
    : '30d';
  try {
    const data = verify(token, secret, {
      maxAge: maxLifetime ? maxLifetime : defaultMaxLifetime,
    });
    return data as IntegrationJWTData;
  } catch (error) {
    return null;
  }
};
