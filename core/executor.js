import { exchange } from '../config/exchange.js';
import { ENV } from '../config/env.js';
import { state } from './state.js';

export async function openPosition(price, amount) {
  console.log(`🟢 BUY ${amount} @ ${price}`);

  await exchange.createMarketBuyOrder(ENV.symbol, amount);

  state.inPosition = true;
  state.position = {
    side: 'long',
    entry: price,
    amount,
    tp: price * (1 + ENV.tp),
    sl: price * (1 - ENV.sl),
  };

  state.lastTradeTime = Date.now();
}

export async function checkExit(price) {
  if (!state.inPosition) return;

  const { tp, sl, amount } = state.position;

  if (price >= tp || price <= sl) {
    console.log('🔴 EXIT', price);

    await exchange.createMarketSellOrder(ENV.symbol, amount);

    state.inPosition = false;
    state.position = null;
  }
}