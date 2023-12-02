import { makeGetIntegrationById } from '@modules/integrations';
import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { verifyJWT, verifyJWTIntegration } from '@shared/helpers';
import { MakeCryptoProvider } from '@shared/providers';
import { CustomRequest } from '@shared/types';
import { NextFunction, Response } from 'express';

export class JwtMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const subKey = req.headers['subscription-key'] as string;
    const token = subKey;

    if (token) {
      try {
        const encryptation = MakeCryptoProvider.getProvider();

        const decryptToken = await encryptation.publicDecryptHash(token);

        if (!decryptToken || decryptToken.isFail()) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            message: 'Token inválido',
          });
        }
        const payload = verifyJWTIntegration(decryptToken.value());

        req.integrationId = payload.integrationId;
      } catch (e) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Token inválido',
        });
      }
    }
    const reqToken = req.headers.authorization;

    if (reqToken) {
      try {
        const payload = verifyJWT(reqToken.replace('Bearer ', ''));

        req.clientId = payload?.clientID;
        req.userId = payload?.userId;
        req.integrationId = payload?.integrationId;
        req.userPartnerId = payload?.userPartnerId;

        if (payload.integrationId) {
          const verify = await makeGetIntegrationById().execute({
            integrationId: payload.integrationId,
          });

          if (verify.isFail()) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
              message: 'Token inválido',
            });
          }
        }
      } catch (e) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Token inválido',
        });
      }
    }
    return next();
  }
}
