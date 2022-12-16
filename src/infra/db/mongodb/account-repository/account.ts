import { MongoClient } from 'mongodb';
import { MongoHelper } from './../helpers/mongo-helper';
import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository
{
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const { insertedId } = await accountCollection.insertOne(accountData);

    const account = {
      id: insertedId.toString(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
    };

    return account;
  }

  async loadByEmail(email: string): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountResult = await accountCollection.findOne({ email });
    const account = {
      id: accountResult._id.toString(),
      ...accountResult,
    };

    delete account._id;

    return account;
  }
}
