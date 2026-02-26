export interface Environment {
  production: boolean;
  environmentName: 'development' | 'test' | 'staging' | 'production';
  apiUrl: string;
  apiVersion: string;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  features: {
    enableCharts: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
  };
  defaultLanguage: 'en' | 'ar';
  supportedLanguages: string[];
}
