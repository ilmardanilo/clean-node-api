export class ServerError extends Error {
  constructor(stack: string) {
    super('An unexpected error has occurred. Please try again later.');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
