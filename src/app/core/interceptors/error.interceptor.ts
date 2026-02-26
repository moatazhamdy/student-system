import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        logger.error('Client-side error occurred', error.error);
      } else {
        // Server-side error
        errorMessage = error.error?.message || error.error?.error || `Server Error: ${error.status} - ${error.statusText}`;
        logger.error('Server-side error occurred', {
          status: error.status,
          message: error.message,
          url: error.url,
          error: error.error,
        });

        // Handle authentication errors
        if (error.status === 401) {
          logger.warn('Unauthorized request - redirecting to login');
          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Redirect to login
          router.navigate(['/login']);
        }

        // Handle authorization errors
        if (error.status === 403) {
          logger.warn('Forbidden - insufficient permissions');
          errorMessage = 'You do not have permission to perform this action';
        }
      }

      // You can add toast notification here in the future
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });

      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        originalError: error,
      }));
    })
  );
};
