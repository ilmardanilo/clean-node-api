import { MongoHelper } from './../helpers/mongo-helper';
import { IAddAccountRepository } from './../../../../data/protocols/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';

export class AccountMongoRepository implements IAddAccountRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');

    const { insertedId } = await accountCollection.insertOne(accountData);

    const account = {
      id: insertedId.toString(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
    };

    return account;
  }
}
