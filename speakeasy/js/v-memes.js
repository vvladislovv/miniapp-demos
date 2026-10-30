/* Мемы: словарь-галерея полароидов, сохранение слов, вход в раунд. */
(function () {
  const { esc, $$, dialog, plural } = SPK.ui;
  const { icon } = SPK.art;
  const store = SPK.store;

  /* фронт карточки: «фото» из градиента и эмодзи + подписи как у мема */
  function photo(m) {
    return '<div class="photo" style="--h:' + m.h + '"><span class="cap top">' + esc(m.top) + '</span><span class="emo" aria-hidden="true">' + m.e + '</span><span class="cap bot">' + esc(m.bot) + '</span></div>';
  }
  SPK.photo = photo;

  function toggleSave(word) {
    return store.update((s) => s.saved.includes(word) ? { ...s, saved: s.saved.filter((w) => w !== word) } : { ...s, saved: [...s.saved, word] });
  }
  SPK.toggleSave = toggleSave;

  SPK.views.memes = function (root, arg) {
    if (arg === 'play') return SPK.views.play(root);
    if (arg) return SPK.replace('memes');
    const s = store.get();
    root.innerHTML = '<section class="page"><header class="ph-head"><p class="eyebrow">Раздел 02</p><h1 class="page-h" tabindex="-1">Мемы</h1>'
      + '<p class="lead">' + SPK.MEMES.length + ' ' + plural(SPK.MEMES.length, 'слово', 'слова', 'слов') + ' из интернета. Откройте карточку, чтобы узнать значение, или запустите раунд из пяти слов.</p>'
      + '<a class="btn pri big" href="#/memes/play">Начать раунд' + icon('next') + '</a></header>'
      + '<div class="saved-line"><span>Ваш словарь: <b>' + s.saved.length + '</b> ' + plural(s.saved.length, 'слово', 'слова', 'слов') + '</span></div>'
      + '<div class="pgrid">' + SPK.MEMES.map((m, i) => {
        const saved = s.saved.includes(m.w);
        return '<button class="polaroid mini' + (saved ? ' saved' : '') + '" style="--r:' + (((i * 37) % 7) - 3) + 'deg" data-i="' + i + '" aria-label="' + esc(m.w) + (saved ? ', сохранено' : '') + '">' + photo(m)
          + '<span class="pl-t">' + esc(m.w) + (saved ? icon('bookmark', 'sv') : '') + '</span></button>';
      }).join('') + '</div></section>';
    $$('.polaroid', root).forEach((b) => b.addEventListener('click', () => detail(Number(b.dataset.i), root)));
  };

  async function detail(i, root) {
    const m = SPK.MEMES[i];
    const saved = store.get().saved.includes(m.w);
    const res = await dialog('<div class="polaroid dlg-card">' + photo(m) + '<span class="pl-t">' + esc(m.w) + '</span></div>'
      + '<h2 class="dlg-t">' + esc(m.q) + '</h2><p class="dlg-p">' + esc(m.ru) + '</p><p class="ex"><span>Пример</span>' + esc(m.en) + '</p>'
      + '<div class="dlg-b"><button class="btn ghost" value="close">Закрыть</button><button class="btn pri" value="save" autofocus>' + icon('bookmark') + (saved ? 'Убрать из словаря' : 'В словарь') + '</button></div>');
    if (res === 'save') { toggleSave(m.w); SPK.ui.toast(saved ? 'Слово убрано из словаря' : 'Слово «' + m.w + '» сохранено'); if (location.hash.startsWith('#/memes')) SPK.views.memes(root); }
  }
})();
