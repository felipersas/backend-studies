import { Prisma } from '@prisma/client';
import { PrismaService } from './modules/prisma/prisma.service';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export abstract class BaseRepository<T, CreateDto, UpdateDto> {
  constructor(protected readonly prisma: PrismaService) {}

  protected buildPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  protected buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    if (!sortBy) return { createdAt: sortOrder };
    return { [sortBy]: sortOrder };
  }

  protected logOperation(
    operation: string,
    entityName: string,
    id?: string,
  ): void {
    const timestamp = new Date().toISOString();
    const idInfo = id ? ` (ID: ${id})` : '';
    console.log(
      `[${timestamp}] ${operation} operation on ${entityName}${idInfo}`,
    );
  }

  abstract create(
    createDto: CreateDto,
    tx?: Prisma.TransactionClient,
  ): Promise<T>;

  abstract findOne(id: string): Promise<T | null>;

  abstract update(id: string, updateDto: UpdateDto): Promise<T>;

  abstract delete(id: string): Promise<void>;
}
