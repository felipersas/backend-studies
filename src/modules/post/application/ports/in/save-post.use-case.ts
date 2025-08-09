import { SavePostCommand } from './save-post.command';

// port
export abstract class SavePostUseCase {
  /*
   * This method is responsible for saving a post.
   * It takes a SavePostCommand object as an argument and returns a Promise that resolves to void.
   *
   * @param command - The command containing the post data to be saved.
   * @returns A Promise that resolves when the post has been saved.
   */
  abstract savePost(command: SavePostCommand): Promise<void>;
}
