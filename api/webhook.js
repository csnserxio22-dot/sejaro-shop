import { tg } from '../lib/telegram.js';

// Вебхук Telegram: обрабатывает /start и показывает кнопку открытия магазина (Mini App).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).send('ok');
    return;
  }

  try {
    const update = req.body || {};
    const msg = update.message;

    if (msg && typeof msg.text === 'string' && msg.text.startsWith('/start')) {
      const webAppUrl = process.env.WEBAPP_URL;
      await tg('sendMessage', {
        chat_id: msg.chat.id,
        text:
          '🏪 Добро пожаловать в магазин Sejaro!\n\n' +
          'Нажмите кнопку ниже, чтобы открыть каталог, собрать заказ и оформить доставку. ' +
          'После оформления с вами свяжется менеджер для подтверждения и оплаты.',
        reply_markup: {
          inline_keyboard: [[{ text: '🛒 Открыть магазин', web_app: { url: webAppUrl } }]],
        },
      });
    }
  } catch (e) {
    // Логируем, но всегда отвечаем 200 — иначе Telegram будет ретраить апдейт.
    console.error('webhook error', e);
  }

  res.status(200).json({ ok: true });
}
