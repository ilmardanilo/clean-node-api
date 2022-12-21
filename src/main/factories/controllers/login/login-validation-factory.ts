import {
  ValidationComposite,
  RequeredFieldValidation,
  EmailValidation,
} from '../../../../validation/validators';
import { IValidation } from '../../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequeredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
