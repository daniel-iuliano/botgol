import { RSI, MACD, EMA } from 'technicalindicators';

export function calculateIndicators(candles) {
  const closes = candles.map(c => c[4]);
  const volumes = candles.map(c => c[5]);

  const rsi = RSI.calculate({ period: 14, values: closes }).at(-1);
  const macd = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
  }).at(-1);

  const ema9 = EMA.calculate({ period: 9, values: closes }).at(-1);
  const ema21 = EMA.calculate({ period: 21, values: closes }).at(-1);

  const avgVolume =
    volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;

  return { rsi, macd, ema9, ema21, avgVolume, lastVolume: volumes.at(-1) };
}