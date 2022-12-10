import { EmailValidation } from './../../presentation/helpers/validators/email-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RiqueredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { makeSignUpValidation } from './signup-validation';
import { IValidation } from '../../presentation/helpers/validators/validation';
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { IEmailValidator } from '../../presentation/protocols/email-validator';

jest.mock('./../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): IEmailValidator => {
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
      validations.push(new RiqueredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
