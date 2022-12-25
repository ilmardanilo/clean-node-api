import {
  ValidationComposite,
  RequeredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
} from '../../../../../validation/validators';
import { IValidation } from '../../../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequeredFieldValidation(field));
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
