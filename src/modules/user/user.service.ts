import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilters, UserRepository } from './user.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { SearchService } from '../search/search.service';
import { Conflict } from 'src/common/errors/conflict';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly searchService: SearchService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user: User | null = null;

    const hasUser = await this.userRepository.findByEmail(createUserDto.email);

    if (hasUser) throw new Conflict('User with this email already exists.');

    await this.prisma.$transaction(async (tx) => {
      user = await this.userRepository.create(createUserDto, tx);

      try {
        await this.searchService.index(user.id, createUserDto);
      } catch {
        throw new Error(
          'Error while indexing in Elasticsearch. User not created.',
        );
      }
    });

    await this.cacheManager.clear();

    return user;
  }

  findMany(filters: UserFilters) {
    return this.searchService.search(filters.search ?? '');
  }

  findOne(id: string) {
    return this.userRepository.findOne(id);
  }
}
