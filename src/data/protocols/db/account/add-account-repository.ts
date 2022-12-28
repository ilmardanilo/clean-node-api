import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModel } from '../../../../domain/models/account';

export interface IAddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
