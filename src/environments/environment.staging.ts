import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  environmentName: 'staging',
  apiUrl: 'https://staging-api.student-system.com/api',
  apiVersion: 'v1',
  enableLogging: true,
  logLevel: 'warn',
  features: {
    enableCharts: true,
    enableNotifications: true,
    enableAnalytics: true,
  },
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
};
