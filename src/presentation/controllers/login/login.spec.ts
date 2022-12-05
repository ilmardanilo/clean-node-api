import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { IHttpRequest } from './../../protocols/http';
import { LoginController } from './login';

interface ISutTypes {
  sut: LoginController;
}

const makeSut = (): ISutTypes => {
  const sut = new LoginController();
  return {
    sut,
  };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
