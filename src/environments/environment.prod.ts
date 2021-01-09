import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,
  production: true,
  serviceWorker: false,

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://pwa-ish-demo.test.intershop.com',
  //icmBaseURL: 'https://f9f772aed48d.ngrok.io'
};
