import { FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Helper functions for form management
 */

/**
 * Marks all controls in a form as touched
 */
export function markFormGroupTouched(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach((key) => {
    const control = formGroup.get(key);
    control?.markAsTouched();

    if (control instanceof FormGroup) {
      markFormGroupTouched(control);
    }
  });
}

/**
 * Gets all validation errors from a form
 */
export function getFormValidationErrors(formGroup: FormGroup): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(formGroup.controls).forEach((key) => {
    const control = formGroup.get(key);
    const controlErrors = control?.errors;

    if (controlErrors) {
      errors[key] = controlErrors;
    }

    if (control instanceof FormGroup) {
      const nestedErrors = getFormValidationErrors(control);
      if (Object.keys(nestedErrors).length > 0) {
        errors[key] = nestedErrors;
      }
    }
  });

  return errors;
}

/**
 * Resets a form and marks it as pristine and untouched
 */
export function resetForm(formGroup: FormGroup, value?: any): void {
  formGroup.reset(value);
  formGroup.markAsPristine();
  formGroup.markAsUntouched();
}

/**
 * Checks if a form control has an error and has been touched
 */
export function hasError(
  control: AbstractControl | null,
  errorType: string
): boolean {
  return !!(control && control.hasError(errorType) && control.touched);
}

/**
 * Gets the error message for a control based on validation errors
 */
export function getErrorMessage(
  control: AbstractControl | null,
  fieldName: string = 'This field'
): string {
  if (!control || !control.errors || !control.touched) {
    return '';
  }

  const errors = control.errors;

  if (errors['required']) {
    return `${fieldName} is required`;
  }

  if (errors['email']) {
    return 'Please enter a valid email address';
  }

  if (errors['phone']) {
    return 'Please enter a valid phone number';
  }

  if (errors['minLength']) {
    return `Minimum length is ${errors['minLength'].min} characters`;
  }

  if (errors['maxLength']) {
    return `Maximum length is ${errors['maxLength'].max} characters`;
  }

  if (errors['min']) {
    return `Minimum value is ${errors['min'].min}`;
  }

  if (errors['max']) {
    return `Maximum value is ${errors['max'].max}`;
  }

  if (errors['pattern']) {
    return 'Invalid format';
  }

  if (errors['matchControl']) {
    return `Must match ${errors['matchControl'].controlName}`;
  }

  if (errors['uniqueEmail']) {
    return 'This email is already taken';
  }

  if (errors['pastDate']) {
    return 'Date must be in the past';
  }

  if (errors['futureDate']) {
    return 'Date must be in the future';
  }

  if (errors['requireAtLeastOne']) {
    return `At least one of the following is required: ${errors['requireAtLeastOne'].fields.join(', ')}`;
  }

  return 'Invalid input';
}

/**
 * Checks if a control is invalid and touched
 */
export function isInvalid(control: AbstractControl | null): boolean {
  return !!(control && control.invalid && control.touched);
}

/**
 * Checks if a control is valid and touched
 */
export function isValid(control: AbstractControl | null): boolean {
  return !!(control && control.valid && control.touched);
}

/**
 * Gets the value from a form control safely
 */
export function getControlValue<T = any>(
  formGroup: FormGroup,
  controlName: string,
  defaultValue?: T
): T | undefined {
  const control = formGroup.get(controlName);
  return control ? control.value : defaultValue;
}

/**
 * Sets the value of a form control
 */
export function setControlValue(
  formGroup: FormGroup,
  controlName: string,
  value: any,
  options?: { emitEvent?: boolean }
): void {
  const control = formGroup.get(controlName);
  if (control) {
    control.setValue(value, options);
  }
}

/**
 * Disables a form control
 */
export function disableControl(
  formGroup: FormGroup,
  controlName: string,
  options?: { emitEvent?: boolean }
): void {
  const control = formGroup.get(controlName);
  if (control) {
    control.disable(options);
  }
}

/**
 * Enables a form control
 */
export function enableControl(
  formGroup: FormGroup,
  controlName: string,
  options?: { emitEvent?: boolean }
): void {
  const control = formGroup.get(controlName);
  if (control) {
    control.enable(options);
  }
}
