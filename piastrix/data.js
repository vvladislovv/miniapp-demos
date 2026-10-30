/* Витрины Piastrix. Цена варианта = номинал + комиссия витрины (fee), для подписок цена фиксированная. */
const CATS = [
  { id: 'all', name: 'Все' },
  { id: 'fav', name: 'Избранное' },
  { id: 'gift', name: 'Подарочные карты' },
  { id: 'subs', name: 'Подписки' },
  { id: 'games', name: 'Игры' },
  { id: 'mobile', name: 'Связь' }
];

const SHOWCASES = [
  { id: 'piastrix', cats: ['gift'], title: 'Подарочная карта Piastrix RUB', region: 'Россия', fee: 0, def: 1, variants: [['500 ₽', 500], ['1 000 ₽', 1000], ['3 000 ₽', 3000], ['5 000 ₽', 5000]], how: 'Код пополняет любой кошелёк Piastrix на номинал карты.' },
  { id: 'apple', cats: ['gift'], title: 'Apple 2000 RUB Россия', region: 'Россия', fee: 0.04, def: 1, variants: [['1 000 ₽', 1000], ['2 000 ₽', 2000], ['3 000 ₽', 3000], ['5 000 ₽', 5000]], how: 'Введите код в App Store: профиль → «Погасить подарочную карту».' },
  { id: 'spotify', cats: ['subs'], title: 'Spotify Premium Individual 6 мес Бразилия', region: 'Бразилия', fee: 0, def: 2, variants: [['1 месяц', 289], ['3 месяца', 790], ['6 месяцев', 1490], ['12 месяцев', 2790]], how: 'Активируйте код на spotify.com/redeem в аккаунте нужного региона.' },
  { id: 'tgprem', cats: ['subs'], title: 'Telegram Premium 6 месяца RUB', region: 'Весь мир', fee: 0, def: 1, variants: [['3 месяца', 1090], ['6 месяцев', 1690], ['12 месяцев', 2890]], how: 'Отправьте ссылку-подарок на нужный аккаунт Telegram или активируйте у себя.' },
  { id: 'steam', cats: ['gift', 'games'], title: 'Steam Wallet 1000 RUB', region: 'Россия', fee: 0.05, def: 1, variants: [['500 ₽', 500], ['1 000 ₽', 1000], ['2 000 ₽', 2000], ['5 000 ₽', 5000]], how: 'Steam → «Активировать код» и введите ключ.' },
  { id: 'netflix', cats: ['subs'], title: 'Netflix Gift Card Турция', region: 'Турция', fee: 0.06, def: 0, variants: [['250 TRY', 1300], ['500 TRY', 2550], ['1 000 TRY', 5000]], how: 'Погасите карту в настройках аккаунта Netflix (регион Турция).' },
  { id: 'ps', cats: ['gift', 'games'], title: 'PlayStation Store 2000 RUB', region: 'Россия', fee: 0.05, def: 1, variants: [['1 000 ₽', 1000], ['2 000 ₽', 2000], ['4 000 ₽', 4000]], how: 'PS Store → «Погасить коды».' },
  { id: 'xbox', cats: ['subs', 'games'], title: 'Xbox Game Pass Ultimate 3 мес', region: 'Весь мир', fee: 0, def: 0, variants: [['1 месяц', 1190], ['3 месяца', 2990], ['6 месяцев', 5490]], how: 'Введите код на redeem.microsoft.com.' },
  { id: 'gplay', cats: ['gift'], title: 'Google Play 1000 RUB', region: 'Россия', fee: 0.04, def: 0, variants: [['500 ₽', 500], ['1 000 ₽', 1000], ['3 000 ₽', 3000]], how: 'Play Маркет → «Активировать промокод».' },
  { id: 'roblox', cats: ['games'], title: 'Roblox 800 Robux', region: 'Весь мир', fee: 0, def: 0, variants: [['800 Robux', 899], ['1 700 Robux', 1790], ['4 500 Robux', 4490]], how: 'Введите PIN на roblox.com/redeem.' },
  { id: 'discord', cats: ['subs'], title: 'Discord Nitro 1 месяц', region: 'Весь мир', fee: 0, def: 0, variants: [['1 месяц', 790], ['12 месяцев', 7490]], how: 'Погасите ссылку-подарок в настройках Discord.' },
  { id: 'mobile', cats: ['mobile'], title: 'Пополнение мобильной связи', region: 'Россия', fee: 0.02, def: 1, needsPhone: true, variants: [['300 ₽', 300], ['500 ₽', 500], ['1 000 ₽', 1000]], how: 'Деньги поступят на номер сразу после оплаты.' }
];

const WALLET_ID = '201586111271';
const START_BALANCE = 15000;
const TRANSFER_FEE = 0.01;
const TOPUP_METHODS = [
  { id: 'card', name: 'Банковская карта', fee: 0.025 },
  { id: 'sbp', name: 'СБП', fee: 0.01 },
  { id: 'usdt', name: 'USDT (TRC20)', fee: 0.015 }
];
