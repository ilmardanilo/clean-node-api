import { ServerError } from './../errors';
import { IHttpResponse } from './../protocols';

export const badRequest = (error: Error): IHttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};

export const serverError = (): IHttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};

export const ok = (data: any): IHttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};
