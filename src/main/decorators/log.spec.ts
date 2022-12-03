import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols';
import { SignUpController } from './../../presentation/controllers/signup/signup';
import { LogControllerDecorator } from './log';
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
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
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);

    expect(handleSpy).toBeCalledWith(httpRequest);
  });
});
