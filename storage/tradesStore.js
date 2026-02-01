import fs from 'fs';

const FILE = './data/trades.json';

export function loadTrades() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

export function saveTrade(trade) {
  const trades = loadTrades();
  trades.push(trade);
  fs.writeFileSync(FILE, JSON.stringify(trades, null, 2));
}
