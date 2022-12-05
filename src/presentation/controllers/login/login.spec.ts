import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { IHttpRequest } from './../../protocols/http';
import { LoginController } from './login';

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const sut = new LoginController();
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});