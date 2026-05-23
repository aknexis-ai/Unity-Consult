import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: string; permissions?: string[] } }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.role === "super_admin") {
      return true;
    }

    const userPermissions = user.permissions ?? [];
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }
}
