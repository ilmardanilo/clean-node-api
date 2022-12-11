export interface IAutenticationModel {
  email: string;
  password: string;
}

export interface IAuthentication {
  auth(authentication: IAutenticationModel): Promise<string>;
}
