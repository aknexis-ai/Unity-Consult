import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserRole } from "../../users/schemas/user.schema";
import { ROLES_KEY } from "../decorators/roles.decorator";

const staffFunctionRoles = new Set<UserRole>([
  UserRole.Finance,
  UserRole.Support,
  UserRole.Seo,
  UserRole.Design,
  UserRole.Content,
  UserRole.Hr,
  UserRole.Operations,
  UserRole.CrmOps,
  UserRole.Staff,
]);

function hasRoleAccess(role: UserRole, requiredRoles: UserRole[]) {
  if (role === UserRole.SuperAdmin) {
    return true;
  }

  if (requiredRoles.includes(role)) {
    return true;
  }

  if (requiredRoles.includes(UserRole.Admin) && role === UserRole.Admin) {
    return true;
  }

  if (requiredRoles.includes(UserRole.Staff) && staffFunctionRoles.has(role)) {
    return true;
  }

  return false;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
    const role = request.user?.role;

    return !!role && hasRoleAccess(role, requiredRoles);
  }
}
