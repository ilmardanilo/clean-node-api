import {
  IDecrypter,
  ILoadAccountByToken,
} from './db-load-account-by-token-protocols';
import { IAccountModel } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(private readonly decrypter: IDecrypter) {}
  async load(accessToken: string, role?: string): Promise<IAccountModel> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
