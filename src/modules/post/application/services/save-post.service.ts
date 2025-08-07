import { Injectable } from '@nestjs/common';
import { SavePostUseCase } from '../ports/in/save-post.use-case';
import { PostPersistencePort } from '../ports/out/post-persistence.port';
import { SavePostCommand } from '../ports/in/save-post.command';
import { PostDomain } from '../../domain/post';
import { Conflict } from 'src/common/errors/conflict';

@Injectable()
export class SavePostService implements SavePostUseCase {
  constructor(private readonly postPersistencePort: PostPersistencePort) {}

  async savePost(command: SavePostCommand): Promise<void> {
    const slugExists = await this.postPersistencePort.existsBySlug(
      command.slug,
    );
    if (slugExists) throw new Conflict('Post with this slug already exists');

    const post = new PostDomain(
      command.title,
      command.content,
      command.authorId,
      command.slug,
      command.published,
    );

    await this.postPersistencePort.persistPost(post);
  }
}
