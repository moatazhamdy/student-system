import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  // Login route (no auth required)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },

  // Protected routes (require authentication)
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'students',
        loadChildren: () => import('./features/students/students.routes').then((m) => m.STUDENTS_ROUTES),
      },
      {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.routes').then((m) => m.COURSES_ROUTES),
      },
      {
        path: 'instructors',
        loadChildren: () => import('./features/instructors/instructors.routes').then((m) => m.INSTRUCTORS_ROUTES),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
