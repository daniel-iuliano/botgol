import { loadCandles } from './loadCandles.js';
import { processPrice } from '../core/processPrice.js';

async function runBacktest() {
  const pair = 'BTCUSDT';
  const timeframe = '1m';

  const candles = loadCandles(pair, timeframe);

  console.log(`📊 Backtest ${pair} (${timeframe})`);
  console.log(`Velas: ${candles.length}`);

  for (const candle of candles) {
    await processPrice(
      pair,
      candle.close,
      candle.timestamp
    );
  }

  console.log('✅ Backtest terminado');
}

runBacktest();