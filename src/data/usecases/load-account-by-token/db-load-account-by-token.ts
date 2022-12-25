import { ILoadAccountByTokenRepository } from './../../protocols/db/account/load-account-by-token-repository';
import {
  IDecrypter,
  ILoadAccountByToken,
} from './db-load-account-by-token-protocols';
import { IAccountModel } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) {}
  async load(accessToken: string, role?: string): Promise<IAccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
    }
    return null;
  }
}
