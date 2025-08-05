import {
  BaseRepository,
  PaginatedResult,
  PaginationOptions,
} from '../../base.repository';
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        searchable:
          `${createUserDto.email} ${createUserDto.name}`.toLowerCase(),
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logOperation('Update', 'User', id);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        searchable:
          `${updateUserDto.email || ''} ${updateUserDto.name || ''}`.toLowerCase(),
      },
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

  async findMany(
    options: PaginationOptions = {},
    filters: UserFilters = {},
  ): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.createdAfter && { createdAt: { gte: filters.createdAfter } }),
      ...(filters.createdBefore && {
        createdAt: { lte: filters.createdBefore },
      }),
      searchable: {
        search: filters.search,
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,

        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      this.count(where),
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit),
    };
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
