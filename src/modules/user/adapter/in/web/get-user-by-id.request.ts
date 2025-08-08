import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { GetUserByIdQuery } from 'src/modules/user/application/ports/in/get-user-by-id.query';

export class GetUserByIdRequest {
  @ApiProperty({
    example: 'cme1pfdho000008l1d2v1gmmy',
    description: 'User ID',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  toQuery() {
    return new GetUserByIdQuery(this.id);
  }
}
