import fetch from 'node-fetch';

const TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

export async function notify(msg) {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg
      })
    });
  } catch (e) {
    console.error('Telegram error', e.message);
  }
}