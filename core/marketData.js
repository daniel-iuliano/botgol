import { exchange } from '../config/exchange.js';
import { ENV } from '../config/env.js';

let candles = [];

export async function fetchCandles(limit = 100) {
  candles = await exchange.fetchOHLCV(
    ENV.symbol,
    ENV.timeframe,
    undefined,
    limit
  );
  return candles;
}

export function getCandles() {
  return candles;
}