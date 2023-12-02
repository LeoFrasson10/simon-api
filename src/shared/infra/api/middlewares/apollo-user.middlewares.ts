import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { verifyJWT } from '@shared/helpers';
import { Response, NextFunction, Request } from 'express';

@Injectable()
export class AuthorizationUserPayerApolloMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const reqToken = req.headers.authorization;
    const payload = verifyJWT(reqToken.replace('Bearer ', ''));

    if (!payload.userPartnerId) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Você não tem permissão para acessar esta rota.' });
    }

    return next();
  }
}

@Injectable()
export class AuthorizationUserClientApolloMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const reqToken = req.headers.authorization;
    const payload = verifyJWT(reqToken.replace('Bearer ', ''));

    if (!payload.clientID) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Você não tem permissão para acessar esta rota.' });
    }

    return next();
  }
}
