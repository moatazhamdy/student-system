import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { UserRole } from '../models/auth.model';

/**
 * Role Guard Factory
 *
 * Creates a guard that restricts routes based on user roles.
 * Usage: canActivate: [roleGuard([UserRole.Admin])]
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const user = authStore.user();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Redirect to dashboard or show error
    router.navigate(['/dashboard']);
    return false;
  };
};
