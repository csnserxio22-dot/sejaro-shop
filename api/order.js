import { PRODUCT_MAP } from '../lib/products.js';
import { tg, verifyInitData, esc } from '../lib/telegram.js';

const fmt = (n) => n.toLocaleString('ru-RU');

// Принимает заказ из Mini App, проверяет подлинность и отправляет заявку менеджеру.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const botToken = process.env.BOT_TOKEN;
  const managerChatId = process.env.MANAGER_CHAT_ID;
  if (!botToken || !managerChatId) {
    console.error('Missing BOT_TOKEN or MANAGER_CHAT_ID');
    res.status(500).json({ ok: false, error: 'server_not_configured' });
    return;
  }

  const body = req.body || {};
  const { initData, items, customer } = body;

  // 1. Подлинность: заказ должен прийти из настоящего Telegram WebApp.
  const user = verifyInitData(initData, botToken);
  if (!user) {
    res.status(401).json({ ok: false, error: 'invalid_init_data' });
    return;
  }

  // 2. Корзина: сверяем товары и считаем сумму на сервере (клиенту не доверяем).
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ ok: false, error: 'empty_cart' });
    return;
  }
  const lines = [];
  let total = 0;
  for (const it of items) {
    const p = PRODUCT_MAP[it?.id];
    const qty = Math.trunc(Number(it?.qty));
    if (!p || !Number.isFinite(qty) || qty < 1 || qty > 100) {
      res.status(400).json({ ok: false, error: 'invalid_item' });
      return;
    }
    const sum = p.price * qty;
    total += sum;
    lines.push(`• ${esc(p.name)} × ${qty} — ${fmt(sum)} ₸`);
  }

  // 3. Данные клиента.
  const fio = String(customer?.fio || '').trim();
  const phone = String(customer?.phone || '').trim();
  const city = String(customer?.city || '').trim();
  const cdek = String(customer?.cdek || '').trim();
  if (!fio || !phone || !city || !cdek) {
    res.status(400).json({ ok: false, error: 'missing_fields' });
    return;
  }
  if (fio.length > 120 || phone.length > 40 || city.length > 80 || cdek.length > 200) {
    res.status(400).json({ ok: false, error: 'fields_too_long' });
    return;
  }

  // 4. Формируем заявку менеджеру.
  const uname = user.username ? `@${user.username}` : '—';
  const text =
    `🛒 <b>Новый заказ Sejaro</b>\n\n` +
    `📦 <b>Состав:</b>\n${lines.join('\n')}\n` +
    `💰 <b>Итого: ${fmt(total)} ₸</b>\n\n` +
    `👤 <b>Клиент:</b>\n` +
    `ФИО: ${esc(fio)}\n` +
    `Телефон: ${esc(phone)}\n` +
    `Страна, город: ${esc(city)}\n` +
    `Пункт выдачи СДЭК: ${esc(cdek)}\n\n` +
    `Telegram: ${esc(uname)} (id ${user.id})`;

  const result = await tg('sendMessage', {
    chat_id: managerChatId,
    text,
    parse_mode: 'HTML',
  });

  if (!result.ok) {
    console.error('sendMessage failed', result);
    res.status(502).json({ ok: false, error: 'notify_failed' });
    return;
  }

  res.status(200).json({ ok: true });
}
