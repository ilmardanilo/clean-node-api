import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RiqueredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { makeSignUpValidation } from './signup-validation';
import { IValidation } from '../../presentation/helpers/validators/validation';

jest.mock('./../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RiqueredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
