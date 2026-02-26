import { inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest, User, UserRole } from '../models/auth.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AUTH_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

/**
 * NgRx Signal Store for Authentication
 *
 * Features:
 * - JWT token management with localStorage persistence
 * - User session management
 * - Role-based authorization helpers
 * - Auto-restore session on init
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  // Computed selectors
  withComputed((store) => ({
    // Check if user is admin
    isAdmin: computed(() => store.user()?.role === UserRole.Admin),

    // Check if user is supervisor
    isSupervisor: computed(() => store.user()?.role === UserRole.Supervisor),

    // Get full name
    userFullName: computed(() => {
      const user = store.user();
      if (!user) return '';
      return `${user.firstName} ${user.lastName}`;
    }),

    // Permission checks
    canCreate: computed(() => store.user()?.role === UserRole.Admin),
    canEdit: computed(() => store.user()?.role === UserRole.Admin),
    canDelete: computed(() => store.user()?.role === UserRole.Admin),
  })),

  // Methods (actions)
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    /**
     * Login user with credentials
     */
    async login(credentials: LoginRequest) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(authService.login(credentials));
        const { token, user } = response;

        // Save to localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        patchState(store, {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Navigate to dashboard
        router.navigate(['/dashboard']);
      } catch (error: any) {
        patchState(store, {
          error: error.error?.error || 'Login failed',
          isLoading: false,
        });
        throw error;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      patchState(store, { isLoading: true, error: null });

      try {
        // Call logout API (optional, mainly for server-side token blacklisting)
        await firstValueFrom(authService.logout());
      } catch (error) {
        // Continue with local logout even if API call fails
      }

      // Clear localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      // Reset state
      patchState(store, {
        ...initialState,
      });

      // Navigate to login
      router.navigate(['/login']);
    },

    /**
     * Restore session from localStorage
     */
    restoreSession() {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      const userJson = localStorage.getItem(USER_STORAGE_KEY);

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          patchState(store, {
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    },

    /**
     * Clear error
     */
    clearError() {
      patchState(store, { error: null });
    },
  })),

  // Lifecycle hooks
  withHooks({
    /**
     * Auto-restore session on init
     */
    onInit(store) {
      store.restoreSession();
    },

    /**
     * Cleanup on destroy
     */
    onDestroy() {
      // Cleanup logic if needed
    },
  }),
);
