/* Каркас: шапка, нижняя панель, hash-роутер, слои (корзина, быстрый просмотр), делегирование событий. */
(function () {
  'use strict';
  const { esc, fmt } = A9;
  const $ = (s, r) => (r || document).querySelector(s);
  const view = $('#view'), layer = $('#layer');
  const scrolls = {};
  let route = { name: 'home' }, navCount = 0, lastFocus = null;

  const MARQUEE = ['NEW DROP', '1 OF 1', 'ВИНТАЖ И СЕКОНД-ХЕНД', 'БЕСПЛАТНАЯ ДОСТАВКА ОТ 6 000 ₽', 'ПРОМОКОД ARCH10', 'КАЖДАЯ ВЕЩЬ ОДНА', 'ARCHIVE/09'];
  $('#marquee').innerHTML = [1, 2].map(() => `<span class="mq-set">${MARQUEE.map((t) => `<span>${t}</span><i>✦</i>`).join('')}</span>`).join('');

  const ICONS = {
    home: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    fav: '<path d="M12 21s-8-5.300-8-11a4.500 4.500 0 018-2.800A4.500 4.500 0 0120 10c0 5.700-8 11-8 11z"/>',
    cart: '<path d="M3 4h3l2.500 11h9.500l2-8H7M10 20h.01M17 20h.01"/>',
    orders: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>'
  };
  const ico = (k) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${ICONS[k]}</svg>`;

  function parse() {
    const p = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    if (p[0] === 'item' && p[1]) return { name: 'item', id: Number(p[1]) };
    if (['cart', 'checkout', 'orders', 'fav'].includes(p[0])) return { name: p[0] };
    return { name: 'home' };
  }

  function chrome() {
    const s = A9.state, n = A9.cartItems().length, fav = s.fav.length, cur = route.name;
    const badge = (v, cls) => (v ? `<b class="${cls || 'badge'}">${v}</b>` : '');
    const on = (k) => (cur === k || (k === 'home' && cur === 'item') ? ' aria-current="page"' : '');
    $('#hd').innerHTML = `<div class="hd-in"><a class="logo" href="#/" aria-label="АРХИВ №9, на главную"><span class="logo-m">ARCHIVE</span><span class="logo-s">/09</span></a>
      <nav class="hd-nav" aria-label="Разделы"><a href="#/"${on('home')}>Каталог</a><a href="#/fav"${on('fav')}>Избранное ${badge(fav)}</a><a href="#/orders"${on('orders')}>Заказы ${badge(s.orders.length)}</a></nav>
      <a class="cart-btn" href="#/cart" aria-label="Корзина, вещей: ${n}">${ico('cart')}<span>Корзина</span><b class="badge badge-l${n ? '' : ' zero'}">${n}</b></a></div>`;
    const tab = (href, k, label, count) => `<a href="${href}"${on(k)}>${ico(k)}<span>${label}</span>${badge(count, 'badge badge-m')}</a>`;
    $('#mbar').innerHTML = tab('#/', 'home', 'Каталог') + tab('#/fav', 'fav', 'Избранное', fav) + tab('#/cart', 'cart', n ? `Корзина ${fmt(A9.totals().goods)}` : 'Корзина', n) + tab('#/orders', 'orders', 'Заказы', s.orders.length);
    document.body.classList.toggle('on-item', cur === 'item');
  }

  $('#ft').innerHTML = `<div class="ft-word" aria-hidden="true">ARCHIVE/09</div>
    <div class="ft-grid"><div><h3>АРХИВ №9</h3><p>Винтаж и секонд-хенд. Каждая вещь существует в одном экземпляре, поэтому никаких «осталось 2 штуки».</p></div>
    <div><h3>Условия</h3><p>Самовывоз бесплатно, пункт выдачи СДЭК от 290 ₽, курьер от 490 ₽. Бесплатная доставка от ${fmt(A9.FREE_FROM)}. Промокод ARCH10 даёт −10%.</p></div>
    <div><h3>Демо</h3><p>Подключение: оплата (эквайринг) и доставка (СДЭК), в демо отключены. Данные хранятся только в вашем браузере.</p>
      <button class="link-btn" data-act="reset-demo">Сбросить демо-данные</button></div></div>
    <p class="ft-copy">© АРХИВ №9 · Вымышленные бренды, учебный проект</p>`;

  /* ---------- Слои ---------- */
  A9.openLayer = (kind, html) => {
    lastFocus = lastFocus || document.activeElement;
    layer.className = 'on ' + kind;
    layer.innerHTML = `<div class="scrim" data-act="${kind === 'drawer' ? 'close-cart' : 'close-layer'}"></div>${html}`;
    document.body.classList.add('lock');
    const panel = layer.querySelector('[role="dialog"]');
    if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus(); }
  };
  A9.closeLayer = () => {
    if (!layer.classList.contains('on')) return;
    layer.className = ''; layer.innerHTML = '';
    document.body.classList.remove('lock');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  };
  function renderCart() {
    const old = $('.drawer', layer);
    if (!old) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = A9.cartHtml();
    const next = tmp.firstElementChild;
    next.classList.add('static'); next.setAttribute('tabindex', '-1');
    old.replaceWith(next);
  }

  /* ---------- Роутер ---------- */
  const TITLES = { home: 'АРХИВ №9 — винтаж и секонд-хенд, каждая вещь 1 из 1', fav: 'Избранное — АРХИВ №9', checkout: 'Оформление — АРХИВ №9', orders: 'Мои заказы — АРХИВ №9' };

  function render(r) {
    A9.acts['filters-close']();
    view.innerHTML = r.name === 'item' ? A9.views.item(r.id) : A9.views[r.name]();
    if (r.name === 'item' && A9.byId(r.id)) A9.pushRecent(r.id);
    if (A9.mounts[r.name]) A9.mounts[r.name]();
    const it = r.name === 'item' && A9.byId(r.id);
    document.title = it ? `${it.brand} ${it.name} — АРХИВ №9` : TITLES[r.name] || TITLES.home;
  }

  function onRoute() {
    const r = parse();
    if (r.name === 'cart') {
      if (!view.firstChild) { route = { name: 'home' }; render(route); }
      chrome();
      A9.openLayer('drawer', A9.cartHtml());
      return;
    }
    A9.closeLayer();
    A9.leaveCheckout && r.name !== 'checkout' && A9.leaveCheckout();
    route = r;
    chrome();
    render(r);
    window.scrollTo(0, scrolls[location.hash] || 0);
    if (!scrolls[location.hash]) view.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', () => { navCount++; onRoute(); });
  window.addEventListener('scroll', () => { if (!layer.classList.contains('on')) scrolls[location.hash || '#/'] = window.scrollY; }, { passive: true });

  /* ---------- Действия ---------- */
  A9.acts.skip = (el, e) => { e.preventDefault(); view.focus(); };
  A9.acts['close-layer'] = () => A9.closeLayer();
  A9.acts['close-cart'] = () => { if (navCount > 0) history.back(); else location.hash = '#/'; };
  A9.acts.add = (el) => {
    const id = Number(el.dataset.id), it = A9.byId(id);
    if (!A9.addCart(id)) return;
    if (A9.isDesktop()) { location.hash = '#/cart'; return; }
    A9.closeLayer();
    A9.toast(`${it.name} в корзине`, { href: '#/cart', label: 'Открыть' });
  };
  A9.acts.fav = (el) => {
    const id = Number(el.dataset.id);
    A9.toggleFav(id);
    A9.toast(A9.isFav(id) ? 'Добавлено в избранное' : 'Убрано из избранного');
  };
  A9.acts['reset-demo'] = () => { A9.reset(); A9.toast('Демо-данные сброшены'); if (location.hash && location.hash !== '#/') location.hash = '#/'; else onRoute(); };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = A9.acts[el.dataset.act];
    if (fn) fn(el, e);
  });
  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-in]');
    if (el && A9.inputs[el.dataset.in]) A9.inputs[el.dataset.in](el, e);
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-form]');
    if (!f) return;
    e.preventDefault();
    if (A9.forms[f.dataset.form]) A9.forms[f.dataset.form](f, e);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (layer.classList.contains('on')) { layer.classList.contains('drawer') ? A9.acts['close-cart']() : A9.closeLayer(); return; }
      if ($('.shop-body.f-open')) A9.acts['filters-close']();
      return;
    }
    if (e.key !== 'Tab') return;
    const box = layer.classList.contains('on') ? layer : $('.shop-body.f-open #filters');
    if (!box) return;
    const f = [...box.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')].filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Реакция на изменения состояния ---------- */
  function syncFavs() {
    document.querySelectorAll('[data-act="fav"]').forEach((el) => {
      const it = A9.byId(el.dataset.id), on = A9.isFav(it.id);
      el.classList.toggle('on', on); el.setAttribute('aria-pressed', on);
      const path = el.querySelector('path'); if (path) path.setAttribute('fill', on ? 'currentColor' : 'none');
      if (el.classList.contains('fav-btn')) el.setAttribute('aria-label', `${on ? 'Убрать из избранного' : 'В избранное'}: ${it.name}`);
      const span = el.querySelector('span'); if (span) span.textContent = on ? 'В избранном' : 'В избранное';
    });
  }

  A9.on(() => {
    chrome();
    renderCart();
    syncFavs();
    if (route.name === 'home') A9.updateCatalog();
    if (route.name === 'fav') { view.innerHTML = A9.views.fav(); }
    if (route.name === 'item') {
      const tmp = document.createElement('div');
      tmp.innerHTML = A9.views.item(route.id);
      ['.buy-actions', '.buy-note', '.buybar'].forEach((sel) => { const a = $(sel, view), b = $(sel, tmp); if (a && b) a.replaceWith(b); });
    }
  });

  onRoute();
})();
