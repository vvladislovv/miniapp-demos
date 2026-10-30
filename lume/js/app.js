/* Lume: hash-роутер, каркас (рельс, правая колонка, нижняя навигация), делегирование событий. */
(() => {
  const { store, whole, esc } = Lume;
  const { ico, brandMark } = Lume.art;
  const D = Lume.data; const ui = Lume.ui;
  const NAV = [['home', '#/', 'Главная', 'home'], ['shop', '#/shop', 'Витрины', 'shop'], ['wallet', '#/wallet', 'Кошелёк', 'wallet'],
    ['send', '#/send', 'Переводы', 'send'], ['history', '#/history', 'История', 'history'], ['purchases', '#/purchases', 'Покупки', 'bag']];
  const KNOWN = ['shop', 'wallet', 'send', 'history', 'purchases'];
  const $ = (s) => document.querySelector(s);

  const parseRoute = () => {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const [a, b] = parts;
    if (!a) return { name: 'home', nav: 'home', params: {} };
    if (a === 'shop' && b) return { name: 'showcase', nav: 'shop', params: { id: decodeURIComponent(b) } };
    if (KNOWN.includes(a)) return { name: a, nav: a, params: {} };
    return { name: 'home', nav: 'home', params: {} };
  };

  const railHtml = (nav) => `<a class="rail-logo" href="#/" aria-label="Lume, на главную">${brandMark()}<span>Lume</span></a>
    <ul class="rail-nav">${NAV.map(([id, href, label, icon]) => `<li><a href="${href}" class="${id === nav ? 'on' : ''}" ${id === nav ? 'aria-current="page"' : ''} title="${label}">${ico(icon)}<span>${label}</span></a></li>`).join('')}</ul>
    <div class="rail-foot"><div class="rail-bal"><small>Баланс</small><b>${whole(store.get().bal)}</b></div>
    <button type="button" class="rail-user" data-act="profile" aria-label="Профиль"><span class="avatar">${D.USER_INITIALS}</span><span class="nm">${esc(D.USER_NAME)}</span></button></div>`;
  const bnavHtml = (nav) => {
    const item = (id, href, label, icon) => `<a href="${href}" class="${id === nav ? 'on' : ''}" ${id === nav ? 'aria-current="page"' : ''}>${ico(icon)}<span>${label}</span></a>`;
    return `${item('home', '#/', 'Главная', 'home')}${item('shop', '#/shop', 'Витрины', 'shop')}
      <button type="button" class="bnav-main" data-act="quick" aria-label="Оплатить или пополнить"><i>${ico('plus')}</i><span>Оплатить</span></button>
      ${item('history', '#/history', 'История', 'history')}${item('purchases', '#/purchases', 'Покупки', 'bag')}`;
  };

  // Возвращает фокус на тот же элемент после перерисовки (клавиатурная доступность).
  const focusKey = () => {
    const a = document.activeElement;
    if (!a || !$('#main').contains(a)) return null;
    if (a.id) return `#${a.id}`;
    const d = a.dataset || {};
    if (!d.act) return null;
    return `[data-act="${d.act}"]${d.id ? `[data-id="${d.id}"]` : ''}${d.v ? `[data-v="${d.v}"]` : ''}${d.i ? `[data-i="${d.i}"]` : ''}`;
  };

  function render(routeChanged = false) {
    const r = parseRoute(); const view = Lume.views[r.name];
    const key = routeChanged ? null : focusKey();
    const main = $('#main');
    main.innerHTML = view.html(r.params);
    main.classList.remove('enter');
    if (routeChanged && !ui.reduced()) { void main.offsetWidth; main.classList.add('enter'); }
    if (view.mount) view.mount(main, r.params);
    $('#aside').innerHTML = Lume.w.aside();
    $('#rail').innerHTML = railHtml(r.nav);
    $('#bnav').innerHTML = bnavHtml(r.nav);
    document.body.classList.toggle('is-home', r.name === 'home');
    document.title = `${view.title} — Lume`;
    if (key) { const el = main.querySelector(key); if (el) el.focus({ preventScroll: true }); }
  }
  Lume.render = () => render(false);

  window.addEventListener('hashchange', () => {
    ui.closeSheet(true);
    render(true);
    window.scrollTo(0, 0);
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    const fn = t && Lume.acts[t.dataset.act];
    if (fn) fn(t, e);
  });
  document.addEventListener('input', (e) => { const fn = e.target.id && Lume.inputs[e.target.id]; if (fn) fn(e.target); });
  store.subscribe(() => render(false));
  render(true);
})();
