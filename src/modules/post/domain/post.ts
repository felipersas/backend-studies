export class PostDomain {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly slug: string,
    public readonly published: boolean = false,
  ) {
    if (published && (!title || !content)) {
      throw new Error('Published posts must have a title and content.');
    }
  }

  // Additional methods can be added here if needed
}
