import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { SavePostCommand } from '../../../application/ports/in/save-post.command';
import { ApiProperty } from '@nestjs/swagger';

export class SavePostRequest {
  @ApiProperty({ example: 'test title', description: 'title' })
  @Expose()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: 'cool content for test hehe',
    description: 'content',
  })
  @Expose()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({
    example: 'cme1pfdho000008l1d2v1gmmy',
    description: 'authorId',
  })
  @Expose()
  @IsNotEmpty()
  readonly authorId: string;

  @ApiProperty({
    example: true,
    description: 'published',
    default: false,
  })
  @Expose()
  @IsNotEmpty()
  readonly published: boolean;

  toCommand(): SavePostCommand {
    const slug = this.generateSlug();
    return new SavePostCommand(
      this.title,
      this.content,
      this.authorId,
      slug,
      this.published,
    );
  }

  private generateSlug(): string {
    return (
      this.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      this.authorId
    );
  }
}
