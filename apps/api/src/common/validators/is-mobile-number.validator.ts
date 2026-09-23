import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ALLOWED_CHARACTERS = /^[0-9+\-\s()]+$/;
const MIN_DIGITS = 10;
const MAX_DIGITS = 15;

const countDigits = (value: string): number => value.replace(/\D/g, '').length;

@ValidatorConstraint({ name: 'isMobileNumber', async: false })
export class IsMobileNumberConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const digits = countDigits(value);

    return (
      ALLOWED_CHARACTERS.test(value) && digits >= MIN_DIGITS && digits <= MAX_DIGITS
    );
  }

  defaultMessage(args: ValidationArguments): string {
    const value = args.value;

    if (typeof value !== 'string' || !ALLOWED_CHARACTERS.test(value)) {
      return 'Mobile number can only contain digits, +, -, spaces, and parentheses';
    }

    return `Mobile number must have between ${MIN_DIGITS} and ${MAX_DIGITS} digits`;
  }
}

export const IsMobileNumber = (validationOptions?: ValidationOptions) =>
  function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMobileNumberConstraint,
    });
  };
