/* Профиль: имя, уровень, XP, достижения-стикеры, слова, сброс. */
(function () {
  const { esc, $, $$, confirm, toast, fmt } = SPK.ui;
  const { icon, avatar, mascot } = SPK.art;
  const store = SPK.store;

  const ACH = [
    ['💘', 'Первое свидание', 'Завершите любой сценарий', (s) => Object.keys(s.done).length >= 1],
    ['🎯', 'Без единой ошибки', 'Пройдите диалог без ошибок', (s) => Object.values(s.done).some((d) => d.flawless)],
    ['🔥', 'Серия 3 дня', 'Занимайтесь три дня подряд', (s) => store.streak(s) >= 3],
    ['📚', 'Коллекционер слов', 'Сохраните 5 слов из мемов', (s) => s.saved.length >= 5],
    ['🔓', 'Вечер на широкую ногу', 'Откройте платный сценарий', (s) => s.unlocked.length >= 1],
    ['🏆', 'Опытный болтун', 'Наберите 500 XP', (s) => s.xp >= 500]
  ];
  const ACH_TONE = ['tomato', 'mint', 'lemon', 'lilac', 'pink', 'lemon'];

  SPK.views.profile = function (root, arg) {
    if (arg) return SPK.replace('profile');
    const s = store.get();
    const lvlXp = s.xp % 120;
    const got = ACH.filter((a) => a[3](s)).length;
    root.innerHTML = '<section class="page"><header class="card prof-h">' + avatar(s.name, 3, 84, '😎') + '<div><p class="eyebrow">Профиль</p><h1 class="h1" tabindex="-1">' + esc(s.name) + '</h1>'
      + '<p class="lead">Уровень ' + store.level(s) + ' · английский ' + esc(s.level) + '</p>'
      + '<div class="xpbar" role="progressbar" aria-label="Опыт до следующего уровня" aria-valuemin="0" aria-valuemax="120" aria-valuenow="' + lvlXp + '"><i style="--p:' + Math.round(lvlXp / 120 * 100) + '%"></i></div>'
      + '<p class="xp-t">' + fmt(s.xp) + ' XP · ещё ' + (120 - lvlXp) + ' до уровня ' + (store.level(s) + 1) + '</p></div></header>'
      + '<div class="kpis"><div class="tone-tomato"><b>' + store.streak(s) + '</b><span>серия дней</span></div><div class="tone-lemon"><b>' + fmt(s.xp) + '</b><span>всего XP</span></div><div class="tone-mint"><b>' + Object.keys(s.done).length + '</b><span>свиданий</span></div><div class="tone-lilac"><b>' + s.saved.length + '</b><span>слов</span></div></div>'
      + '<form class="card form" id="pf" autocomplete="off"><label for="nm">Ваше имя</label><div class="row"><input id="nm" name="name" maxlength="24" value="' + esc(s.name) + '" placeholder="Как вас называть?"><button class="btn pri" type="submit">Сохранить</button></div>'
      + '<fieldset class="lvsel"><legend>Уровень английского</legend>' + ['A2', 'B1', 'B2'].map((l) => '<label class="lv"><input type="radio" name="level" value="' + l + '"' + (l === s.level ? ' checked' : '') + '><span>' + l + '</span></label>').join('') + '</fieldset></form>'
      + '<h2 class="h2 sec-h">Достижения <small>' + got + ' из ' + ACH.length + '</small></h2><ul class="ach">' + ACH.map((a, i) => { const on = a[3](s); return '<li class="' + (on ? 'on tone-' + ACH_TONE[i] : '') + '"><span class="sticker" aria-hidden="true">' + (on ? a[0] : icon('lock')) + '</span><b>' + a[1] + '</b><small>' + a[2] + '</small><span class="sr">' + (on ? 'получено' : 'закрыто') + '</span></li>'; }).join('') + '</ul>'
      + '<h2 class="h2 sec-h">Мои слова <small>' + s.saved.length + '</small></h2>'
      + (s.saved.length ? '<ul class="wlist">' + s.saved.map((w) => '<li><span>' + esc(w) + '</span><button class="ib sm" data-w="' + esc(w) + '" aria-label="Удалить слово ' + esc(w) + '">' + icon('x') + '</button></li>').join('') + '</ul>' : '<div class="card empty">' + mascot('wink', 80) + '<p>Словарь пуст. Сохраняйте слова в разделе «Мемы».</p></div>')
      + '<h2 class="h2 sec-h">Данные</h2><button class="btn danger" data-act="reset">' + icon('trash') + 'Сбросить прогресс</button></section>';

    $('#pf', root).addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#nm', root).value.trim().slice(0, 24);
      if (!name) { toast('Введите имя'); return; }
      store.update((c) => ({ ...c, name }));
      toast('Имя сохранено'); SPK.views.profile(root);
    });
    $$('input[name=level]', root).forEach((r) => r.addEventListener('change', () => { store.update((c) => ({ ...c, level: r.value })); toast('Уровень: ' + r.value); SPK.views.profile(root); }));
    root.onclick = async (e) => {
      const w = e.target.closest('[data-w]');
      if (w) { store.update((c) => ({ ...c, saved: c.saved.filter((x) => x !== w.dataset.w) })); return SPK.views.profile(root); }
      if (e.target.closest('[data-act=reset]')) {
        const ok = await confirm({ title: 'Сбросить прогресс?', body: 'Искры, XP, серия, слова и пройденные сценарии вернутся к начальным значениям.', ok: 'Сбросить', danger: true });
        if (ok) { store.reset(); toast('Прогресс сброшен'); SPK.views.profile(root); }
      }
    };
    return () => { root.onclick = null; };
  };
})();
