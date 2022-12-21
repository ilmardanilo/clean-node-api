import { MissingParamError } from '../../presentation/errors';
import { RequeredFieldValidation } from './required-field-validation';

const makeSut = (): RequeredFieldValidation => {
  return new RequeredFieldValidation('field');
};

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation success', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_field' });
    expect(error).toBeFalsy();
  });
});
