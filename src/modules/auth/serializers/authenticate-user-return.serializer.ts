import { Users } from '../../user/entities/Users.entity';

export interface AuthenticateUserReturn {
  user: Users;
  token: string;
}
