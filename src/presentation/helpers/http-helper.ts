import { IHttpResponse } from './../protocols/http';

export const badRequest = (error: Error): IHttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};
