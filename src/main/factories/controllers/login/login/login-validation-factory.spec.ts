import { makeLoginValidation } from './login-validation-factory';
import {
  EmailValidation,
  ValidationComposite,
  RequeredFieldValidation,
} from '../../../../../validation/validators';
import { IValidation } from '../../../../../presentation/protocols';
import { IEmailValidator } from '../../../../../validation/protocols/email-validator';

jest.mock('../../../../../validation/validators/validation-composite');

const mockEmailValidator = (): IEmailValidator => {
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
    validations.push(new EmailValidation('email', mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
