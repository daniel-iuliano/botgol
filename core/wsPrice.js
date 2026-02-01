import WebSocket from 'ws';
import { ENV } from '../config/env.js';

let ws = null;
let lastPrice = null;
let connected = false;
let reconnectTimer = null;

const WS_URL = 'wss://socket.coinex.com/';

export function startPriceSocket(onStatusChange) {
  const symbol = ENV.symbol.replace('/', '').toLowerCase();

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.on('open', () => {
      connected = true;
      console.log('📡 WebSocket CoinEx conectado');

      if (onStatusChange) {
        onStatusChange({ websocket: true, error: null });
      }

      ws.send(JSON.stringify({
        method: 'state.subscribe',
        params: [symbol],
        id: 1
      }));
    });

    ws.on('message', msg => {
      try {
        const data = JSON.parse(msg);
        if (data.method === 'state.update') {
          lastPrice = Number(data.params[0].last);
        }
      } catch (e) {
        console.error('WS parse error:', e.message);
      }
    });

    ws.on('close', () => {
      if (connected) {
        console.error('⚠️ WebSocket CoinEx desconectado');
      }

      connected = false;

      if (onStatusChange) {
        onStatusChange({ websocket: false, error: 'WS disconnected' });
      }

      scheduleReconnect();
    });

    ws.on('error', err => {
      console.error('❌ WebSocket error:', err.message);
      connected = false;

      if (onStatusChange) {
        onStatusChange({ websocket: false, error: err.message });
      }

      ws.close();
    });
  }

  function scheduleReconnect() {
    if (reconnectTimer) return;

    reconnectTimer = setTimeout(() => {
      console.log('🔁 Reintentando conexión WebSocket...');
      reconnectTimer = null;
      connect();
    }, 5000);
  }

  connect();
}

export function getLastPrice() {
  return lastPrice;
}

export function isWsConnected() {
  return connected;
}

export function stopPriceSocket() {
  if (ws) {
    ws.close();
    ws = null;
    connected = false;
    console.log('🛑 WebSocket detenido');
  }
}
import { enqueue } from './pairQueue.js';

ws.on('price', (pair, price) => {
  enqueue(pair, async () => {
    await processPrice(pair, price);
  });
});