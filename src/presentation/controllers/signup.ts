import { ServerError } from './../errors/server-error';
import { InvalidParamError } from './../errors/invalid-param-error';
import { IEmailValidator } from './../protocols/email-validator';
import { IController } from './../protocols/controller';
import { badRequest, serverError } from './../helpers/http-helper';
import { MissingParamError } from './../errors/missing-param-error';
import { IHttpRequest, IHttpResponse } from './../protocols/http';

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator;

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
