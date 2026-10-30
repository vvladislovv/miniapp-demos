/* Общие блоки: неоновая трубка цели, календарь серии, сохранённые слова, мини-рейтинг. */
(function () {
  const { esc, fmt, plural } = SPK.ui;
  const { icon } = SPK.art;
  const store = SPK.store;

  function tube(s) {
    const goal = SPK.DAILY_GOAL, xp = Math.min(s.daily.xp, goal), pct = Math.round(xp / goal * 100);
    return '<div class="tube-wrap"><div class="tube" role="progressbar" aria-label="Дневная цель" aria-valuemin="0" aria-valuemax="' + goal + '" aria-valuenow="' + xp + '"><i style="--p:' + pct + '%"></i></div>'
      + '<p class="tube-t"><b>' + xp + '</b> / ' + goal + ' XP' + (xp >= goal ? ' · цель выполнена' : '') + '</p></div>';
  }

  function calendar(s) {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1), dim = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
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
    if (!list.length) return '<p class="empty-s">Пока пусто. Сохраняйте слова в разделе «Мемы», и они появятся здесь.</p>';
    return '<ul class="chips">' + list.map((w) => '<li>' + esc(w) + '</li>').join('') + '</ul>';
  }

  const RIVALS = [['Nika Voss', 1320, 330], ['Tom Ardent', 1180, 28], ['Lena Moro', 860, 195], ['Kai Ostrow', 540, 150], ['Ira Bell', 310, 275]];
  function board(s) {
    const rows = RIVALS.concat([[s.name, s.xp, 300, true]]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return '<ol class="board">' + rows.map((r, i) => '<li class="' + (r[3] ? 'me' : '') + '"><span class="pos">' + (i + 1) + '</span>' + SPK.art.avatar(r[0], r[2], 30)
      + '<span class="nm">' + esc(r[3] ? r[0] + ' (вы)' : r[0]) + '</span><span class="pts">' + fmt(r[1]) + ' XP</span></li>').join('') + '</ol>';
  }

  function stats(s) {
    const st = store.streak(s);
    return '<section class="panel"><h3 class="ph">Серия <span class="big">' + st + '</span> <small>' + plural(st, 'день', 'дня', 'дней') + '</small></h3>' + calendar(s) + '</section>'
      + '<section class="panel"><h3 class="ph">Цель на сегодня</h3>' + tube(s) + '</section>'
      + '<section class="panel"><h3 class="ph">Сохранённые слова <small>' + s.saved.length + '</small></h3>' + words(s, 8) + '</section>'
      + '<section class="panel"><h3 class="ph">Рейтинг недели</h3>' + board(s) + '</section>';
  }

  function sparkPill(s) {
    return '<a class="pill" href="#/sparks" aria-label="Искры: ' + s.sparks + '">' + icon('spark') + '<b class="sparks-n">' + fmt(s.sparks) + '</b></a>';
  }

  SPK.parts = { tube, calendar, words, board, stats, sparkPill };
})();
