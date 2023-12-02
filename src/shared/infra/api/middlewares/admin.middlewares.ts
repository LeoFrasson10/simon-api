import { makeGetUserById } from '@modules/user';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { verifyJWT } from '@shared/helpers';
import { Response, NextFunction, Request } from 'express';

@Injectable()
export class AuthorizationAdminMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const reqToken = req.headers.authorization;
    const payload = verifyJWT(reqToken.replace('Bearer ', ''));

    if (payload.userId) {
      const user = await makeGetUserById().execute({
        userId: payload.userId,
      });

      if (user.isFail() || !user.value().isAdmin) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'Você não tem permissão para acessar esta rota.' });
      }
    } else {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Você não tem permissão para acessar esta rota.' });
    }

    return next();
  }
}
