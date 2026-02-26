import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  environmentName: 'production',
  apiUrl: 'https://api.student-system.com/api',
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
