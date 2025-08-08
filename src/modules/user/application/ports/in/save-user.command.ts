export class SaveUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly avatar?: string,
  ) {}
}
