import { mockAccountModel } from './../../../../domain/test';
import { DbAuthentication } from './db-authentication';
import {
  AuthenticationParams,
  AccountModel,
  ILoadAccountByEmailRepository,
  IHashComparer,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const mockLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const mockHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

const mockEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  return new EncrypterStub();
};

const mockUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub
    implements IUpdateAccessTokenRepository
  {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashComparerStub: IHashComparer;
  encrypterStub: IEncrypter;
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(mockAuthenticationParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth(mockAuthenticationParams());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));
    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth(mockAuthenticationParams());
    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a token on success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    );
    await sut.auth(mockAuthenticationParams());
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });
});
