export function updateTrailingStop({
  side,
  entryPrice,
  currentPrice,
  stopLoss,
  trailingPercent = 0.4 // scalping agresivo
}) {
  if (side !== 'LONG') return stopLoss;

  const profit = (currentPrice - entryPrice) / entryPrice * 100;
  if (profit <= trailingPercent) return stopLoss;

  const newStop = currentPrice * (1 - trailingPercent / 100);
  return Math.max(stopLoss, newStop);
}