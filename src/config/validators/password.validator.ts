import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPassword implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    const regExp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );
    return regExp.test(value);
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number and one special character';
  }
}
