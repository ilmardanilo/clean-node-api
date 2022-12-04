import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols';

interface ISutTypes {
  sut: LogControllerDecorator;
  controllerStub: IController;
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

const makeSut = (): ISutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub,
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
});
