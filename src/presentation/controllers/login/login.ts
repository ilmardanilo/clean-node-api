import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IEmailValidator,
  IAuthentication,
} from './login-protocols';
import {
  badRequest,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../errors';

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator;
  private readonly authentication: IAuthentication;

  constructor(
    emailValidator: IEmailValidator,
    authentication: IAuthentication
  ) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
