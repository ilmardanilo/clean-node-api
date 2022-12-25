import { IEncrypter } from './../../../data/protocols/criptography/encrypter';
import jwt from 'jsonwebtoken';
import { IDecrypter } from '../../../data/protocols/criptography/decrypter';

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secretKey);
    return accessToken;
  }

  async decrypt(token: string): Promise<string> {
    await jwt.verify(token, this.secretKey);
    return null;
  }
}
