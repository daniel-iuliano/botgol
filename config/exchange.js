import ccxt from 'ccxt';
import { ENV } from './env.js';

export const exchange = new ccxt.coinex({
  apiKey: ENV.apiKey,
  secret: ENV.secret,
  enableRateLimit: true,
});