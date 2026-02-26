import { Directive, OnDestroy, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  markFormGroupTouched,
  getFormValidationErrors,
  resetForm,
} from '@shared/utils';

/**
 * Base class for all form components
 * Provides common form handling logic
 */
@Directive()
export abstract class BaseFormComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  abstract form: FormGroup;

  isSubmitting = signal(false);
  formErrors = signal<any>({});

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Validates the form and returns true if valid
   */
  protected validateForm(): boolean {
    if (this.form.valid) {
      return true;
    }

    markFormGroupTouched(this.form);
    const errors = getFormValidationErrors(this.form);
    this.formErrors.set(errors);

    return false;
  }

  /**
   * Resets the form to initial state
   */
  protected resetFormState(value?: any): void {
    resetForm(this.form, value);
    this.formErrors.set({});
    this.isSubmitting.set(false);
  }

  /**
   * Gets form values with only dirty fields
   */
  protected getDirtyValues(): any {
    const dirtyValues: any = {};

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });

    return dirtyValues;
  }

  /**
   * Gets all form values
   */
  protected getFormValues(): any {
    return this.form.getRawValue();
  }

  /**
   * Sets form values
   */
  protected setFormValues(values: any, options?: { emitEvent?: boolean }): void {
    this.form.patchValue(values, options);
  }

  /**
   * Checks if a specific field has an error
   */
  protected hasFieldError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  /**
   * Gets error message for a specific field
   */
  protected getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    const errorKey = Object.keys(errors)[0];
    return errors[errorKey];
  }

  /**
   * Mark form as submitted
   */
  protected markAsSubmitting(): void {
    this.isSubmitting.set(true);
  }

  /**
   * Mark form as not submitting
   */
  protected markAsNotSubmitting(): void {
    this.isSubmitting.set(false);
  }
}
