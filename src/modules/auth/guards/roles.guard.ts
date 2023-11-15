import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import {
  REQUEST_USER_KEY,
  ROLES_KEY,
  UserRolesEnum,
} from '../../../config/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    return requiredRoles.some(
      (role: UserRolesEnum) => user?.roles?.includes(role),
    );
  }
}
