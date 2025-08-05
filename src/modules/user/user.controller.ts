import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilters } from './user.repository';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CustomCacheInterceptor } from '../../common/interceptors/custom-cache.interceptor';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully',
      data,
    };
  }

  @UseInterceptors(CustomCacheInterceptor)
  @CacheTTL(60000)
  @CacheKey('users-list')
  @Get()
  findMany(@Query() filters: UserFilters) {
    return this.userService.findMany(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
