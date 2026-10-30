/* VTGSHMOT — каталог винтажной одежды. Состояние в localStorage. */
(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = 'vtg_state_v1';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rub = (n) => `${Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const SORTS = { new: 'Сначала новые', asc: 'Сначала дешевле', desc: 'Сначала дороже' };

  const defaults = () => ({ fav: [], cart: [], orders: [], promo: '', delivery: 'cdek', form: { name: '', contact: '', city: '', address: '' } });
  let S = load();
  function load() {
    try { const r = JSON.parse(localStorage.getItem(KEY)); return r && typeof r === 'object' ? { ...defaults(), ...r } : defaults(); } catch { return defaults(); }
  }
  function set(patch) {
    S = { ...S, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* приватный режим */ }
  }
  const toggle = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // Состояние интерфейса
  let ui = { view: 'catalog', cat: 'all', size: 'all', q: '', sort: 'new', favOnly: false, pid: null, search: false, errors: {}, lastOrder: null, closed: false };
  const setUi = (patch) => { ui = { ...ui, ...patch }; };

  const ICON = {
    sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h12M4 12h8M4 17h4M18 10v8m0 0l-3-3m3 3l3-3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.500"/><path d="M16 16l4 4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5.200-8-11a4.500 4.500 0 018-2.700A4.500 4.500 0 0120 10c0 5.800-8 11-8 11z"/></svg>',
    heartO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7.500-4.800-7.500-10.200A4.200 4.200 0 0112 7.300a4.200 4.200 0 017.500 2.500C19.500 15.200 12 20 12 20z"/></svg>'
  };

  /* ---------- Фильтрация ---------- */
  function visible() {
    const q = ui.q.trim().toLowerCase();
    const list = PRODUCTS.filter((p) =>
      (ui.cat === 'all' || p.cat === ui.cat) && (ui.size === 'all' || p.size === ui.size) &&
      (!q || `${p.title} ${p.brand}`.toLowerCase().includes(q)) && (!ui.favOnly || S.fav.includes(p.id)));
    if (ui.sort === 'asc') return [...list].sort((a, b) => a.price - b.price);
    if (ui.sort === 'desc') return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => b.id - a.id);
  }
  const cartItems = () => S.cart.map(byId).filter((p) => p && !p.sold);
  function totals() {
    const items = cartItems();
    const sub = items.reduce((s, p) => s + p.price, 0);
    const disc = Math.round(sub * (PROMO[S.promo] || 0));
    const d = DELIVERY.find((x) => x.id === S.delivery) || DELIVERY[0];
    const ship = d.id === 'cdek' && sub - disc >= FREE_CDEK_FROM ? 0 : d.price;
    return { sub, disc, ship, total: sub - disc + (items.length ? ship : 0), items };
  }

  /* ---------- Экраны ---------- */
  const head = () => `<div class="brand"><div class="logo">${LOGO}VTGSHMOT</div>
    <div class="nav"><button class="${ui.view === 'catalog' ? 'on' : ''}" data-act="nav" data-v="catalog">Каталог</button>
    <button class="${ui.view === 'cart' ? 'on' : ''}" data-act="nav" data-v="cart">Корзина${S.cart.length ? `<b>${S.cart.length}</b>` : ''}</button></div></div>`;

  function card(p) {
    const fav = S.fav.includes(p.id);
    return `<div class="pc" data-act="open" data-id="${p.id}" role="button" tabindex="0" aria-label="${esc(p.title)}">
      <div class="im">${art(p)}<button class="heart ${fav ? 'on' : ''}" data-act="fav" data-id="${p.id}" aria-label="В избранное">${fav ? ICON.heart : ICON.heartO}</button>
      <span class="size-tag">${p.size}</span>${p.sold ? '<div class="sold">ПРОДАНО</div>' : ''}</div>
      <div class="pr">${rub(p.price)}</div><div class="nm">${esc(p.title)}</div></div>`;
  }

  function catalog() {
    const list = visible();
    const cat = CATEGORIES.find((c) => c.id === ui.cat);
    const grid = list.length ? `<div class="grid">${list.map(card).join('')}</div>`
      : `<div class="empty"><b>Ничего не найдено</b>Попробуйте изменить фильтры<div style="height:16px"></div><button class="btn sec" data-act="resetFilters" style="max-width:220px;margin:auto">Сбросить фильтры</button></div>`;
    return `${head()}<div class="filters">
      <button class="fbtn" data-act="sortSheet" aria-label="Сортировка">${ICON.sort}</button>
      <button class="fbtn ${ui.cat !== 'all' ? 'on' : ''}" data-act="catSheet">${esc(cat.name)} ▾</button>
      <button class="fbtn ${ui.search || ui.q ? 'on' : ''}" data-act="toggleSearch" aria-label="Поиск">${ICON.search}</button>
      <div style="flex-basis:100%;height:0"></div>
      <button class="fbtn ${ui.size !== 'all' ? 'on' : ''}" data-act="sizeSheet">${ui.size === 'all' ? 'Размер' : `Размер ${ui.size}`}</button>
      ${ui.favOnly ? '<button class="fbtn on" data-act="favOff">♥ Избранное ✕</button>' : ''}</div>
      ${ui.search ? `<div class="search"><input id="q" type="search" placeholder="Бренд или название" value="${esc(ui.q)}" autocomplete="off"></div>` : ''}
      <div class="count">${SORTS[ui.sort]} · ${list.length} шт.</div>${grid}`;
  }

  function product() {
    const p = byId(ui.pid);
    if (!p) return catalog();
    const inCart = S.cart.includes(p.id);
    const slides = [0, 1, 2].map((v) => `<div class="sl">${art(p, v)}</div>`).join('');
    const meas = p.m.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    const btn = p.sold ? '<button class="btn" disabled>Продано</button>'
      : inCart ? '<button class="btn ac" data-act="nav" data-v="cart">В корзине · перейти</button>'
        : `<button class="btn" data-act="add" data-id="${p.id}">В корзину · ${rub(p.price)}</button>`;
    return `<div class="gal" id="gal">${slides}</div><div class="dots" id="dots"><i class="on"></i><i></i><i></i></div>
      <div class="det"><div class="price">${rub(p.price)}</div><h1>${esc(p.title)}</h1>
      <div class="meta"><span class="tag">Размер ${p.size}</span><span class="tag g">Состояние ${p.cond}/10</span><span class="tag">${esc(p.brand)}</span><span class="tag">${p.year}</span></div>
      <h3>Описание</h3><p>${esc(p.desc)}</p><h3>Замеры</h3><div class="tbl">${meas}</div>
      <p class="note">Винтаж в единственном экземпляре. После оплаты вещь закрепляется за вами.</p></div>
      <div class="sticky">${btn}<div style="height:8px"></div><button class="btn sec" data-act="fav" data-id="${p.id}">${S.fav.includes(p.id) ? '♥ В избранном' : '♡ В избранное'}</button></div>`;
  }

  function cart() {
    const t = totals();
    if (!t.items.length) {
      return `${head()}<div class="empty"><b>Корзина пуста</b>Добавьте вещи из каталога<div style="height:18px"></div><button class="btn" data-act="nav" data-v="catalog" style="max-width:220px;margin:auto">В каталог</button></div>`;
    }
    const rows = t.items.map((p) => `<div class="ci"><div class="th" data-act="open" data-id="${p.id}">${art(p)}</div>
      <div class="tx"><b>${esc(p.title)}</b><small>Размер ${p.size} · состояние ${p.cond}/10</small><div class="p">${rub(p.price)}</div></div>
      <button class="x" data-act="rm" data-id="${p.id}" aria-label="Убрать">✕</button></div>`).join('');
    return `${head()}${rows}<div class="box"><div class="promo"><input id="promo" placeholder="Промокод" value="${esc(S.promo)}" autocomplete="off"><button data-act="applyPromo">Применить</button></div>
      <p class="note">Для проверки введите VTG10 (скидка 10%).</p></div>
      <div class="box"><div class="sum"><span>Товары (${t.items.length})</span><span>${rub(t.sub)}</span></div>
      ${t.disc ? `<div class="sum"><span>Скидка</span><span>−${rub(t.disc)}</span></div>` : ''}
      <div class="sum tot"><span>Итого без доставки</span><span>${rub(t.sub - t.disc)}</span></div></div>
      <div style="padding:6px 14px 26px"><button class="btn" data-act="checkout">Оформить заказ</button></div>`;
  }

  function field(id, label, ph, value, type = 'text') {
    return `<label class="f ${ui.errors[id] ? 'err' : ''}">${label}<input id="f_${id}" type="${type}" placeholder="${ph}" value="${esc(value)}" autocomplete="off"><em>${esc(ui.errors[id] || '')}</em></label>`;
  }
  function checkout() {
    const t = totals();
    if (!t.items.length) return cart();
    const dl = DELIVERY.map((d) => {
      const price = d.id === 'cdek' && t.sub - t.disc >= FREE_CDEK_FROM ? 0 : d.price;
      return `<button class="opt ${S.delivery === d.id ? 'on' : ''}" data-act="delivery" data-id="${d.id}"><span class="rd"></span><span><b>${d.name}</b><small>${d.note}</small></span><span class="pp">${price ? rub(price) : 'Бесплатно'}</span></button>`;
    }).join('');
    const f = S.form;
    return `<div class="sec-t">Оформление</div><div class="box"><h3 style="margin-bottom:10px;font-size:15px">Доставка</h3>${dl}</div>
      <div class="box">${field('name', 'Имя', 'Как к вам обращаться', f.name)}${field('contact', 'Telegram или телефон', '@username или +7…', f.contact)}
      ${field('city', 'Город', 'Москва', f.city)}${S.delivery === 'pickup' ? '' : field('address', 'Адрес или пункт выдачи', 'Улица, дом, квартира', f.address)}</div>
      <div class="box"><div class="sum"><span>Товары</span><span>${rub(t.sub)}</span></div>${t.disc ? `<div class="sum"><span>Скидка</span><span>−${rub(t.disc)}</span></div>` : ''}
      <div class="sum"><span>Доставка</span><span>${t.ship ? rub(t.ship) : 'Бесплатно'}</span></div><div class="sum tot"><span>К оплате</span><span>${rub(t.total)}</span></div>
      <p class="note">Подключение: оплата картой (ЮKassa) и расчёт доставки (СДЭК). В демо заказ создаётся без списания денег.</p></div>
      <div style="padding:6px 14px 26px"><button class="btn" data-act="placeOrder">Подтвердить заказ</button></div>`;
  }

  function done() {
    const o = ui.lastOrder;
    return `<div class="done"><div class="ok">✓</div><h1>Заказ ${esc(o.no)} принят</h1>
      <p>Менеджер напишет вам в Telegram в течение часа и пришлёт ссылку на оплату. Сумма заказа: ${rub(o.total)}.</p>
      <div class="row2"><button class="btn sec" data-act="nav" data-v="orders">Мои заказы</button><button class="btn" data-act="nav" data-v="catalog">В каталог</button></div></div>`;
  }

  function orders() {
    const list = S.orders.length ? S.orders.map((o) => `<div class="ord"><div class="h"><span>${esc(o.no)}</span><span>${rub(o.total)}</span></div>
      <small>${esc(o.date)} · ${esc(o.delivery)}</small><small>${o.items.map(esc).join(', ')}</small><small class="badge">● ${esc(o.status)}</small></div>`).join('')
      : '<div class="empty"><b>Заказов пока нет</b>Оформите первый из корзины</div>';
    return `<div class="sec-t">Мои заказы</div>${list}`;
  }

  /* ---------- Рендер ---------- */
  const views = { catalog, cart, product, checkout, done, orders };
  const ROOT = ['catalog', 'cart'];
  function render() {
    const view = $('#view');
    const keep = view.dataset.v === ui.view ? view.scrollTop : 0;
    view.innerHTML = views[ui.view]();
    view.dataset.v = ui.view;
    view.scrollTop = keep;
    $('#tgLeft').textContent = ROOT.includes(ui.view) ? 'Закрыть' : 'Назад';
    const q = $('#q');
    if (q) {
      q.addEventListener('input', () => { setUi({ q: q.value }); refreshGrid(); });
      if (ui.search && document.activeElement !== q && !q.value) q.focus();
    }
    const gal = $('#gal');
    if (gal) gal.addEventListener('scroll', () => {
      const i = Math.round(gal.scrollLeft / gal.clientWidth);
      document.querySelectorAll('#dots i').forEach((d, k) => d.classList.toggle('on', k === i));
    });
    document.querySelectorAll('[id^=f_]').forEach((inp) => inp.addEventListener('input', () => {
      set({ form: { ...S.form, [inp.id.slice(2)]: inp.value } });
    }));
    $('#closedBox')?.remove();
    if (ui.closed) showClosed();
  }
  // Поиск обновляет только сетку, чтобы не терять фокус поля ввода
  function refreshGrid() {
    const list = visible();
    $('.grid')?.remove();
    $('.empty')?.remove();
    $('.count').textContent = `${SORTS[ui.sort]} · ${list.length} шт.`;
    $('.count').insertAdjacentHTML('afterend', list.length ? `<div class="grid">${list.map(card).join('')}</div>`
      : '<div class="empty"><b>Ничего не найдено</b>Измените запрос</div>');
  }
  function showClosed() {
    $('#phone').insertAdjacentHTML('beforeend', `<div class="closed" id="closedBox"><b style="font-size:20px">Мини-приложение закрыто</b><p>В Telegram оно закрылось бы здесь.</p><button class="btn" data-act="reopen">Открыть снова</button></div>`);
  }

  const sheet = (html) => { $('#sheet').innerHTML = `<div class="sheet-bg"><div class="sheet">${html}</div></div>`; };
  const closeSheet = () => { $('#sheet').innerHTML = ''; };
  const nav = (v) => { setUi({ view: v, errors: {} }); closeSheet(); render(); };

  /* ---------- Действия ---------- */
  function validate() {
    const f = S.form; const e = {};
    if (f.name.trim().length < 2) e.name = 'Введите имя';
    if (!/^(@[A-Za-z0-9_]{4,32}|\+?\d[\d\s()-]{9,17})$/.test(f.contact.trim())) e.contact = 'Укажите @username или телефон';
    if (!f.city.trim()) e.city = 'Укажите город';
    if (S.delivery !== 'pickup' && f.address.trim().length < 5) e.address = 'Укажите адрес';
    return e;
  }
  function placeOrder() {
    const e = validate();
    if (Object.keys(e).length) { setUi({ errors: e }); render(); toast('Проверьте поля формы'); return; }
    const t = totals();
    const d = DELIVERY.find((x) => x.id === S.delivery);
    const order = {
      no: `#VTG-${String(1000 + S.orders.length * 7 + Math.floor(Math.random() * 6)).padStart(4, '0')}`, total: t.total, status: 'Ожидает оплаты',
      date: new Date().toLocaleDateString('ru-RU'), delivery: d.name, items: t.items.map((p) => p.title)
    };
    set({ orders: [order, ...S.orders], cart: [], promo: '' });
    setUi({ view: 'done', lastOrder: order, errors: {} });
    render();
  }

  const actions = {
    nav: (d) => nav(d.v),
    tgLeft: () => {
      if (ROOT.includes(ui.view)) { setUi({ closed: true }); render(); return; }
      nav(ui.view === 'checkout' ? 'cart' : 'catalog');
    },
    reopen: () => { setUi({ closed: false }); render(); },
    open: (d) => { setUi({ view: 'product', pid: +d.id }); render(); $('#view').scrollTop = 0; },
    fav: (d) => { set({ fav: toggle(S.fav, +d.id) }); render(); },
    favOff: () => { setUi({ favOnly: false }); render(); },
    add: (d) => { const id = +d.id; if (!S.cart.includes(id)) set({ cart: [...S.cart, id] }); toast('Добавлено в корзину'); render(); },
    rm: (d) => { set({ cart: S.cart.filter((x) => x !== +d.id) }); render(); },
    applyPromo: () => {
      const code = $('#promo').value.trim().toUpperCase();
      if (!code) { set({ promo: '' }); render(); return; }
      if (!PROMO[code]) { toast('Промокод не найден'); return; }
      set({ promo: code }); toast(`Промокод ${code} применён`); render();
    },
    checkout: () => nav('checkout'),
    delivery: (d) => { set({ delivery: d.id }); render(); },
    placeOrder,
    sortSheet: () => sheet(`<h3>Сортировка</h3>${Object.entries(SORTS).map(([k, v]) => `<button class="li ${ui.sort === k ? 'on' : ''}" data-act="setSort" data-v="${k}">${v}${ui.sort === k ? '✓' : ''}</button>`).join('')}`),
    setSort: (d) => { setUi({ sort: d.v }); closeSheet(); render(); },
    catSheet: () => sheet(`<h3>Категория</h3>${CATEGORIES.map((c) => `<button class="li ${ui.cat === c.id ? 'on' : ''}" data-act="setCat" data-v="${c.id}">${c.name}${ui.cat === c.id ? '✓' : ''}</button>`).join('')}`),
    setCat: (d) => { setUi({ cat: d.v }); closeSheet(); render(); },
    sizeSheet: () => sheet(`<h3>Размер</h3><div class="chips"><button class="chip ${ui.size === 'all' ? 'on' : ''}" data-act="setSize" data-v="all">Любой</button>${SIZES.map((s) => `<button class="chip ${ui.size === s ? 'on' : ''}" data-act="setSize" data-v="${s}">${s}</button>`).join('')}</div>`),
    setSize: (d) => { setUi({ size: d.v }); closeSheet(); render(); },
    toggleSearch: () => { setUi({ search: !ui.search, q: ui.search ? '' : ui.q }); render(); },
    resetFilters: () => { setUi({ cat: 'all', size: 'all', q: '', favOnly: false, search: false }); render(); },
    menu: () => sheet(`<h3>VTGSHMOT bot</h3>
      <button class="li" data-act="menuGo" data-v="fav">Избранное <span>${S.fav.length}</span></button>
      <button class="li" data-act="menuGo" data-v="orders">Мои заказы <span>${S.orders.length}</span></button>
      <button class="li" data-act="menuGo" data-v="about">О магазине</button>
      <button class="li" data-act="menuGo" data-v="restart">Перезапустить</button>`),
    menuGo: (d) => {
      closeSheet();
      if (d.v === 'fav') { setUi({ view: 'catalog', favOnly: true }); render(); }
      else if (d.v === 'orders') nav('orders');
      else if (d.v === 'restart') { setUi({ view: 'catalog', cat: 'all', size: 'all', q: '', favOnly: false, search: false, sort: 'new' }); render(); toast('Перезапущено'); }
      else sheet('<h3>О магазине</h3><p style="color:#c9c9ce;line-height:1.5">VTGSHMOT — винтажная одежда и аксессуары: куртки, худи, джинсы и мерч 90-х и 2000-х. Каждая вещь в единственном экземпляре, замеры и состояние указаны в карточке.</p><p class="note">Подключение: Telegram-бот магазина, CRM для заказов.</p>');
    },
    closeSheet
  };

  $('#phone').addEventListener('click', (e) => {
    if (e.target.classList.contains('sheet-bg')) { closeSheet(); return; }
    const el = e.target.closest('[data-act]');
    if (!el || !actions[el.dataset.act]) return;
    e.stopPropagation();
    actions[el.dataset.act](el.dataset);
  });
  $('#phone').addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.pc')) { e.preventDefault(); actions.open(e.target.dataset); }
  });
  const clock = () => { $('#clock').textContent = new Date().toLocaleTimeString('ru-RU', { hour: 'numeric', minute: '2-digit' }); };
  clock();
  setInterval(clock, 30000);
  render();
})();
