import { InvalidParamError } from '../../errors';
import { IEmailValidator } from '../../protocols/email-validator';
import { IValidation } from './validation';

export class EmailValidation implements IValidation {
  private readonly fieldName: string;
  private readonly emailValidator: IEmailValidator;

  constructor(fieldName: string, emailValidator: IEmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName);
    }
  }
}