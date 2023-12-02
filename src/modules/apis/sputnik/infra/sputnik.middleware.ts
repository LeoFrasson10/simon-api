import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CustomRequest } from '@shared/types';
import { makeGetSputnikSupplierByExternalId } from '../application';

@Injectable()
export class SputnikMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.clientId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Client Id não encontrado',
      });
    }

    const assignor = await makeGetSputnikSupplierByExternalId().execute({
      clientId: req.clientId,
      integrationId: req.integrationId,
    });

    if (assignor.isFail())
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: assignor.error(),
      });

    req.sputnikSupplierId = assignor.value().id;

    next();
  }
}

@Injectable()
export class ApolloPayerMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.userPartnerId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Usuário não encontrado',
      });
    }

    next();
  }
}
