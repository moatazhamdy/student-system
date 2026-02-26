import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  environmentName: 'test',
  apiUrl: 'https://test-api.student-system.com/api',
  apiVersion: 'v1',
  enableLogging: true,
  logLevel: 'info',
  features: {
    enableCharts: true,
    enableNotifications: true,
    enableAnalytics: false,
  },
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
};
