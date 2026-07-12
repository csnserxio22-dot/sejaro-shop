# Sejaro Shop — Telegram Mini App

Магазин Sejaro в виде Telegram Mini App на Vercel. Клиент открывает магазин из бота,
собирает корзину, заполняет форму (ФИО, телефон, город, отделение СДЭК) — заявка
уходит менеджеру в Telegram. Оплату согласует менеджер.

## Архитектура

```
Telegram-бот  ──/start──▶  api/webhook.js  ──▶  кнопка «Открыть магазин» (Mini App)
                                                        │
                                              index.html (каталог + корзина + форма)
                                                        │  POST /api/order (+ initData)
                                                        ▼
                                              api/order.js — проверяет подпись,
                                              считает сумму, шлёт заявку менеджеру
```

- **Без базы данных** — корзина живёт в самом Mini App.
- **Без платных сервисов** — только Vercel free tier + Telegram Bot API.
- **Безопасность** — `api/order.js` проверяет подпись `initData` (HMAC c токеном бота),
  сумму пересчитывает на сервере, данные клиента не берёт на веру.

## Файлы

| Файл | Назначение |
|---|---|
| `index.html` | Mini App: каталог, корзина, форма заказа |
| `api/webhook.js` | Вебхук бота: `/start` → кнопка открытия магазина |
| `api/order.js` | Приём заказа, проверка подписи, отправка менеджеру |
| `api/products.js` | Отдаёт каталог фронтенду |
| `lib/products.js` | Единый источник каталога (цены в ₸) |
| `lib/telegram.js` | Bot API, проверка initData, экранирование |

## Переменные окружения (Vercel → Settings → Environment Variables)

| Переменная | Значение |
|---|---|
| `BOT_TOKEN` | токен от @BotFather |
| `MANAGER_CHAT_ID` | куда слать заявки (сейчас `974477663`) |
| `WEBAPP_URL` | домен проекта со слэшем, напр. `https://sejaro-shop.vercel.app/` |

## Деплой

1. Залить проект в новый GitHub-репозиторий `sejaro-shop`.
2. В Vercel → **Add New → Project** → импортировать репозиторий.
   Framework Preset: **Other** (статика + serverless-функции, сборка не нужна).
3. Добавить переменные `BOT_TOKEN`, `MANAGER_CHAT_ID`, `WEBAPP_URL` и задеплоить.
   (`WEBAPP_URL` узнаешь после первого деплоя — впиши домен и передеплой.)

## Подключение бота (один раз, после деплоя)

Замени `<TOKEN>` и `<DOMAIN>` и выполни:

```bash
# 1. Указать Telegram, куда слать апдейты
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<DOMAIN>/api/webhook"

# 2. (опционально) Сделать кнопку меню бота открытием магазина
curl -X POST "https://api.telegram.org/bot<TOKEN>/setChatMenuButton" \
  -H "content-type: application/json" \
  -d '{"menu_button":{"type":"web_app","text":"Магазин","web_app":{"url":"https://<DOMAIN>/"}}}'
```

Проверка вебхука: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`

## Как добавить фото товаров (опционально)

Сейчас в карточках — плитки с дозировкой. Чтобы показать реальные фото:
положи картинки и подставь `image` в `lib/products.js`, а в `index.html` в `.thumb`
рендерь `<img>`. (Могу доделать по запросу.)

## Тест

1. Открой бота → `/start` → «Открыть магазин».
2. Собери корзину → «Оформить» → заполни форму → «Отправить заказ».
3. Заявка приходит в чат `MANAGER_CHAT_ID`.
