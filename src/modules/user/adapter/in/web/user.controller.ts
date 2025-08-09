import { Controller, Get, Param } from '@nestjs/common';

import { GetUserByIdRequest } from './get-user-by-id.request';
import { GetUserByIdQuery } from 'src/modules/user/application/ports/in/get-user-by-id.query';
import { GetUserUseCase } from 'src/modules/user/application/ports/in/get-user.use-case';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'user ID, needs to be CUID',
    example: 'cme1pfdho000008l1d2v1gmmy',
  })
  findOne(@Param() params: GetUserByIdRequest) {
    const query: GetUserByIdQuery = params.toQuery();
    return this.getUserUseCase.getById(query);
  }
}
