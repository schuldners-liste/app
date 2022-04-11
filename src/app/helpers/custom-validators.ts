import { ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  public static debtorsAmountValidator(debtorsList: string[]): ValidatorFn {
    return (control): ValidationErrors | null => {
      return debtorsList.length > 0 ? null : { message: 'Debtors list is empty' };
    };
  }

}
