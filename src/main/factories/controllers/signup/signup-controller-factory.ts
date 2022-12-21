import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from './../../usecases/db-account/db-add-account-factory';
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller';
import { IController } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';

export const makeSignUpController = (): IController => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );
  return makeLogControllerDecorator(controller);
};