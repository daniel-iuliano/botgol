import { exchange } from '../config/exchange.js';
import { health } from '../core/health.js';


export async function checkExchangeConnection() {
try {
await exchange.fetchTime();
health.exchange = true;
health.lastError = null;
console.log('✅ CoinEx REST conectado');
} catch (e) {
health.exchange = false;
health.lastError = e.message;
console.error('❌ CoinEx REST ERROR:', e.message);
}
}