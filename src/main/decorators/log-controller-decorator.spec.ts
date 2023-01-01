import { mockAccountModel } from './../../domain/test';
import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository';
import { serverError, ok } from '../../presentation/helpers/http/http-helper';
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
};

const mockController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(mockAccountModel()));
    }
  }

  return new ControllerStub();
};

const mocklogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = mockController();
  const logErrorRepositoryStub = mocklogErrorRepository();
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

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

import { LogControllerDecorator } from './log-controller-decorator';
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(mockRequest());

    expect(handleSpy).toHaveBeenCalledWith(mockRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(mockServerError()));

    await sut.handle(mockRequest());

    expect(logErrorSpy).toHaveBeenCalledWith('any_stack');
  });
});
