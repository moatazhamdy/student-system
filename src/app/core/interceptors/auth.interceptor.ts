import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_STORAGE_KEY = 'auth_token';

/**
 * Auth Interceptor
 *
 * Automatically attaches JWT token to all HTTP requests except login/logout
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip auth header for login and logout endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/logout')) {
    return next(req);
  }

  // Get token from localStorage
  const token = localStorage.getItem(AUTH_STORAGE_KEY);

  // If token exists, clone request and add Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  // If no token, proceed with original request
  return next(req);
};
