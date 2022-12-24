import {
  ValidationComposite,
  RequeredFieldValidation,
} from '../../../../validation/validators';
import { IValidation } from '../../../../presentation/protocols';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['question', 'answers']) {
    validations.push(new RequeredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
