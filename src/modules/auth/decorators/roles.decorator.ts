import { SetMetadata } from '@nestjs/common';
import {
  ROLES_KEY,
  UserRolesEnum,
} from '../../../config/constants/auth.constants';

export const Roles = (...roles: UserRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
