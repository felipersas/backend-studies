import { User } from '@prisma/client';
import { GetUserUseCase } from '../ports/in/get-user.use-case';
import { GetUserByIdQuery } from '../ports/in/get-user-by-id.query';
import { UserIdDomain } from '../../domain/user-id';
import { NotFound } from 'src/common/errors/not-found';
import { Injectable } from '@nestjs/common';
import { UserDatabasePort } from '../ports/out/user-query.port';

@Injectable()
export class GetUserService implements GetUserUseCase {
  constructor(private readonly userQueryPort: UserDatabasePort) {}

  async getById(query: GetUserByIdQuery): Promise<User | null> {
    const id = new UserIdDomain(query.id);
    const user = await this.userQueryPort.getUserById(id);
    if (!user) {
      throw new NotFound('User not found');
    }
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userQueryPort.getUserByEmail(email);
    if (!user) {
      throw new NotFound('User not found');
    }
    return user;
  }
}
