export function scalpingStrategy(ind, price) {
  if (!ind.rsi || !ind.macd) return null;

  const rsiRebound = ind.rsi > 30 && ind.rsi < 40;
  const macdConfirm = ind.macd.histogram > 0;
  const trendUp = ind.ema9 > ind.ema21;
  const volumeOk = ind.lastVolume > ind.avgVolume * 1.2;

  if (rsiRebound && macdConfirm && trendUp && volumeOk) {
    return { side: 'buy' };
  }

  return null;
}