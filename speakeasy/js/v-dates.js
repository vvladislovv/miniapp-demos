/* Свидания: извилистая тропа уровней, покупка закрытых за искры. */
(function () {
  const { esc, confirm, toast, plural } = SPK.ui;
  const { icon, star, mascot, sparkFill } = SPK.art;
  const store = SPK.store;

  const XS = [50, 24, 50, 76, 50, 24, 50, 76];
  const ROW = 196;

  const statusOf = (sc, s, cur) => {
    if (sc.cost > 0 && !s.unlocked.includes(sc.id)) return 'lock';
    if (s.done[sc.id]) return 'done';
    return sc.id === cur ? 'cur' : 'new';
  };

  function curve(n) {
    let d = 'M' + XS[0] + ' 54';
    for (let i = 1; i < n; i++) {
      const y0 = (i - 1) * ROW + 54, y1 = i * ROW + 54, my = (y0 + y1) / 2;
      d += ' C' + XS[(i - 1) % XS.length] + ' ' + my + ' ' + XS[i % XS.length] + ' ' + my + ' ' + XS[i % XS.length] + ' ' + y1;
    }
    return d;
  }

  function node(sc, i, s, cur) {
    const st = statusOf(sc, s, cur), d = s.done[sc.id];
    const stars = d ? Math.max(1, Math.round(d.best / sc.steps.length * 3)) : 0;
    const body = st === 'lock' ? icon('lock', 'n-lock') : '<span class="n-e">' + SPK.EMO[sc.id] + '</span>';
    const under = st === 'done' ? '<span class="n-stars" aria-label="Звёзд: ' + stars + ' из 3">' + [1, 2, 3].map((k) => star(k <= stars)).join('') + '</span>'
      : st === 'lock' ? '<span class="n-price">' + sparkFill() + sc.cost + '</span>' : '';
    return '<div class="trail-row" style="--x:' + XS[i % XS.length] + '%;top:' + i * ROW + 'px;height:' + ROW + 'px"><button class="node n-' + st + '" data-id="' + sc.id + '" aria-label="' + esc(sc.title) + ', ' + sc.lvl + (st === 'lock' ? ', закрыто, ' + sc.cost + ' искр' : st === 'done' ? ', пройдено' : '') + '">'
      + (st === 'cur' ? '<span class="n-go">Старт</span>' : '') + '<span class="n-c">' + body + '</span></button>'
      + '<div class="n-cap"><span class="n-t">' + esc(sc.title) + '</span><span class="n-m"><span class="lvl lv-' + sc.lvl + '">' + sc.lvl + '</span>' + esc(sc.sub) + '</span>' + under + '</div></div>';
  }

  SPK.views.dates = function (root, arg) {
    if (arg) return SPK.views.chat(root, arg);
    const s = store.get();
    const cur = (SPK.SCENARIOS.find((x) => !s.done[x.id] && (!x.cost || s.unlocked.includes(x.id))) || {}).id;
    const doneN = SPK.SCENARIOS.filter((x) => s.done[x.id]).length;
    const n = SPK.SCENARIOS.length;
    root.innerHTML = '<section class="page"><header class="ph-head card flat"><div><p class="eyebrow">Раздел 1</p><h1 class="h1" tabindex="-1">Свидания</h1>'
      + '<p class="lead">Иди по тропе: от кофе до знакомства с родителями. Пройдено <b>' + doneN + ' из ' + n + '</b>.</p></div>' + mascot('wink', 96) + '</header>'
      + '<div class="trail" style="height:' + (n * ROW) + 'px"><svg class="trail-line" viewBox="0 0 100 ' + (n * ROW) + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + curve(n) + '" vector-effect="non-scaling-stroke"/></svg>'
      + SPK.SCENARIOS.map((sc, i) => node(sc, i, s, cur)).join('') + '</div></section>';

    root.onclick = (e) => {
      const b = e.target.closest('.node');
      if (b) open(b.dataset.id);
    };
    return () => { root.onclick = null; };
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
