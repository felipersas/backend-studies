import { User } from '@prisma/client';
import { GetUserByIdQuery } from './get-user-by-id.query';

// port
export abstract class GetUserUseCase {
  abstract getById(id: GetUserByIdQuery): Promise<User | null>;

  abstract getByEmail(email: string): Promise<User | null>;
}
