import { fetchCandles, getCandles } from './marketData.js';
import { calculateIndicators } from './indicators.js';
import { scalpingStrategy } from './strategy.js';
import { openPosition, checkExit } from './executor.js';
import { getLastPrice, isWsConnected, startPriceSocket } from './wsPrice.js';
import { calculatePositionSize, canTrade } from './risk.js';
import { exchange } from '../config/exchange.js';
import { ENV } from '../config/env.js';
import { state } from './state.js';

export async function startBot() {
  console.log('🤖 Bot iniciado (modo estable)');
  state.running = true;
  startPriceSocket();

  setInterval(async () => {
    if (!isWsConnected()) return;

    const price = getLastPrice();
    if (!price) return;

    if (state.inPosition) {
      await checkExit(price);
      return;
    }

    await fetchCandles();
    const indicators = calculateIndicators(getCandles());
    const signal = scalpingStrategy(indicators, price);

    if (!signal || !canTrade(state)) return;

    const balance = await exchange.fetchBalance();
    const usdt = balance.free.USDT;

    const amount = calculatePositionSize({
      balance: usdt,
      price,
      riskPercent: ENV.risk,
      slPercent: ENV.sl,
    });

    if (!amount) return;

    await openPosition(price, amount);
  }, 10_000);
}
