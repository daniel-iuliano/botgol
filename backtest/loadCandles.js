import fs from 'fs';
import path from 'path';

/**
 * Carga velas desde un CSV
 * Formato esperado:
 * timestamp,open,high,low,close,volume
 */
export function loadCandles(pair, timeframe) {
  const filePath = path.resolve(
    `./backtest/data/${pair}_${timeframe}.csv`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe el archivo ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  return raw
    .split('\n')
    .slice(1) // saltear header
    .map(line => {
      const [
        timestamp,
        open,
        high,
        low,
        close,
        volume
      ] = line.split(',');

      if (!timestamp) return null;

      return {
        timestamp: Number(timestamp),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume)
      };
    })
    .filter(Boolean);
}