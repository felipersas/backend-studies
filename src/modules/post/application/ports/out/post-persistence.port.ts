import { Post } from '@prisma/client';
import { PostDomain } from '../../../domain/post';

//port
export abstract class PostPersistencePort {
  /**
   * This method is responsible for persisting a post.
   * It takes a partial Post object as an argument and returns a Promise that resolves to the persisted Post.
   *
   * @param post - The partial Post object to be persisted.
   * @returns A Promise that resolves to the persisted Post.
   */
  abstract persistPost(post: PostDomain): Promise<Post>;
  /**
   * This method checks if a post with the given slug already exists.
   * It takes a slug string as an argument and returns a Promise that resolves to a boolean indicating existence.
   *
   * @param slug - The slug of the post to check for existence.
   * @returns A Promise that resolves to true if the post exists, false otherwise.
   */
  abstract existsBySlug(slug: string): Promise<boolean>;
}
