import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { getErrorMessage } from '@shared/utils';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, TranslateModule],
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
      <input
        pInputText
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [formControl]="control"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class.ng-invalid]="showError"
        [class.ng-dirty]="control.touched"
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

      input {
        width: 100%;
      }

      input.ng-invalid.ng-dirty {
        border-color: var(--red-500);
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
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() id: string = `input-${Math.random().toString(36).substring(7)}`;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() disabled: boolean = false;

  control = new FormControl('');
  onChange: any = () => {};
  onTouched: any = () => {};

  get showError(): boolean {
    return !!(this.control.invalid && this.control.touched);
  }

  get errorMessage(): string {
    return getErrorMessage(this.control, this.label);
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
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

  onInput(event: any): void {
    const value = event.target.value;
    this.onChange(value);
  }
}
