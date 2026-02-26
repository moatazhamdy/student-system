import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  environmentName: 'development',
  apiUrl: 'http://localhost:3001/api',
  apiVersion: 'v1',
  enableLogging: true,
  logLevel: 'debug',
  features: {
    enableCharts: true,
    enableNotifications: true,
    enableAnalytics: false,
  },
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
};
