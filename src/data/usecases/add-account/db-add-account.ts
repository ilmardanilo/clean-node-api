import {
  IAddAccount,
  IAccountModel,
  IAddAccountModel,
  Encrypter,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
