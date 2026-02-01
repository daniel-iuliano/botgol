import 'dotenv/config';

export const ENV = {
  apiKey: process.env.COINEX_API_KEY,
  secret: process.env.COINEX_SECRET,
  symbol: process.env.SYMBOL,
  timeframe: process.env.TIMEFRAME,
  risk: Number(process.env.RISK_PERCENT),
  tp: Number(process.env.TP_PERCENT),
  sl: Number(process.env.SL_PERCENT),
};