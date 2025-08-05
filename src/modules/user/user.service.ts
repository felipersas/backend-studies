import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilters, UserRepository } from './user.repository';
import { UserSearchService } from '../search/usersearch.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSearch: UserSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    await this.userSearch.index(user.id, createUserDto);

    await this.cacheManager.clear();

    return user;
  }

  findMany(filters: UserFilters) {
    return this.userSearch.search(filters.search ?? '');
  }

  findOne(id: string) {
    return this.userRepository.findOne(id);
  }
}
