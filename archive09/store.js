/* Состояние магазина: иммутабельные обновления, localStorage a09_state_v1, расчёт корзины. */
(function () {
  'use strict';
  const KEY = 'a09_state_v1';
  const DEFAULT = Object.freeze({
    fav: [], cart: [], orders: [], recent: [], sold: [],
    promo: null, delivery: 'pickup',
    user: { name: '', contact: '', city: '', address: '' }
  });
  const listeners = [];

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object') return { ...DEFAULT, ...raw, user: { ...DEFAULT.user, ...(raw.user || {}) } };
    } catch (e) { /* повреждённое или недоступное хранилище: стартуем с чистого состояния */ }
    return { ...DEFAULT };
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* приватный режим: работаем без сохранения */ }
  }

  A9.state = load();
  A9.acts = {};   /* обработчики data-act, регистрируются модулями */
  A9.inputs = {}; /* обработчики data-in для полей */
  A9.on = (fn) => { listeners.push(fn); };
  A9.set = (patch) => {
    A9.state = { ...A9.state, ...(typeof patch === 'function' ? patch(A9.state) : patch) };
    save(A9.state);
    listeners.forEach((fn) => fn(A9.state));
  };
  /* Черновик формы: сохраняем без перерисовки */
  A9.setUser = (patch) => {
    A9.state = { ...A9.state, user: { ...A9.state.user, ...patch } };
    save(A9.state);
  };
  A9.reset = () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } A9.state = load(); listeners.forEach((fn) => fn(A9.state)); };

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  A9.esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (ch) => ESC[ch]);
  A9.fmt = (n) => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
  A9.no = (it) => '№' + String(it.id).padStart(3, '0');
  A9.byId = (id) => A9.ITEMS.find((i) => i.id === Number(id));
  A9.isSold = (it) => Boolean(it.sold) || A9.state.sold.includes(it.id);
  A9.inCart = (id) => A9.state.cart.includes(id);
  A9.isFav = (id) => A9.state.fav.includes(id);
  A9.isDesktop = () => window.matchMedia('(min-width:1024px)').matches;
  A9.catLabel = (id) => (A9.CATS.find((c) => c.id === id) || {}).label || '';
  A9.plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };

  A9.toggleFav = (id) => A9.set((s) => ({ fav: s.fav.includes(id) ? s.fav.filter((x) => x !== id) : [...s.fav, id] }));
  A9.addCart = (id) => {
    const it = A9.byId(id);
    if (!it || A9.isSold(it) || A9.inCart(id)) return false;
    A9.set((s) => ({ cart: [...s.cart, id] }));
    return true;
  };
  A9.removeCart = (id) => A9.set((s) => ({ cart: s.cart.filter((x) => x !== id) }));
  A9.pushRecent = (id) => {
    if (A9.state.recent[0] === id) return;
    A9.state = { ...A9.state, recent: [id, ...A9.state.recent.filter((x) => x !== id)].slice(0, 8) };
    save(A9.state);
  };

  A9.applyPromo = (code) => {
    const ok = String(code).trim().toUpperCase() === A9.PROMO.code;
    if (ok) A9.set({ promo: A9.PROMO.code });
    return ok;
  };

  /* Корзина: актуальные вещи (проданные в момент оформления выпадают) и итоги */
  A9.cartItems = () => A9.state.cart.map(A9.byId).filter((it) => it && !A9.isSold(it));
  A9.totals = (deliveryKey) => {
    const items = A9.cartItems();
    const sum = items.reduce((acc, it) => acc + it.price, 0);
    const discount = A9.state.promo ? Math.round(sum * A9.PROMO.percent / 100) : 0;
    const goods = sum - discount;
    const d = A9.DELIVERY[deliveryKey || A9.state.delivery] || A9.DELIVERY.pickup;
    const freeShip = d.free || goods >= A9.FREE_FROM;
    const shipping = items.length && !freeShip ? d.cost : 0;
    return { items, sum, discount, goods, shipping, total: goods + shipping, left: Math.max(0, A9.FREE_FROM - goods), count: items.length };
  };

  /* Следующий дроп: ближайшая пятница, 19:00 по времени пользователя */
  A9.nextDrop = () => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
    d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7));
    if (d <= now) d.setDate(d.getDate() + 7);
    return d;
  };

  A9.similar = (it) => A9.ITEMS
    .filter((x) => x.id !== it.id && !A9.isSold(x))
    .map((x) => ({ x, score: (x.cat === it.cat ? 0 : 10000) + Math.abs(x.price - it.price) }))
    .sort((a, b) => a.score - b.score).slice(0, 4).map((r) => r.x);

  A9.toast = (msg, action) => {
    const el = document.getElementById('toast');
    if (!el) return;
    el.innerHTML = `<span>${A9.esc(msg)}</span>` + (action ? `<a href="${A9.esc(action.href)}">${A9.esc(action.label)}</a>` : '');
    el.classList.add('on');
    clearTimeout(A9.toast.t);
    A9.toast.t = setTimeout(() => el.classList.remove('on'), 3200);
  };
})();
