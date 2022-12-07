import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RiqueredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { IValidation } from '../../presentation/helpers/validators/validation';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RiqueredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
