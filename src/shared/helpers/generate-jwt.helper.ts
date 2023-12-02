import { jwt, jwtIntegration } from '@shared/config';
import { MakeDateProvider } from '@shared/providers/date';
import { sign } from 'jsonwebtoken';
import { TokenJWTData } from './verify-jwt.helper';

export const generateJWT = (
  data: string | object | Buffer | TokenJWTData,
  maxLifetime?: string,
): {
  token: string;
  expiresIn: string;
  expiresInMilliseconds: number;
} => {
  const dateProvider = MakeDateProvider.getProvider();
  const secret = jwt.secret;
  const defaultMaxLifetime = jwt.maxLifetime ? jwt.maxLifetime : '1h';
  const expiresIn = maxLifetime ? maxLifetime : defaultMaxLifetime;

  const token = sign(data, secret, {
    expiresIn,
  });

  const expiresInMilliseconds = dateProvider.convertToMilliseconds(expiresIn);

  return {
    token,
    expiresIn,
    expiresInMilliseconds,
  };
};

export const generateJWTIntegration = (
  data: string | object | Buffer,
): {
  token: string;
  expiresIn: string;
  expiresInMilliseconds: number;
} => {
  const dateProvider = MakeDateProvider.getProvider();
  const secret = jwtIntegration.secret;
  const defaultMaxLifetime = jwtIntegration.maxLifetime
    ? jwtIntegration.maxLifetime
    : '30d';
  const expiresIn = defaultMaxLifetime;

  const token = sign(data, secret, {
    expiresIn,
  });

  const expiresInMilliseconds = dateProvider.convertToMilliseconds(expiresIn);

  return {
    token,
    expiresIn,
    expiresInMilliseconds,
  };
};
