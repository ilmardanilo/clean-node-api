import { forbidden } from './../../../helpers/http/http-helper';
import { SignUpController } from './signup-controller';
import {
  EmailInUseError,
  MissingParamError,
  ServerError,
} from '../../../errors';
import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IHttpRequest,
  IValidation,
  IAuthentication,
  IAutenticationModel,
} from './signup-controller-protocols';
import { ok, badRequest, serverError } from '../../../helpers/http/http-helper';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
  authenticationStub: IAuthentication;
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'name',
    email: 'any-email@example.com',
    password: '123',
    passwordConfirmation: '123',
  },
});

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAutenticationModel): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'any-email@example.com',
      password: '123',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 200 returns an accessToken on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any-email@example.com',
      password: '123',
    });
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });
});
