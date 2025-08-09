import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserFactory } from './user.factory';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Conflict } from 'src/common/errors/conflict';
import { SearchService } from '../search/search.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;
  let searchService: jest.Mocked<SearchService>;
  let cacheManager: { clear: jest.Mock };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findByEmail: jest.fn(),
    };

    const mockSearch = {
      index: jest.fn(),
      search: jest.fn(),
    };

    const mockTx = {
      user: {
        create: jest.fn().mockResolvedValue(UserFactory.user()),
      },
    };

    const mockPrismaService: Pick<PrismaClient, '$transaction'> = {
      $transaction: jest
        .fn()
        .mockImplementation(async (cb) => await cb(mockTx)),
    };

    cacheManager = { clear: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepository },
        { provide: SearchService, useValue: mockSearch },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(
      UserRepository,
    ) as jest.Mocked<UserRepository>;
    searchService = module.get<SearchService>(
      SearchService,
    ) as jest.Mocked<SearchService>;
  });

  it('should create a user and index, clear cache, and return user', async () => {
    const createUserDto = UserFactory.createUserDto();
    const user = UserFactory.user();

    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockResolvedValue(user);

    const result = await service.create(createUserDto);

    expect(repository.create).toHaveBeenCalledWith(
      createUserDto,
      expect.any(Object),
    );
    expect(searchService.index).toHaveBeenCalledWith(user.id, createUserDto);
    expect(cacheManager.clear).toHaveBeenCalled();
    expect(result).toEqual(user);
  });
  it('should NOT create a user and index, and return conflict error', async () => {
    const createUserDto = UserFactory.createUserDto();
    const user = UserFactory.user();

    repository.findByEmail.mockResolvedValue(user);

    await expect(service.create(createUserDto)).rejects.toThrow(Conflict);

    expect(repository.create).not.toHaveBeenCalledWith(createUserDto);
    expect(searchService.index).not.toHaveBeenCalledWith(
      user.id,
      createUserDto,
    );
    expect(cacheManager.clear).not.toHaveBeenCalled();
  });

  it('should find many users and return search results', async () => {
    const filters = { search: 'test' };
    const searchResults = [UserFactory.user()];

    searchService.search = jest.fn().mockResolvedValue(searchResults);

    const result = await service.findMany(filters);

    expect(searchService.search).toHaveBeenCalledWith(filters.search);
    expect(result).toEqual(searchResults);
  });

  it('should find one user by id', async () => {
    const userId = '123';
    const user = UserFactory.user({ id: userId });

    repository.findOne.mockResolvedValue(user);

    const result = await service.findOne(userId);

    expect(repository.findOne).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
  });
});
