import {
  mockAccountModel,
  mockAddAccountParams,
} from './../../../../domain/test';
import {
  AccountModel,
  IHasher,
  AddAccountParams,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
};

const mockHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }
  return new HasherStub();
};

const mockAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new AddAccountRepositoryStub();
};

const mockLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherStub: hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(mockAddAccountParams());
    expect(hashSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(mockAccountModel()));

    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
