import { makeGetClientById } from '@modules/client';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyJWT } from '@shared/helpers';

export class AcquiringPermissaoGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    const payload = verifyJWT(token.replace('Bearer ', ''));
    if (payload.userId) {
      return true;
    }
    const client = await makeGetClientById().execute({
      clientId: payload.clientID,
    });

    if (client.isFail()) return false;

    const servicesModules = client.value().serviceClient.keys;

    const permissionNecessary = ['adquirencia', 'doodle', 'acquiring'];
    const hasPermission = permissionNecessary.map((perm) =>
      servicesModules.includes(perm),
    );

    return hasPermission.includes(true);
  }
}
