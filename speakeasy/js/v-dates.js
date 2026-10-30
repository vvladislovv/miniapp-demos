/* Свидания: список сценариев, фильтр по уровню, покупка закрытых за искры. */
(function () {
  const { esc, $, $$, confirm, toast, plural } = SPK.ui;
  const { icon } = SPK.art;
  const store = SPK.store;
  let filter = 'all';

  function card(sc, s) {
    const locked = sc.cost > 0 && !s.unlocked.includes(sc.id);
    const d = s.done[sc.id];
    const stars = d ? Math.max(1, Math.round(d.best / sc.steps.length * 3)) : 0;
    const status = locked ? '<span class="st lock">' + icon('lock') + sc.cost + ' ✦</span>'
      : d ? '<span class="st ok" aria-label="Звёзд: ' + stars + ' из 3">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</span>' : '<span class="st new">Новый</span>';
    return '<button class="dcard' + (locked ? ' locked' : '') + '" style="--h:' + sc.hue + '" data-id="' + sc.id + '">'
      + '<span class="dc-no">' + String(sc.n).padStart(2, '0') + '</span>'
      + '<span class="dc-body"><span class="dc-top"><span class="lvl">' + sc.lvl + '</span>' + status + '</span>'
      + '<span class="dc-t">' + esc(sc.title) + '</span><span class="dc-s">' + esc(sc.sub) + '</span>'
      + '<span class="dc-w">' + SPK.art.avatar(sc.who, sc.hue, 26) + esc(sc.who) + ' · ' + sc.steps.length + ' ' + plural(sc.steps.length, 'реплика', 'реплики', 'реплик') + '</span></span></button>';
  }

  SPK.views.dates = function (root, arg) {
    if (arg) return SPK.views.chat(root, arg);
    const s = store.get();
    const list = SPK.SCENARIOS.filter((x) => filter === 'all' || x.lvl === filter);
    root.innerHTML = '<section class="page"><header class="ph-head"><p class="eyebrow">Раздел 01</p><h1 class="page-h" tabindex="-1">Свидания</h1>'
      + '<p class="lead">Выберите ситуацию и отвечайте как на настоящем свидании. Ошибки разберём в конце.</p></header>'
      + '<div class="seg" role="group" aria-label="Фильтр по уровню">' + ['all', 'A2', 'B1', 'B2'].map((f) => '<button class="seg-b" aria-pressed="' + (f === filter) + '" data-f="' + f + '">' + (f === 'all' ? 'Все' : f) + '</button>').join('') + '</div>'
      + (list.length ? '<div class="dgrid">' + list.map((x) => card(x, s)).join('') + '</div>' : '<p class="empty">В этом уровне пока нет сценариев.</p>') + '</section>';
    $$('.seg-b', root).forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; SPK.views.dates(root); }));
    $$('.dcard', root).forEach((b) => b.addEventListener('click', () => open(b.dataset.id)));
  };

  async function open(id) {
    const sc = SPK.SCENARIOS.find((x) => x.id === id);
    const s = store.get();
    if (!sc) return;
    if (!sc.cost || s.unlocked.includes(id)) return SPK.go('dates/' + id);
    if (s.sparks < sc.cost) { toast('Не хватает искр: нужно ' + sc.cost + ' ✦'); return SPK.go('sparks'); }
    const ok = await confirm({ title: 'Открыть «' + sc.title + '»?', body: 'Спишем <b>' + sc.cost + ' ✦</b>. У вас сейчас ' + s.sparks + ' ✦.', ok: 'Открыть за ' + sc.cost + ' ✦' });
    if (!ok) return;
    const next = store.update((cur) => { const sp = store.spend(cur, sc.cost, 'Открыт сценарий «' + sc.title + '»'); return sp && { ...sp, unlocked: [...sp.unlocked, id] }; });
    if (next.unlocked.includes(id)) SPK.go('dates/' + id);
  }
})();
