export type AutenticationModel = {
  email: string;
  password: string;
};

export interface IAuthentication {
  auth(authentication: AutenticationModel): Promise<string>;
}
