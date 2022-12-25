import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/http/http-helper';
import { IHttpRequest, IHttpResponse, IMiddleware } from '../protocols';

export class AuthMiddleware implements IMiddleware {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return forbidden(new AccessDeniedError());
  }
}
