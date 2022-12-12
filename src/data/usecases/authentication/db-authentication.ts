import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import {
  IAuthentication,
  IAutenticationModel,
} from './../../../domain/usecases/authentication';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;

  constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async auth(authentication: IAutenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null;
  }
}
