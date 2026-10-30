/* Главная: герой с городом, цель-трубка, два билета-входа. */
(function () {
  const { esc, plural } = SPK.ui;
  const { icon, hero } = SPK.art;
  SPK.views = SPK.views || {};

  SPK.views.home = function (root) {
    const s = SPK.store.get();
    const total = SPK.SCENARIOS.length;
    const doneN = SPK.SCENARIOS.filter((x) => s.done[x.id]).length;
    const next = SPK.SCENARIOS.find((x) => !s.done[x.id] && (!x.cost || s.unlocked.includes(x.id))) || SPK.SCENARIOS[0];
    const hour = new Date().getHours();
    const hi = hour < 5 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
    root.innerHTML =
      '<section class="hero">' + hero()
      + '<div class="hero-in"><p class="eyebrow">Speakeasy · английский для свиданий</p>'
      + '<h1 class="hero-h" tabindex="-1">' + esc(hi) + ', ' + esc(s.name) + '.<br><em>Заговорим смелее?</em></h1>'
      + '<p class="hero-p">Репетируйте живые диалоги, учите слова из мемов и копите искры. Автор курса — ' + SPK.AUTHOR + '.</p>'
      + '<div class="hero-goal">' + SPK.parts.tube(s) + '</div>'
      + '<a class="btn pri big" href="#/dates/' + next.id + '">' + (s.done[next.id] ? 'Пройти ещё раз' : 'Продолжить') + ': ' + esc(next.title) + icon('next') + '</a></div></section>'
      + '<section class="tickets" aria-label="Разделы">'
      + ticket('dates', '01', 'Свидания', 'Диалоги-сценарии с выбором реплик, разбором ошибок и подсказками.', doneN + ' из ' + total + ' ' + plural(total, 'пройден', 'пройдено', 'пройдено'), 'dates')
      + ticket('memes', '02', 'Мемы', 'Карточки-полароиды: переверните, угадайте значение и сохраните слово.', s.saved.length + ' ' + plural(s.saved.length, 'слово', 'слова', 'слов') + ' в словаре', 'memes')
      + '</section><div class="stats-inline">' + SPK.parts.stats(s) + '</div>';
  };

  function ticket(route, no, title, text, meta, ic) {
    return '<a class="ticket t-' + route + '" href="#/' + route + '"><div class="t-main"><span class="t-no">№ ' + no + '</span><h2 class="t-h">' + title + '</h2><p>' + text + '</p></div>'
      + '<div class="t-stub">' + icon(ic, 'big-ic') + '<span class="t-meta">' + esc(meta) + '</span><span class="t-go">Войти' + icon('next') + '</span></div></a>';
  }
})();
