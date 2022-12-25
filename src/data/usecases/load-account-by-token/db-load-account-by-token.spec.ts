import { DbLoadAccountByToken } from './db-load-account-by-token';
import { IDecrypter } from './db-load-account-by-token-protocols';

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements IDecrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve('any_value'));
      }
    }
    const decrypterStub = new DecrypterStub();
    const decrypt = jest.spyOn(decrypterStub, 'decrypt');
    const sut = new DbLoadAccountByToken(decrypterStub);
    await sut.load('any_token');
    expect(decrypt).toHaveBeenCalledWith('any_token');
  });
});
