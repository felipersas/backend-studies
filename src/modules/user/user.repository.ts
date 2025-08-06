import { BaseRepository } from '../../base.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export interface UserFilters {
  search?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(
    data: CreateUserDto,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    if (tx) {
      return tx.user.create({ data });
    }
    return this.prisma.user.create({ data });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logOperation('Update', 'User', id);
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findOne(id: string): Promise<User | null> {
    this.logOperation('Find', 'User', id);
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async count(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
