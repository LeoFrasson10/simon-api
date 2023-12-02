import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { verifyJWT, verifyJWTIntegration } from '@shared/helpers';
import { MakeCryptoProvider } from '@shared/providers';
import { NextFunction, Response, Request } from 'express';

export class AuthorizationIntegrationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    const tokenIsValid = token
      ? verifyJWT(token.replace('Bearer ', ''))
      : false;

    if (token && tokenIsValid) {
      return next();
    }

    const tokenIntegration = req.headers['subscription-key'] as string;

    if (!tokenIntegration) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Token inválido',
      });
    }

    const encryptation = MakeCryptoProvider.getProvider();

    const decryptToken = await encryptation.publicDecryptHash(tokenIntegration);
    const integrationIsValid =
      decryptToken && decryptToken.isOk()
        ? verifyJWTIntegration(decryptToken.value())
        : null;

    if (!integrationIsValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Token inválido',
      });
    }

    return next();
  }
}
