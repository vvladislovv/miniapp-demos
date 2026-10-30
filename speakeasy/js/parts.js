/* Общие блоки: кольцо цели, календарь серии, слова, мини-рейтинг, правая колонка. */
(function () {
  const { esc, fmt, plural } = SPK.ui;
  const { flame, sparkFill, avatar } = SPK.art;
  const store = SPK.store;

  function ring(s, size) {
    const goal = SPK.DAILY_GOAL, xp = Math.min(s.daily.xp, goal), pct = xp / goal, r = 42, c = 2 * Math.PI * r;
    return '<div class="ring" style="--sz:' + (size || 112) + 'px" role="progressbar" aria-label="Дневная цель" aria-valuemin="0" aria-valuemax="' + goal + '" aria-valuenow="' + xp + '">'
      + '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="' + r + '" class="rg-t"/><circle cx="50" cy="50" r="' + r + '" class="rg-p" stroke-dasharray="' + (c * pct).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg>'
      + '<span class="rg-c"><b>' + xp + '</b><small>из ' + goal + ' XP</small></span></div>';
  }

  function calendar(s) {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    const lead = (new Date(y, m, 1).getDay() + 6) % 7;
    const set = new Set(s.days), todayN = now.getDate();
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span class="cd blank"></span>';
    for (let d = 1; d <= dim; d++) {
      const on = set.has(store.dayKey(new Date(y, m, d)));
      cells += '<span class="cd' + (on ? ' on' : '') + (d === todayN ? ' today' : '') + '"' + (on ? ' aria-label="' + d + ' — занятие было"' : '') + '>' + d + '</span>';
    }
    const title = now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    return '<div class="cal"><div class="cal-h">' + esc(title.charAt(0).toUpperCase() + title.slice(1)) + '</div><div class="cal-g">'
      + ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((x) => '<span class="cw">' + x + '</span>').join('') + cells + '</div></div>';
  }

  function words(s, limit) {
    const list = s.saved.slice(-limit).reverse();
    if (!list.length) return '<p class="empty-s">Пока пусто. Сохраняйте слова в «Мемах», и они появятся здесь.</p>';
    return '<ul class="chips">' + list.map((w) => '<li>' + esc(w) + '</li>').join('') + '</ul>';
  }

  const RIVALS = [['Nika Voss', 1320], ['Tom Ardent', 1180], ['Lena Moro', 860], ['Kai Ostrow', 540], ['Ira Bell', 310]];
  function board(s) {
    const rows = RIVALS.concat([[s.name, s.xp, true]]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return '<ol class="board">' + rows.map((r, i) => '<li class="' + (r[2] ? 'me' : '') + '"><span class="pos">' + (i + 1) + '</span>' + avatar(r[0], i * 2 + 1, 32)
      + '<span class="nm">' + esc(r[2] ? r[0] + ' (вы)' : r[0]) + '</span><span class="pts">' + fmt(r[1]) + ' XP</span></li>').join('') + '</ol>';
  }

  function stats(s) {
    const st = store.streak(s);
    return '<section class="panel pn-streak"><h3 class="ph">' + flame('ph-ic') + '<span class="big">' + st + '</span> ' + plural(st, 'день', 'дня', 'дней') + ' подряд</h3>' + calendar(s) + '</section>'
      + '<section class="panel pn-goal"><h3 class="ph">Цель на сегодня</h3><div class="goal-row">' + ring(s, 96) + '<p>' + (s.daily.xp >= SPK.DAILY_GOAL ? 'Цель выполнена. Отличная работа!' : 'Ещё ' + (SPK.DAILY_GOAL - s.daily.xp) + ' XP до цели. Одного диалога хватит.') + '</p></div></section>'
      + '<section class="panel"><h3 class="ph">Мои слова <small>' + s.saved.length + '</small></h3>' + words(s, 8) + '</section>'
      + '<section class="panel"><h3 class="ph">Рейтинг недели</h3>' + board(s) + '</section>';
  }

  const sparkPill = (s) => '<a class="pill" href="#/sparks" aria-label="Искры: ' + s.sparks + '">' + sparkFill() + '<b class="sparks-n">' + fmt(s.sparks) + '</b></a>';

  SPK.parts = { ring, calendar, words, board, stats, sparkPill };
})();
