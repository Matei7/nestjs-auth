import { SetMetadata } from '@nestjs/common';
import {
  AUTH_TYPE_KEY,
  AuthType,
} from '../../../config/constants/auth.constants';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
