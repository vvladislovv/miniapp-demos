/* Главная: hero с дропом недели, фильтры, сетка, карточки-бирки, избранное. */
(function () {
  'use strict';
  const { esc, fmt, no } = A9;
  const F0 = { cat: 'all', sizes: [], pmin: A9.PRICE_MIN, pmax: A9.PRICE_MAX, conds: [], sort: 'new', stock: false, q: '' };
  A9.F = { ...F0 };

  const $ = (s, r) => (r || document).querySelector(s);

  A9.meter = (cond) => `<span class="meter" role="img" aria-label="Состояние ${cond} из 5, ${A9.CONDS[cond].label}">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= cond ? 'on' : ''}"></i>`).join('')}</span>`;

  A9.card = (it, opts) => {
    const sold = A9.isSold(it), fav = A9.isFav(it.id);
    return `<article class="card${sold ? ' is-sold' : ''}" data-id="${it.id}">
      <a class="card-link" href="#/item/${it.id}" aria-label="${esc(it.brand + ' ' + it.name)}, ${fmt(it.price)}${sold ? ', продано' : ''}">
        <div class="card-img"><div class="fr f1">${A9.art(it, 0)}</div><div class="fr f2">${A9.art(it, 1)}</div>
          <span class="hole" aria-hidden="true"></span><span class="no">${no(it)}</span>
          ${it.drop && !sold ? `<span class="newtag">DROP ${A9.DROP_NO}</span>` : ''}
          ${sold ? '<span class="stamp" aria-hidden="true">SOLD</span>' : ''}
        </div>
        <div class="card-body">
          <div class="meta"><span>${esc(it.brand)}</span><span>${esc(it.year)}</span></div>
          <h3>${esc(it.name)}</h3>
          <div class="row"><span class="size">${it.size}</span>${A9.meter(it.cond)}<b class="price">${fmt(it.price)}</b></div>
        </div>
      </a>
      <button class="fav-btn${fav ? ' on' : ''}" data-act="fav" data-id="${it.id}" aria-pressed="${fav}" aria-label="${fav ? 'Убрать из избранного' : 'В избранное'}: ${esc(it.name)}">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.700-8 11-8 11z" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>
      </button>
      ${opts && opts.noQuick ? '' : `<button class="qv-btn" data-act="quick" data-id="${it.id}" aria-label="Быстрый просмотр: ${esc(it.name)}">Быстрый просмотр</button>`}
    </article>`;
  };

  function filtered() {
    const f = A9.F, q = f.q.trim().toLowerCase();
    const rows = A9.ITEMS.filter((it) =>
      (f.cat === 'all' || it.cat === f.cat) && (!f.sizes.length || f.sizes.includes(it.size)) &&
      it.price >= f.pmin && it.price <= f.pmax && (!f.conds.length || f.conds.includes(it.cond)) &&
      (!f.stock || !A9.isSold(it)) &&
      (!q || `${it.brand} ${it.name} ${A9.catLabel(it.cat)} ${it.mat} ${it.year} ${it.size}`.toLowerCase().includes(q)));
    const cmp = { new: (a, b) => b.id - a.id, asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price, cond: (a, b) => b.cond - a.cond || a.price - b.price }[f.sort];
    return [...rows].sort((a, b) => (A9.isSold(a) - A9.isSold(b)) || cmp(a, b));
  }

  function activeCount() {
    const f = A9.F;
    return (f.cat !== 'all') + f.sizes.length + f.conds.length + (f.pmin !== F0.pmin || f.pmax !== F0.pmax) + f.stock;
  }

  function chipsHtml() {
    const f = A9.F, ch = [];
    const chip = (k, v, t) => ch.push(`<button class="chip" data-act="chip" data-k="${k}" data-v="${esc(v)}" aria-label="Убрать фильтр: ${esc(t)}">${esc(t)} <span aria-hidden="true">×</span></button>`);
    if (f.cat !== 'all') chip('cat', '', A9.catLabel(f.cat));
    f.sizes.forEach((s) => chip('size', s, 'Размер ' + s));
    f.conds.forEach((c) => chip('cond', c, A9.CONDS[c].label));
    if (f.pmin !== F0.pmin || f.pmax !== F0.pmax) chip('price', '', `${fmt(f.pmin)} – ${fmt(f.pmax)}`);
    if (f.stock) chip('stock', '', 'Только в наличии');
    if (ch.length) ch.push('<button class="chip chip-reset" data-act="reset-filters">Сбросить всё</button>');
    return ch.join('');
  }

  function emptyHtml() {
    return `<div class="empty"><div class="empty-big" aria-hidden="true">0/24</div><h3>Ничего не нашли</h3><p>Попробуйте убрать часть фильтров или изменить запрос. Вещи 1 из 1, повторов не будет.</p><button class="btn btn-lime" data-act="reset-filters">Сбросить фильтры</button></div>`;
  }

  function filtersHtml() {
    const f = A9.F;
    const count = (id) => A9.ITEMS.filter((i) => id === 'all' || i.cat === id).length;
    return `<div class="f-head"><b>Фильтры</b><button class="icon-btn" data-act="filters-close" aria-label="Закрыть фильтры">×</button></div>
    <div class="f-scroll">
    <section class="f-sec"><h3>Категория</h3><div class="f-cats">${[{ id: 'all', label: 'Всё' }, ...A9.CATS].map((c) =>
      `<button class="f-cat${f.cat === c.id ? ' on' : ''}" data-act="cat" data-v="${c.id}" aria-pressed="${f.cat === c.id}"><span>${c.label}</span><i>${String(count(c.id)).padStart(2, '0')}</i></button>`).join('')}</div></section>
    <section class="f-sec"><h3>Размер</h3><div class="f-sizes">${A9.SIZES.map((s) =>
      `<label class="size-chip"><input type="checkbox" data-in="size" value="${s}" ${f.sizes.includes(s) ? 'checked' : ''}><span>${s}</span></label>`).join('')}</div></section>
    <section class="f-sec"><h3>Цена</h3><div class="price-out"><b id="pmin-out">${fmt(f.pmin)}</b><span>—</span><b id="pmax-out">${fmt(f.pmax)}</b></div>
      <div class="dual"><input type="range" class="rng" data-in="pmin" min="${A9.PRICE_MIN}" max="${A9.PRICE_MAX}" step="500" value="${f.pmin}" aria-label="Цена от"><input type="range" class="rng" data-in="pmax" min="${A9.PRICE_MIN}" max="${A9.PRICE_MAX}" step="500" value="${f.pmax}" aria-label="Цена до"></div></section>
    <section class="f-sec"><h3>Состояние</h3>${[5, 4, 3, 2].map((c) =>
      `<label class="check"><input type="checkbox" data-in="cond" value="${c}" ${f.conds.includes(c) ? 'checked' : ''}><span class="box"></span><span>${A9.CONDS[c].label}</span>${A9.meter(c)}</label>`).join('')}</section>
    <section class="f-sec"><h3>Сортировка</h3><select class="select" data-in="sort" aria-label="Сортировка">
      ${[['new', 'Сначала новые'], ['asc', 'Цена по возрастанию'], ['desc', 'Цена по убыванию'], ['cond', 'Лучшее состояние']].map(([v, t]) => `<option value="${v}" ${f.sort === v ? 'selected' : ''}>${t}</option>`).join('')}</select></section>
    <section class="f-sec"><label class="check"><input type="checkbox" data-in="stock" ${f.stock ? 'checked' : ''}><span class="box"></span><span>Только в наличии</span></label></section>
    </div>
    <div class="f-foot"><button class="btn btn-line" data-act="reset-filters">Сбросить</button><button class="btn btn-lime" data-act="filters-close" id="f-show">Показать</button></div>`;
  }

  function heroHtml() {
    const it = A9.byId(A9.FEATURED_ID);
    const drop = A9.ITEMS.filter((i) => i.drop && !A9.isSold(i)).length;
    return `<section class="hero">
      <div class="hero-l">
        <p class="kicker"><span class="dot"></span>ARCHIVE/09 · DROP №${A9.DROP_NO} · 1 OF 1</p>
        <h1 class="hero-h"><span>Дроп</span><span>недели</span><span class="lime">№${A9.DROP_NO}</span></h1>
        <p class="lead">Винтаж и секонд-хенд. Каждая вещь существует в одном экземпляре: купили, и её больше нет. В этом дропе ${drop} ${A9.plural(drop, 'вещь', 'вещи', 'вещей')}.</p>
        <div class="cd-wrap"><span class="cd-label">До следующего дропа</span>
          <div class="cd" id="cd" role="timer" aria-live="off"><div><b data-u="d">00</b><i>дн</i></div><div><b data-u="h">00</b><i>час</i></div><div><b data-u="m">00</b><i>мин</i></div><div><b data-u="s">00</b><i>сек</i></div></div></div>
        <div class="hero-cta"><button class="btn btn-lime" data-act="scroll-shop">Смотреть каталог</button><a class="btn btn-line" href="#/item/${it.id}">Вещь недели</a></div>
      </div>
      <a class="hero-r" href="#/item/${it.id}" aria-label="Вещь недели: ${esc(it.brand + ' ' + it.name)}">
        <div class="hero-tag"><span class="hole" aria-hidden="true"></span><div class="hero-img">${A9.art(it, 0)}</div>
          <div class="hero-cap"><span>${esc(it.brand)} · ${esc(it.year)}</span><b>${esc(it.name)}</b><em>${fmt(it.price)}</em></div></div>
        <span class="sticker st1" aria-hidden="true">1 OF 1</span><span class="sticker st2" aria-hidden="true">ВЕЩЬ<br>НЕДЕЛИ</span>
      </a>
    </section>`;
  }

  A9.views = A9.views || {};
  A9.views.home = () => `${heroHtml()}
    <section class="shop" id="shop" aria-labelledby="shop-h">
      <div class="shop-head"><h2 id="shop-h">Каталог <sup id="count">24</sup></h2>
        <p class="shop-note">Бирка = вещь. Шкала показывает состояние, штамп SOLD значит ушла.</p></div>
      <div class="toolbar"><label class="search"><span class="sr">Поиск по каталогу</span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.500" cy="10.500" r="6.500" fill="none" stroke="currentColor" stroke-width="2.600"/><path d="M15.500 15.500L21 21" stroke="currentColor" stroke-width="2.600"/></svg>
        <input type="search" data-in="q" placeholder="Поиск: бренд, вещь" value="${esc(A9.F.q)}" autocomplete="off"></label>
        <button class="btn btn-line filters-open" data-act="filters-open" aria-haspopup="dialog"><span>Фильтры</span><b id="f-badge"></b></button></div>
      <div class="chips" id="chips" aria-live="polite"></div>
      <div class="shop-body"><div class="fscrim" data-act="filters-close"></div><aside class="filters" id="filters" aria-label="Фильтры">${filtersHtml()}</aside>
        <div class="grid-wrap"><div class="grid" id="grid"></div></div></div>
    </section>`;

  function update() {
    const rows = filtered(), grid = $('#grid');
    if (!grid) return;
    grid.innerHTML = rows.length ? rows.map((it) => A9.card(it)).join('') : emptyHtml();
    $('#count').textContent = rows.length;
    $('#chips').innerHTML = chipsHtml();
    const n = activeCount(), badge = $('#f-badge');
    badge.textContent = n || '';
    badge.hidden = !n;
    $('#f-show').textContent = `Показать ${rows.length} ${A9.plural(rows.length, 'вещь', 'вещи', 'вещей')}`;
    const f = A9.F;
    document.querySelectorAll('.f-cat').forEach((b) => { const on = b.dataset.v === f.cat; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    document.querySelectorAll('[data-in="size"]').forEach((i) => { i.checked = f.sizes.includes(i.value); });
    document.querySelectorAll('[data-in="cond"]').forEach((i) => { i.checked = f.conds.includes(Number(i.value)); });
    $('[data-in="stock"]').checked = f.stock;
    $('[data-in="sort"]').value = f.sort;
    $('[data-in="pmin"]').value = f.pmin; $('[data-in="pmax"]').value = f.pmax;
    $('#pmin-out').textContent = fmt(f.pmin); $('#pmax-out').textContent = fmt(f.pmax);
    $('[data-in="q"]').value = f.q;
  }

  A9.updateCatalog = update;
  const patchF = (p) => { A9.F = { ...A9.F, ...p }; update(); };
  const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  A9.inputs.q = (el) => patchF({ q: el.value });
  A9.inputs.sort = (el) => patchF({ sort: el.value });
  A9.inputs.stock = (el) => patchF({ stock: el.checked });
  A9.inputs.size = (el) => patchF({ sizes: toggle(A9.F.sizes, el.value) });
  A9.inputs.cond = (el) => patchF({ conds: toggle(A9.F.conds, Number(el.value)) });
  A9.inputs.pmin = (el) => patchF({ pmin: Math.min(Number(el.value), A9.F.pmax) });
  A9.inputs.pmax = (el) => patchF({ pmax: Math.max(Number(el.value), A9.F.pmin) });

  A9.acts.cat = (el) => patchF({ cat: el.dataset.v });
  A9.acts['reset-filters'] = () => patchF({ ...F0 });
  A9.acts.chip = (el) => {
    const { k, v } = el.dataset;
    if (k === 'cat') patchF({ cat: 'all' });
    if (k === 'size') patchF({ sizes: A9.F.sizes.filter((x) => x !== v) });
    if (k === 'cond') patchF({ conds: A9.F.conds.filter((x) => x !== Number(v)) });
    if (k === 'price') patchF({ pmin: F0.pmin, pmax: F0.pmax });
    if (k === 'stock') patchF({ stock: false });
  };
  A9.acts['filters-open'] = () => { $('.shop-body').classList.add('f-open'); document.body.classList.add('lock'); const c = $('#filters .icon-btn'); if (c) c.focus(); };
  A9.acts['filters-close'] = () => { const b = $('.shop-body'); if (b) b.classList.remove('f-open'); document.body.classList.remove('lock'); };
  A9.acts['scroll-shop'] = () => $('#shop').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });

  /* Таймер до дропа */
  let timer = null;
  function tick() {
    const cd = $('#cd');
    if (!cd) { clearInterval(timer); timer = null; return; }
    let ms = Math.max(0, A9.nextDrop() - new Date());
    const parts = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
    Object.keys(parts).forEach((k) => { const e = $(`[data-u="${k}"]`, cd); if (e) e.textContent = String(parts[k]).padStart(2, '0'); });
  }

  A9.mounts = A9.mounts || {};
  A9.mounts.home = () => { update(); tick(); clearInterval(timer); timer = setInterval(tick, 1000); };

  /* Избранное */
  A9.views.fav = () => {
    const items = A9.state.fav.map(A9.byId).filter(Boolean);
    return `<section class="page"><div class="page-head"><h1>Избранное <sup>${items.length}</sup></h1><p>Вещи уникальные: пока вы думаете, их может купить другой человек.</p></div>
      ${items.length ? `<div class="grid grid-page">${items.map((it) => A9.card(it)).join('')}</div>` :
        `<div class="empty"><div class="empty-big" aria-hidden="true">♡</div><h3>Пока пусто</h3><p>Нажмите сердечко на бирке, чтобы сохранить вещь.</p><a class="btn btn-lime" href="#/">В каталог</a></div>`}</section>`;
  };
})();
