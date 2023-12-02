import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { verifyJWT, verifyJWTIntegration } from '@shared/helpers';
import { MakeCryptoProvider } from '@shared/providers';
import { NextFunction, Response, Request } from 'express';

export class AuthorizationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tokenIntegration = req.headers['subscription-key'] as string;
    const encryptation = MakeCryptoProvider.getProvider();

    const decryptToken = await encryptation.publicDecryptHash(tokenIntegration);
    const integrationIsValid =
      decryptToken && decryptToken.isOk()
        ? verifyJWTIntegration(decryptToken.value())
        : null;

    if (tokenIntegration && integrationIsValid) {
      return next();
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Token inválido',
      });
    }

    const tokenIsValid = verifyJWT(token.replace('Bearer ', ''));

    if (!tokenIsValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Token inválido',
      });
    }

    return next();
  }
}
