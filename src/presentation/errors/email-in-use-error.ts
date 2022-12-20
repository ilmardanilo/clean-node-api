export class EmailInUseError extends Error {
  constructor() {
    super(`The received email is alread in use`);
    this.name = 'EmailInUseError';
  }
}
