import { User } from '@prisma/client';
import { UserIdDomain } from 'src/modules/user/domain/user-id';

export abstract class UserDatabasePort {
  abstract getUserById(id: UserIdDomain): Promise<User | null>;

  abstract getUserByEmail(email: string): Promise<User | null>;
}
