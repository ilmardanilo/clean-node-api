import { MissingParamError } from '../../errors';
import { IValidation } from '../../protocols/validation';

export class RequeredFieldValidation implements IValidation {
  private readonly fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
