import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository';
import { IAccountModel } from '../../domain/models/account';
import { serverError, ok } from '../../presentation/helpers/http/http-helper';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols';

interface ISutTypes {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }

  return new ControllerStub();
};

const makelogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makelogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

import { LogControllerDecorator } from './log-controller-decorator';
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );

    await sut.handle(makeFakeRequest());

    expect(logErrorSpy).toHaveBeenCalledWith('any_stack');
  });
});
