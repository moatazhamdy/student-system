import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Custom validators for form controls
 */
export class CustomValidators {
  /**
   * Validates email format
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);

      return valid ? null : { email: true };
    };
  }

  /**
   * Validates phone number format
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Supports formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      const valid = phoneRegex.test(control.value.replace(/\s/g, ''));

      return valid ? null : { phone: true };
    };
  }

  /**
   * Validates minimum value
   */
  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);
      return value >= min ? null : { min: { min, actual: value } };
    };
  }

  /**
   * Validates maximum value
   */
  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);
      return value <= max ? null : { max: { max, actual: value } };
    };
  }

  /**
   * Validates minimum length
   */
  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const length = control.value.length;
      return length >= min ? null : { minLength: { min, actual: length } };
    };
  }

  /**
   * Validates maximum length
   */
  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const length = control.value.length;
      return length <= max ? null : { maxLength: { max, actual: length } };
    };
  }

  /**
   * Validates pattern
   */
  static pattern(pattern: string | RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      const valid = regex.test(control.value);

      return valid ? null : { pattern: { pattern, actual: control.value } };
    };
  }

  /**
   * Validates that control value matches another control
   */
  static matchControl(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.parent) {
        return null;
      }

      const matchControl = control.parent.get(controlName);
      if (!matchControl) {
        return null;
      }

      return control.value === matchControl.value
        ? null
        : { matchControl: { controlName } };
    };
  }

  /**
   * Async validator to check if email is unique
   * In real app, this would make an API call
   */
  static uniqueEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simulate API call with delay
      return timer(500).pipe(
        switchMap(() => {
          // Mock: consider emails ending with 'test.com' as already taken
          const isTaken = control.value.endsWith('test.com');
          return of(isTaken ? { uniqueEmail: true } : null);
        })
      );
    };
  }

  /**
   * Validates date is in the past
   */
  static pastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return date < now ? null : { pastDate: true };
    };
  }

  /**
   * Validates date is in the future
   */
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return date > now ? null : { futureDate: true };
    };
  }

  /**
   * Validates that at least one field in a group is filled
   */
  static requireAtLeastOne(fieldNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as any;
      const hasAtLeastOne = fieldNames.some(
        (fieldName) => group.get(fieldName)?.value
      );

      return hasAtLeastOne ? null : { requireAtLeastOne: { fields: fieldNames } };
    };
  }
}
