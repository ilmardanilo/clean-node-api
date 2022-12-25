import { IAccountModel } from '../../../../domain/models/account';

export interface ILoadAccountByTokenRepository {
  loadByToken(accessToken: string, role?: string): Promise<IAccountModel>;
}
