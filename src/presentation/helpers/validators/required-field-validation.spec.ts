import { MissingParamError } from '../../errors';
import { RequeredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequeredFieldValidation('field');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation success', () => {
    const sut = new RequeredFieldValidation('field');
    const error = sut.validate({ field: 'any_field' });
    expect(error).toBeFalsy();
  });
});