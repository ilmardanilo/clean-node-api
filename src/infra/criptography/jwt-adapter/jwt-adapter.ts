import { IEncrypter } from './../../../data/protocols/criptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secretKey);
    return accessToken;
  }
}
