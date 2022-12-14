import { IEncrypter } from './../../../data/protocols/criptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements IEncrypter {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async encrypt(value: string): Promise<string> {
    await jwt.sign({ id: value }, this.secretKey);
    return null;
  }
}
