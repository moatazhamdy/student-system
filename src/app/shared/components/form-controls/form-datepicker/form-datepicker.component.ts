import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { getErrorMessage } from '@shared/utils';

@Component({
  selector: 'app-form-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, TranslateModule],
  template: `
    <div class="form-field">
      @if (label) {
        <label [for]="id" class="form-label">
          {{ label }}
          @if (required) {
            <span class="required-mark">*</span>
          }
        </label>
      }
      <p-calendar
        [inputId]="id"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [formControl]="control"
        [showIcon]="showIcon"
        [dateFormat]="dateFormat"
        [showButtonBar]="true"
        [minDate]="minDate"
        [maxDate]="maxDate"
        (onSelect)="onDateChange($event)"
        (onBlur)="onTouched()"
        [styleClass]="showError ? 'ng-invalid ng-dirty' : ''"
      />
      @if (showError) {
        <small class="form-error">
          {{ errorMessage }}
        </small>
      }
      @if (hint && !showError) {
        <small class="form-hint">{{ hint }}</small>
      }
    </div>
  `,
  styles: [
    `
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .form-label {
        font-weight: 500;
        color: var(--text-color);
        font-size: 0.875rem;
      }

      .required-mark {
        color: var(--red-500);
        margin-left: 0.25rem;
      }

      ::ng-deep p-calendar {
        width: 100%;

        .p-calendar {
          width: 100%;
        }

        .p-inputtext.ng-invalid.ng-dirty {
          border-color: var(--red-500);
        }
      }

      .form-error {
        color: var(--red-500);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .form-hint {
        color: var(--text-color-secondary);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDatepickerComponent implements ControlValueAccessor {
  @Input() id: string = `datepicker-${Math.random().toString(36).substring(7)}`;
  @Input() label: string = '';
  @Input() placeholder: string = 'Select a date';
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() disabled: boolean = false;
  @Input() showIcon: boolean = true;
  @Input() dateFormat: string = 'mm/dd/yy';
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;

  control = new FormControl<Date | null>(null);
  onChange: any = () => {};
  onTouched: any = () => {};

  get showError(): boolean {
    return !!(this.control.invalid && this.control.touched);
  }

  get errorMessage(): string {
    return getErrorMessage(this.control, this.label);
  }

  writeValue(value: any): void {
    this.control.setValue(value ? new Date(value) : null, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onDateChange(event: any): void {
    this.onChange(event);
  }
}
