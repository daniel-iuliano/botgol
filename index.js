import express from 'express';
import { startBot } from './core/bot.js';

const app = express();
let running = false;

app.post('/start', (_, res) => {
  if (!running) {
    startBot();
    running = true;
  }
  res.json({ running });
});

app.get('/status', (_, res) => {
  res.json({ running });
});

app.listen(3000, () =>
  console.log('🌐 API en http://localhost:3000')
);