import { Injectable } from '@nestjs/common';
import { UserDatabasePort } from '../../application/ports/out/user-query.port';
import { UserIdDomain } from '../../domain/user-id';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserDatabaseAdapter implements UserDatabasePort {
  constructor(private readonly prismaService: PrismaService) {}
  async getUserById(query: UserIdDomain): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: query.id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
