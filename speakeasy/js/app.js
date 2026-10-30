/* Оболочка: hash-роутер, навигация (рельс / нижняя панель), правая колонка статистики. */
(function () {
  const { esc, $, $$ } = SPK.ui;
  const { icon } = SPK.art;
  const store = SPK.store;
  const NAV = [['home', 'Главная', 'home'], ['dates', 'Свидания', 'dates'], ['memes', 'Мемы', 'memes'], ['sparks', 'Искры', 'spark'], ['profile', 'Профиль', 'user']];
  let cleanup = null, first = true;

  const link = (n) => '<a class="nl" href="#/' + n[0] + '" data-r="' + n[0] + '">' + icon(n[2]) + '<span>' + n[1] + '</span></a>';

  function buildChrome() {
    $('#brand').innerHTML = '<a class="brand" href="#/home" aria-label="Speakeasy, на главную">' + SPK.art.mascot('happy', 40) + '<span class="bn-t">Speakeasy</span></a>';
    $('#menu').innerHTML = NAV.map(link).join('');
    $('#bnav').innerHTML = NAV.map(link).join('');
  }

  function refresh() {
    const s = store.get();
    $('#pillbox').innerHTML = SPK.parts.sparkPill(s);
    $('#aside').innerHTML = SPK.parts.stats(s);
  }

  function parse() {
    return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch (e) { return ''; } });
  }

  function render() {
    const [sec0, arg] = parse();
    let sec = sec0;
    if (!SPK.views[sec] || (sec === 'home' && arg)) {
      sec = 'home';
      history.replaceState(null, '', '#/home');
    }
    if (typeof cleanup === 'function') { cleanup(); cleanup = null; }
    const route = sec === 'dates' && arg ? 'chat' : sec === 'memes' && arg === 'play' ? 'play' : sec;
    document.body.dataset.route = route;
    $$('.nl').forEach((a) => { if (a.dataset.r === sec) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const view = $('#view');
    view.onclick = null;
    try {
      cleanup = SPK.views[sec](view, arg);
    } catch (err) {
      console.error(err);
      view.innerHTML = '<section class="page"><h1 class="page-h" tabindex="-1">Что-то пошло не так</h1><p class="lead">Не удалось открыть экран.</p><a class="btn pri" href="#/home">На главную</a></section>';
    }
    refresh();
    const title = { home: 'Главная', dates: 'Свидания', memes: 'Мемы', sparks: 'Искры', profile: 'Профиль' }[sec];
    document.title = title + ' — Speakeasy';
    window.scrollTo(0, 0);
    if (!first) { const h = $('h1', view); if (h) h.focus({ preventScroll: true }); }
    first = false;
  }

  SPK.rerender = render;
  buildChrome();
  store.subscribe(refresh);
  window.addEventListener('hashchange', render);
  if (!location.hash) history.replaceState(null, '', '#/home');
  render();
})();
