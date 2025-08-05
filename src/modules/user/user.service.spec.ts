import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserSearchService } from '../search/usersearch.service';
import { UserFactory } from './user.factory';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;
  let userSearch: jest.Mocked<UserSearchService>;
  let cacheManager: { clear: jest.Mock };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    };

    const mockUserSearch = {
      indexUser: jest.fn(),
      searchUsers: jest.fn(),
    };

    cacheManager = { clear: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepository },
        { provide: UserSearchService, useValue: mockUserSearch },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(
      UserRepository,
    ) as jest.Mocked<UserRepository>;
    userSearch = module.get<UserSearchService>(
      UserSearchService,
    ) as jest.Mocked<UserSearchService>;
  });

  it('should create a user and index, clear cache, and return user', async () => {
    const createUserDto = UserFactory.createUserDto();
    const user = UserFactory.user();

    repository.create.mockResolvedValue(user);

    const result = await service.create(createUserDto);

    expect(repository['create']).toHaveBeenCalledWith(createUserDto);
    expect(userSearch['indexUser']).toHaveBeenCalledWith(
      user.id,
      createUserDto,
    );
    expect(cacheManager.clear).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  it('should find many users and return search results', async () => {
    const filters = { search: 'test' };
    const searchResults = [UserFactory.user()];

    userSearch.searchUsers = jest.fn().mockResolvedValue(searchResults);

    const result = await service.findMany(filters);

    expect(userSearch['searchUsers']).toHaveBeenCalledWith(filters.search);
    expect(result).toEqual(searchResults);
  });

  it('should find one user by id', async () => {
    const userId = '123';
    const user = UserFactory.user({ id: userId });

    repository.findOne.mockResolvedValue(user);

    const result = await service.findOne(userId);

    expect(repository['findOne']).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
  });
});
