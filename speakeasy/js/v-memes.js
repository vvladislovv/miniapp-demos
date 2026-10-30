/* Мемы: галерея карточек-мемов, сохранение слов, вход в раунд. */
(function () {
  const { esc, $$, dialog, plural } = SPK.ui;
  const { icon, mascot } = SPK.art;
  const store = SPK.store;

  /* карточка-мем: цветной фон по слову, подпись сверху и снизу, эмодзи в центре */
  const tone = (m) => 'c' + (SPK.MEMES.indexOf(m) % 5);
  SPK.memeCard = (m, cls) => '<div class="meme ' + tone(m) + (cls ? ' ' + cls : '') + '"><span class="cap">' + esc(m.top) + '</span><span class="emo" aria-hidden="true">' + m.e + '</span><span class="cap">' + esc(m.bot) + '</span></div>';

  SPK.toggleSave = (word) => store.update((s) => s.saved.includes(word) ? { ...s, saved: s.saved.filter((w) => w !== word) } : { ...s, saved: [...s.saved, word] });

  SPK.views.memes = function (root, arg) {
    if (arg === 'play') return SPK.views.play(root);
    if (arg) return SPK.replace('memes');
    const s = store.get();
    const cnt = SPK.MEMES.length + ' ' + plural(SPK.MEMES.length, 'слово', 'слова', 'слов');
    root.innerHTML = '<section class="page"><header class="ph-head card tone-lilac"><div><p class="eyebrow">Раздел 2</p><h1 class="h1" tabindex="-1">Мемы</h1>'
      + '<p class="lead">' + cnt + ' из интернета. Играй раундами по 5 карточек или открой любую, чтобы узнать значение.</p>'
      + '<a class="btn pri big" href="#/memes/play">Начать раунд' + icon('next') + '</a></div>' + mascot('happy', 104) + '</header>'
      + '<div class="saved-line"><span>Мой словарь: <b>' + s.saved.length + '</b> ' + plural(s.saved.length, 'слово', 'слова', 'слов') + '</span></div>'
      + '<div class="mgrid">' + SPK.MEMES.map((m, i) => {
        const saved = s.saved.includes(m.w);
        return '<button class="mcard' + (saved ? ' saved' : '') + '" data-i="' + i + '" aria-label="' + esc(m.w) + (saved ? ', сохранено' : '') + '">' + SPK.memeCard(m)
          + '<span class="mc-t"><span class="mk">' + esc(m.w) + '</span>' + (saved ? icon('bookmark', 'sv') : '') + '</span></button>';
      }).join('') + '</div></section>';
    $$('.mcard', root).forEach((b) => b.addEventListener('click', () => detail(Number(b.dataset.i), root)));
  };

  async function detail(i, root) {
    const m = SPK.MEMES[i];
    const saved = store.get().saved.includes(m.w);
    const res = await dialog(SPK.memeCard(m, 'in-dlg') + '<h2 class="dlg-t">' + esc(m.q) + '</h2><p class="dlg-p"><b>' + esc(m.o[0]) + '.</b> ' + esc(m.ru) + '</p><p class="ex"><span>Пример</span>' + esc(m.en) + '</p>'
      + '<div class="dlg-b"><button class="btn ghost" value="close">Закрыть</button><button class="btn pri" value="save" autofocus>' + icon('bookmark') + (saved ? 'Убрать из словаря' : 'Сохранить слово') + '</button></div>');
    if (res === 'save') {
      SPK.toggleSave(m.w);
      SPK.ui.toast(saved ? 'Слово убрано из словаря' : 'Слово «' + m.w + '» сохранено');
      if (location.hash.startsWith('#/memes')) SPK.views.memes(root);
    }
  }
})();
