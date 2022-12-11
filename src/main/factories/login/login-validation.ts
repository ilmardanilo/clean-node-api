import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { RequeredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { IValidation } from '../../../presentation/helpers/validators/validation';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequeredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};