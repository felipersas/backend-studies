export class SavePostCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly slug: string,
    public readonly published: boolean = false,
  ) {}
}
