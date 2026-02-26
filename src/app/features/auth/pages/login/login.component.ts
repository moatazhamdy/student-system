import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { AuthStore } from '../../../../core/store/auth.store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    MessageModule,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  loginForm: FormGroup;
  isSubmitting = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    // If already authenticated, redirect to dashboard
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    this.authStore.clearError();

    try {
      await this.authStore.login(this.loginForm.value);
      // Navigation handled by store
    } catch (error) {
      // Error handled by store
    } finally {
      this.isSubmitting.set(false);
    }
  }

  get usernameError() {
    const control = this.loginForm.get('username');
    if (control?.hasError('required') && control.touched) {
      return 'Username is required';
    }
    if (control?.hasError('minlength') && control.touched) {
      return 'Username must be at least 3 characters';
    }
    return null;
  }

  get passwordError() {
    const control = this.loginForm.get('password');
    if (control?.hasError('required') && control.touched) {
      return 'Password is required';
    }
    if (control?.hasError('minlength') && control.touched) {
      return 'Password must be at least 3 characters';
    }
    return null;
  }
}
