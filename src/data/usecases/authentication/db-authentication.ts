import { IHashComparer } from './../../protocols/criptography/hash-comparer';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import {
  IAuthentication,
  IAutenticationModel,
} from './../../../domain/usecases/authentication';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashComparer: IHashComparer;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  async auth(authentication: IAutenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      await this.hashComparer.compare(
        authentication.password,
        account.password
      );
    }
    return null;
  }
}
