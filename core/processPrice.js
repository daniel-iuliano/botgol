import { strategy } from '../strategy/scalping.js';
import { updateTrailingStop } from './trailingStop.js';
import { saveTrade } from '../storage/tradesStore.js';
import { notify } from '../notifications/telegram.js';

// Estado en memoria por par
const trades = {}; // { BTCUSDT: { ...trade } }

/**
 * Procesa cada precio (LIVE o BACKTEST)
 */
export async function processPrice(pair, price, timestamp = Date.now()) {
  let trade = trades[pair];

  // =========================
  // 1️⃣ SI HAY TRADE ABIERTO
  // =========================
  if (trade) {
    // 🔁 actualizar trailing stop
    trade.stopLoss = updateTrailingStop({
      side: trade.side,
      entryPrice: trade.entryPrice,
      currentPrice: price,
      stopLoss: trade.stopLoss
    });

    // 🛑 STOP LOSS
    if (price <= trade.stopLoss) {
      closeTrade(pair, price, 'STOP_LOSS');
      return;
    }

    // 🎯 TAKE PROFIT (si usás TP fijo)
    if (trade.takeProfit && price >= trade.takeProfit) {
      closeTrade(pair, price, 'TAKE_PROFIT');
      return;
    }

    // nada más que hacer
    return;
  }

  // =========================
  // 2️⃣ NO HAY TRADE → BUSCAR ENTRADA
  // =========================
  const signal = strategy({
    pair,
    price,
    timestamp
  });

  if (!signal || signal.action !== 'BUY') return;

  // =========================
  // 3️⃣ ABRIR TRADE
  // =========================
  const entryPrice = price;
  const stopLoss = entryPrice * 0.997; // -0.3%
  const takeProfit = entryPrice * 1.004; // +0.4% (opcional)

  trades[pair] = {
    pair,
    side: 'LONG',
    entryPrice,
    stopLoss,
    takeProfit,
    openedAt: timestamp
  };

  console.log(`🟢 [${pair}] LONG @ ${entryPrice}`);
  notify?.(`🟢 LONG ${pair}\nEntry: ${entryPrice}`);

}


function closeTrade(pair, exitPrice, reason) {
  const trade = trades[pair];
  if (!trade) return;

  const pnl =
    ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;

  const closedTrade = {
    pair,
    entryPrice: trade.entryPrice,
    exitPrice,
    pnl,
    reason,
    openedAt: trade.openedAt,
    closedAt: Date.now()
  };

  saveTrade(closedTrade);

  console.log(
    `🔴 [${pair}] EXIT ${reason} | PnL: ${pnl.toFixed(2)}%`
  );

  notify?.(
    `🔴 EXIT ${pair}\nReason: ${reason}\nPnL: ${pnl.toFixed(2)}%`
  );

  delete trades[pair];
}