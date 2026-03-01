import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  environmentName: 'production',
  // Replace with your Render backend URL after deployment
  // Example: 'https://student-system-api.onrender.com/api'
  apiUrl: 'https://student-system-api.onrender.com/api',
  apiVersion: 'v1',
  enableLogging: false,
  logLevel: 'error',
  features: {
    enableCharts: true,
    enableNotifications: true,
    enableAnalytics: true,
  },
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
};
