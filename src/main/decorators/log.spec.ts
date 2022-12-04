import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
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
      const httpResponse: IHttpResponse = {
        body: {
          name: 'Ilmar',
        },
        statusCode: 200,
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }

  return new ControllerStub();
};

const makelogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log(stack: string): Promise<void> {
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

import { LogControllerDecorator } from './log';
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      body: {
        name: 'Ilmar',
      },
      statusCode: 200,
    });
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)));
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
