/* Главная: приветствие, цель/серия/искры, плитки-входы, слово дня, путь. */
(function () {
  const { esc, plural, fmt, toast } = SPK.ui;
  const { icon, flame, sparkFill, mascot } = SPK.art;
  const store = SPK.store;

  const wordOfDay = () => SPK.MEMES[Math.floor(Date.now() / 864e5) % SPK.MEMES.length];

  function path(s) {
    const items = SPK.SCENARIOS.map((sc, i) => {
      const locked = sc.cost > 0 && !s.unlocked.includes(sc.id), done = !!s.done[sc.id];
      return (i ? '<i class="mp-line' + (done ? ' on' : '') + '"></i>' : '')
        + '<a class="mp-n ' + (done ? 'done' : locked ? 'lock' : 'open') + '" href="#/dates" aria-label="' + esc(sc.title) + (done ? ', пройден' : locked ? ', закрыт' : '') + '">'
        + (locked ? icon('lock') : SPK.EMO[sc.id]) + '</a>';
    }).join('');
    return '<section class="card mini-path"><div class="mp-h"><h2 class="h3">Твой путь</h2><a class="link" href="#/dates">Все свидания' + icon('next') + '</a></div><div class="mp-row">' + items + '</div></section>';
  }

  SPK.views.home = function (root) {
    const s = store.get();
    const st = store.streak(s), w = wordOfDay();
    const next = SPK.SCENARIOS.find((x) => !s.done[x.id] && (!x.cost || s.unlocked.includes(x.id))) || SPK.SCENARIOS[0];
    const hour = new Date().getHours();
    const hi = hour < 5 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
    const doneN = SPK.SCENARIOS.filter((x) => s.done[x.id]).length;
    const saved = s.saved.includes(w.w);
    root.innerHTML = '<section class="page home">'
      + '<div class="card hello"><div class="hello-m">' + mascot('happy', 112) + '<span class="speech">Hi, ' + esc(s.name) + '!</span></div>'
      + '<div class="hello-t"><p class="eyebrow">' + esc(hi) + '</p><h1 class="h1" tabindex="-1">Готов поболтать <span class="mk">по-английски</span>?</h1>'
      + '<p class="lead">Сегодня ' + (st ? 'серия ' + st + ' ' + plural(st, 'день', 'дня', 'дней') + '. Не прерывай!' : 'отличный день начать серию.') + '</p>'
      + '<a class="btn pri big" href="#/dates/' + next.id + '">' + (s.done[next.id] ? 'Пройти ещё раз' : 'Продолжить') + ': ' + esc(next.title) + icon('next') + '</a></div></div>'
      + '<div class="stats3"><div class="card st-goal">' + SPK.parts.ring(s, 92) + '<span class="st-l">Цель дня</span></div>'
      + '<div class="card st-tile st-streak">' + flame('st-ic') + '<b>' + st + '</b><span class="st-l">' + plural(st, 'день', 'дня', 'дней') + ' подряд</span></div>'
      + '<a class="card st-tile st-sparks" href="#/sparks">' + sparkFill('st-ic') + '<b>' + fmt(s.sparks) + '</b><span class="st-l">искр</span></a></div>'
      + '<div class="tiles"><a class="tile t-dates" href="#/dates"><span class="tile-k">Раздел 1</span><h2 class="h2">Свидания</h2><p>Диалоги как в жизни. Отвечай, получай разбор.</p>'
      + '<div class="pv-chat" aria-hidden="true"><span class="b b-him">Shall we share a starter?</span><span class="b b-me">Good idea!</span></div>'
      + '<span class="tile-f"><b>' + doneN + ' из ' + SPK.SCENARIOS.length + '</b> пройдено<span class="go">' + icon('next') + '</span></span></a>'
      + '<a class="tile t-memes" href="#/memes"><span class="tile-k">Раздел 2</span><h2 class="h2">Мемы</h2><p>Слова из интернета: угадай значение за 5 карточек.</p>'
      + '<div class="pv-meme" aria-hidden="true"><span>RED FLAG</span><i>🚩</i></div>'
      + '<span class="tile-f"><b>' + s.saved.length + '</b> ' + plural(s.saved.length, 'слово', 'слова', 'слов') + ' в словаре<span class="go">' + icon('next') + '</span></span></a></div>'
      + '<section class="card wod"><div class="wod-e" aria-hidden="true">' + w.e + '</div><div class="wod-b"><p class="eyebrow">Слово дня</p><h2 class="h2"><span class="mk">' + esc(w.w) + '</span></h2>'
      + '<p class="wod-ru">' + esc(w.o[0]) + '. ' + esc(w.ru) + '</p><p class="ex"><span>Пример</span>' + esc(w.en) + '</p></div>'
      + '<button class="btn" data-save="' + esc(w.w) + '">' + icon('bookmark') + '<span>' + (saved ? 'Сохранено' : 'Сохранить') + '</span></button></section>'
      + path(s) + '<div class="stats-inline">' + SPK.parts.stats(s) + '</div></section>';

    root.onclick = (e) => {
      const b = e.target.closest('[data-save]');
      if (!b) return;
      const was = store.get().saved.includes(b.dataset.save);
      SPK.toggleSave(b.dataset.save);
      toast(was ? 'Слово убрано из словаря' : 'Слово «' + b.dataset.save + '» сохранено');
      SPK.views.home(root);
    };
    return () => { root.onclick = null; };
  };
})();
