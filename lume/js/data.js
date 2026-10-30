/* Lume: витрины и константы. Цена варианта = номинал + комиссия витрины (fee). */
window.Lume = window.Lume || {};
Lume.data = (() => {
  const CATS = [
    ['all', 'Все'], ['fav', 'Избранное'], ['gift', 'Карты'], ['subs', 'Подписки'], ['games', 'Игры'], ['mobile', 'Связь']
  ];
  // size: hero (2x2) | wide (2x1); c — пара цветов тонировки; mark — ключ стилизованной марки
  const SHOWCASES = [
    { id: 'steam', mark: 'steam', cats: ['gift', 'games'], title: 'Steam Wallet', region: 'Россия', fee: 0.05, def: 1, size: 'hero', c: ['#1b3a63', '#3a78c4'], variants: [['500 ₽', 500], ['1 000 ₽', 1000], ['2 000 ₽', 2000], ['5 000 ₽', 5000]], how: 'Steam: «Активировать код» и введите ключ.' },
    { id: 'lume', mark: 'lume', cats: ['gift'], title: 'Lume Gift Card', region: 'Россия', fee: 0, def: 1, size: 'wide', c: ['#5b3df5', '#9b7bff'], variants: [['500 ₽', 500], ['1 000 ₽', 1000], ['3 000 ₽', 3000], ['5 000 ₽', 5000]], how: 'Код пополняет любой кошелёк Lume на номинал карты.' },
    { id: 'spotify', mark: 'spotify', cats: ['subs'], title: 'Spotify Premium', region: 'Бразилия', fee: 0, def: 2, c: ['#14a85c', '#0b7a43'], variants: [['1 месяц', 289], ['3 месяца', 790], ['6 месяцев', 1490], ['12 месяцев', 2790]], how: 'Активируйте код на spotify.com/redeem в аккаунте нужного региона.' },
    { id: 'apple', mark: 'apple', cats: ['gift'], title: 'Apple Gift Card', region: 'Россия', fee: 0.04, def: 1, size: 'wide', c: ['#3b3b52', '#7a7a96'], variants: [['1 000 ₽', 1000], ['2 000 ₽', 2000], ['3 000 ₽', 3000], ['5 000 ₽', 5000]], how: 'Введите код в App Store: профиль, «Погасить подарочную карту».' },
    { id: 'tgprem', mark: 'tg', cats: ['subs'], title: 'Telegram Premium', region: 'Весь мир', fee: 0, def: 1, c: ['#2aa7e8', '#1b6fd6'], variants: [['3 месяца', 1090], ['6 месяцев', 1690], ['12 месяцев', 2890]], how: 'Отправьте ссылку-подарок на нужный аккаунт или активируйте у себя.' },
    { id: 'netflix', mark: 'reel', cats: ['subs'], title: 'Netflix Gift Card', region: 'Турция', fee: 0.06, def: 0, c: ['#e0344c', '#8f1530'], variants: [['250 TRY', 1300], ['500 TRY', 2550], ['1 000 TRY', 5000]], how: 'Погасите карту в настройках аккаунта Netflix (регион Турция).' },
    { id: 'ps', mark: 'ps', cats: ['gift', 'games'], title: 'PlayStation Store', region: 'Россия', fee: 0.05, def: 1, c: ['#2457d6', '#0f2c86'], variants: [['1 000 ₽', 1000], ['2 000 ₽', 2000], ['4 000 ₽', 4000]], how: 'PS Store: «Погасить коды».' },
    { id: 'xbox', mark: 'xbox', cats: ['subs', 'games'], title: 'Xbox Game Pass Ultimate', region: 'Весь мир', fee: 0, def: 1, c: ['#2fa23d', '#146b27'], variants: [['1 месяц', 1190], ['3 месяца', 2990], ['6 месяцев', 5490]], how: 'Введите код на redeem.microsoft.com.' },
    { id: 'gplay', mark: 'play', cats: ['gift'], title: 'Google Play', region: 'Россия', fee: 0.04, def: 1, c: ['#16b6a0', '#3d7bf0'], variants: [['500 ₽', 500], ['1 000 ₽', 1000], ['3 000 ₽', 3000]], how: 'Play Маркет: «Активировать промокод».' },
    { id: 'roblox', mark: 'roblox', cats: ['games'], title: 'Roblox Robux', region: 'Весь мир', fee: 0, def: 0, c: ['#e3463f', '#a0201c'], variants: [['800 Robux', 899], ['1 700 Robux', 1790], ['4 500 Robux', 4490]], how: 'Введите PIN на roblox.com/redeem.' },
    { id: 'fortnite', mark: 'vcoin', cats: ['games'], title: 'Fortnite V-Bucks', region: 'Весь мир', fee: 0.03, def: 0, c: ['#8b5cf6', '#2563eb'], variants: [['1 000 V-Bucks', 790], ['2 800 V-Bucks', 1990], ['5 000 V-Bucks', 3490]], how: 'Погасите код в магазине предметов вашей платформы.' },
    { id: 'discord', mark: 'chat', cats: ['subs'], title: 'Discord Nitro', region: 'Весь мир', fee: 0, def: 0, c: ['#5865f2', '#3b44b8'], variants: [['1 месяц', 790], ['12 месяцев', 7490]], how: 'Погасите ссылку-подарок в настройках Discord.' },
    { id: 'yplus', mark: 'plus', cats: ['subs'], title: 'Яндекс Плюс', region: 'Россия', fee: 0, def: 1, c: ['#ff9f1c', '#e8452c'], variants: [['1 месяц', 299], ['3 месяца', 799], ['12 месяцев', 2490]], how: 'Введите промокод на plus.yandex.ru.' },
    { id: 'mobile', mark: 'phone', cats: ['mobile'], title: 'Пополнение связи', region: 'Россия', fee: 0.02, def: 1, needsPhone: true, c: ['#ff8a3d', '#f0508a'], variants: [['300 ₽', 300], ['500 ₽', 500], ['1 000 ₽', 1000]], how: 'Деньги поступят на номер сразу после оплаты.' }
  ];
  const TOPUP_METHODS = [
    { id: 'card', name: 'Карта', fee: 0.025, hint: 'Visa, Mastercard, МИР' },
    { id: 'sbp', name: 'СБП', fee: 0.01, hint: 'Перевод по номеру телефона' },
    { id: 'usdt', name: 'USDT', fee: 0.015, hint: 'Сеть TRC20' }
  ];
  return {
    CATS, SHOWCASES, TOPUP_METHODS,
    WALLET_ID: '408723159061', USER_NAME: 'Алексей Лебедев', USER_INITIALS: 'АЛ',
    TRANSFER_FEE: 0.01, MIN_TOPUP: 100, MAX_TOPUP: 100000, MIN_TRANSFER: 10, MAX_TRANSFER: 50000,
    MONTH_LIMIT: 100000, USDT_RATE: 96.4,
    RATES: [['USD', '₽', 95.8, 0.4], ['EUR', '₽', 104.2, -0.2], ['USDT', '₽', 96.4, 0.1], ['TRY', '₽', 2.7, -0.6]]
  };
})();
