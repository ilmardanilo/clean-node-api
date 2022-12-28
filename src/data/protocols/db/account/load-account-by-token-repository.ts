import { AccountModel } from '../../../../domain/models/account';

export interface ILoadAccountByTokenRepository {
  loadByToken(accessToken: string, role?: string): Promise<AccountModel>;
}
