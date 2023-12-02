import { makeGetUserById } from '@modules/user';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@shared/decorator';
import { verifyJWT } from '@shared/helpers';
import { Permission } from '@shared/utils';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const thorowException = () => {
      throw new HttpException(
        'Você não tem permissão para acessar essa rota',
        HttpStatus.FORBIDDEN,
      );
    };

    const requiredRoles = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    const payload = verifyJWT(token.replace('Bearer ', ''));

    if (!payload.userId) thorowException();
    const client = await makeGetUserById().execute({
      userId: payload.userId,
    });

    if (!client) thorowException();
    if (
      !requiredRoles.some((role) => client.value().permission?.includes(role))
    )
      thorowException();
    return true;
  }
}
