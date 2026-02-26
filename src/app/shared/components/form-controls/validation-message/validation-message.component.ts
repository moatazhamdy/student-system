import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { getErrorMessage } from '@shared/utils';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    @if (shouldShowError) {
      <small class="validation-error">
        {{ errorMessage }}
      </small>
    }
  `,
  styles: [
    `
      .validation-error {
        display: block;
        color: var(--red-500);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationMessageComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = 'This field';

  get shouldShowError(): boolean {
    return !!(this.control && this.control.invalid && this.control.touched);
  }

  get errorMessage(): string {
    return getErrorMessage(this.control, this.fieldName);
  }
}
