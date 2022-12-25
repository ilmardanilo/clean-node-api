import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '../../../usecases/account/db-account/db-add-account-factory';
import { SignUpController } from '../../../../../presentation/controllers/login/signup/signup-controller';
import { IController } from '../../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory';

export const makeSignUpController = (): IController => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );
  return makeLogControllerDecorator(controller);
};
