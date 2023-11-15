import { UserRolesEnum } from '../../../config/constants/auth.constants';

export interface ActiveUserData {
  /**
   * The user's id that granted the token
   */
  sub: number;

  /**
   * The user's email
   */
  email: string;

  /**
   * The user's roles
   */
  roles: UserRolesEnum[];
}
