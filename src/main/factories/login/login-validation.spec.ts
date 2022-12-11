import { makeLoginValidation } from './login-validation';
import {
  EmailValidation,
  ValidationComposite,
  RequeredFieldValidation,
} from '../../../presentation/helpers/validators';
import { IValidation } from '../../../presentation/protocols/validation';
import { IEmailValidator } from '../../../presentation/protocols/email-validator';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: IValidation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequeredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
