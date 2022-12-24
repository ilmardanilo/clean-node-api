import { ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { IAddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { IAccountModel } from '../../../../domain/models/account';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository
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
    const account = await accountCollection.findOne({ email });

    if (!account) {
      return account;
    }

    return MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }
}
