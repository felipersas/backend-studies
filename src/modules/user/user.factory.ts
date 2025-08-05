import { User } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class UserFactory {
  static createUserDto(overrides: Partial<CreateUserDto> = {}): CreateUserDto {
    return {
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      ...overrides,
    };
  }

  static user(overrides: Partial<User> = {}): User {
    return {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      searchable: 'jfkd',
      ...overrides,
    };
  }

  static userList(count: number = 3): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.user({
        id: `user-${index + 1}`,
        email: `test${index + 1}@example.com`,
        name: `Test User ${index + 1}`,
      }),
    );
  }
}
