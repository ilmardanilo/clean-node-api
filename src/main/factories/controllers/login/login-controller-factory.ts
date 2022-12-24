import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory';
import { makeLoginValidation } from './login-validation-factory';
import { IController } from '../../../../presentation/protocols';
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';

export const makeLoginController = (): IController => {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(controller);
};
