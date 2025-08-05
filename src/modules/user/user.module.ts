import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';
import { UserSearchService } from '../search/usersearch.service';
import { SearchModule } from '../search/search.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [UserController],
  imports: [SearchModule, CacheModule.register()],
  providers: [UserService, PrismaService, UserRepository, UserSearchService],
})
export class UserModule {}
