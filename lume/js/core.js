/* Lume: форматирование, хранилище состояния (иммутабельное), заготовка данных. */
(() => {
  const D = Lume.data;
  const KEY = 'lume_state_v1';
  const DAY = 864e5;
  const NB = ' ';
  const HTML_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => HTML_ESC[c]);
  const fixSp = (s) => s.replace(/[  ]/g, NB);
  const round2 = (n) => Math.round(n * 100) / 100;
  const money = (n) => `${fixSp(n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}${NB}₽`;
  const whole = (n) => `${fixSp(Math.round(n).toLocaleString('ru-RU'))}${NB}₽`;
  const date = (t) => new Date(t).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const group4 = (s) => String(s).replace(/(\d{4})(?=\d)/g, '$1 ');
  const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const find = (id) => D.SHOWCASES.find((s) => s.id === id);
  const priceOf = (sc, v) => Math.round(v[1] * (1 + sc.fee));
  const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const dayLabel = (t) => {
    const diff = Math.round((dayStart(Date.now()) - dayStart(t)) / DAY);
    if (diff === 0) return 'Сегодня';
    if (diff === 1) return 'Вчера';
    return new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };
  const formatPhone = (d) => {
    const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)];
    return d ? `+7 (${p[0]}${d.length > 3 ? `) ${p[1]}` : ''}${d.length > 6 ? `-${p[2]}` : ''}${d.length > 8 ? `-${p[3]}` : ''}` : '';
  };

  /* ---------- Заготовка: 30 дней истории, чтобы график и ленты выглядели живыми ---------- */
  const seedHistory = () => {
    const now = Date.now();
    const buy = (id, ago, sc, vi, code, phone) => {
      const s = find(sc); const v = s.variants[vi]; const price = priceOf(s, v);
      return { id, d: now - ago * DAY, type: 'buy', sc, t: s.title, vl: v[0], face: v[1], fee: price - v[1], v: -price, code: code || null, phone: phone || null };
    };
    const topup = (id, ago, m, amt) => {
      const mt = D.TOPUP_METHODS.find((x) => x.id === m);
      return { id, d: now - ago * DAY, type: 'in', t: `Пополнение: ${mt.name}`, method: m, v: amt, fee: round2(amt * mt.fee) };
    };
    const out = (id, ago, to, amt, note) => {
      const fee = Math.max(1, round2(amt * D.TRANSFER_FEE));
      return { id, d: now - ago * DAY, type: 'out', t: `Перевод ${group4(to)}`, to, amt, fee, note, v: -round2(amt + fee) };
    };
    return [
      topup('s01', 29.2, 'card', 20000), buy('s02', 26.4, 'spotify', 1, 'KQ7M-2XPD-9TNV-C4HR'),
      out('s03', 24.1, '507318264905', 1500, 'За билеты'), buy('s04', 21.3, 'steam', 1, 'W9ZT-4LBE-M7QA-X2JD'),
      topup('s05', 19, 'sbp', 8000), buy('s06', 16.2, 'xbox', 1, 'R4HN-8CYP-3VFK-ZT6W'),
      buy('s07', 14.5, 'mobile', 1, null, '9161234567'), out('s08', 11.3, '611420987354', 3000, 'Аренда'),
      buy('s09', 9.1, 'discord', 0, 'N2VD-7QMA-5XKE-H9PT'), topup('s10', 6.2, 'usdt', 12000),
      buy('s11', 5, 'tgprem', 1, 'T8GC-3RJW-6ZNB-Q4YM'), buy('s12', 2.6, 'apple', 1, 'D5MX-9AKP-2WHT-J7LR'),
      buy('s13', 1.1, 'yplus', 0, 'P3FB-6TZR-8YDC-N5KA')
    ].sort((a, b) => b.d - a.d);
  };
  const seedState = () => {
    const hist = seedHistory(); const now = Date.now();
    return {
      bal: round2(hist.reduce((a, o) => a + o.v, 0)), fav: ['steam', 'spotify', 'tgprem'], view: 'tiles', hist,
      notif: [
        { id: 'n3', t: 'Добро пожаловать в Lume', s: 'Пополняйте кошелёк и покупайте подарочные карты и подписки в одном месте.', d: now - 36e5, read: false },
        { id: 'n2', t: 'Подписки без комиссии', s: 'Spotify, Telegram Premium и Discord Nitro сегодня без наценки витрины.', d: now - DAY, read: false },
        { id: 'n1', t: 'Лимиты обновлены', s: 'Базовый уровень: до 100 000 ₽ в месяц. Подключение: верификация KYC.', d: now - 3 * DAY, read: true }
      ]
    };
  };
  const valid = (r) => r && typeof r.bal === 'number' && Array.isArray(r.hist) && Array.isArray(r.fav) && Array.isArray(r.notif);
  const load = () => {
    try { const r = JSON.parse(localStorage.getItem(KEY)); return valid(r) ? { ...seedState(), ...r } : seedState(); } catch { return seedState(); }
  };

  /* ---------- Хранилище ---------- */
  let S = load();
  const subs = [];
  const set = (patch) => {
    S = { ...S, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* приватный режим */ }
    subs.forEach((f) => f(S));
  };
  const store = {
    get: () => S,
    set,
    subscribe: (f) => subs.push(f),
    addOp: (op, patch = {}) => set({ ...patch, bal: round2(S.bal + op.v), hist: [op, ...S.hist] }),
    notify: (t, s) => set({ notif: [{ id: uid(), t, s, d: Date.now(), read: false }, ...S.notif] }),
    toggleFav: (id) => set({ fav: S.fav.includes(id) ? S.fav.filter((x) => x !== id) : [...S.fav, id] }),
    markRead: () => set({ notif: S.notif.map((n) => (n.read ? n : { ...n, read: true })) }),
    reset: () => set({ ...seedState() }),
    unread: () => S.notif.filter((n) => !n.read).length
  };

  const spendOf = (o) => (o.type === 'in' ? 0 : -o.v);
  const dailySpend = (days) => {
    const today = dayStart(Date.now());
    return Array.from({ length: days }, (_, i) => {
      const t = today - (days - 1 - i) * DAY;
      const v = S.hist.filter((o) => o.d >= t && o.d < t + DAY).reduce((a, o) => a + spendOf(o), 0);
      return { t, v: round2(v) };
    });
  };
  const monthSpent = () => {
    const d = new Date(); const from = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    return round2(S.hist.filter((o) => o.d >= from).reduce((a, o) => a + spendOf(o), 0));
  };
  const genCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const buf = new Uint32Array(16);
    crypto.getRandomValues(buf);
    const s = Array.from(buf, (n) => chars[n % chars.length]).join('');
    return [0, 4, 8, 12].map((i) => s.slice(i, i + 4)).join('-');
  };
  Object.assign(Lume, { esc, money, whole, date, dayLabel, dayStart, group4, uid, find, priceOf, round2, formatPhone, fixSp, store, dailySpend, monthSpent, genCode, DAY });
})();
