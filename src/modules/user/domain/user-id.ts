export class UserIdDomain {
  constructor(public readonly id: string) {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid user ID');
    }
  }
}
