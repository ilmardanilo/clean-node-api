import {
  EmailValidation,
  ValidationComposite,
  RequeredFieldValidation,
  CompareFieldsValidation,
} from '../../../../../validation/validators';
import { makeSignUpValidation } from './signup-validation-factory';
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

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequeredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
