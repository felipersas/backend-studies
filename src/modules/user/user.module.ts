import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';
import { UserSearchService } from '../search/usersearch.service';
import { SearchModule } from '../search/search.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchService } from '../search/search.service';

@Module({
  controllers: [UserController],
  imports: [SearchModule, CacheModule.register()],
  providers: [
    UserService,
    PrismaService,
    UserRepository,
    {
      provide: SearchService,
      useClass: UserSearchService,
    },
  ],
})
export class UserModule {}
