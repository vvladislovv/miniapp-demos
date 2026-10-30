/* Раунд мемов: карточка-мем, варианты ответа, после ответа карточка переворачивается с разбором. */
(function () {
  const { esc, $, $$, shuffle, confetti, reduced, plural } = SPK.ui;
  const { icon, mascot } = SPK.art;
  const store = SPK.store;
  const ROUND = 5, LETTERS = ['A', 'B', 'C'];

  SPK.views.play = function (root) {
    const deck = shuffle(SPK.MEMES).slice(0, ROUND);
    let i = 0, right = 0, answered = false, swiping = false, order = [], timer = 0;

    const shell = () => {
      root.innerHTML = '<section class="page play"><header class="play-h"><button class="ib" data-act="exit" aria-label="Выйти из раунда">' + icon('back') + '</button>'
        + '<div class="steps" id="psteps" role="progressbar" aria-label="Прогресс раунда" aria-valuemin="0" aria-valuemax="' + ROUND + '" aria-valuenow="0">' + deck.map(() => '<i></i>').join('') + '</div>'
        + '<span class="cnt" id="cnt"></span></header><h1 class="sr" tabindex="-1">Раунд мемов</h1>'
        + '<div class="stage" id="stage"></div></section>';
    };

    function card() {
      const m = deck[i];
      answered = false; swiping = false; order = shuffle([0, 1, 2]);
      $('#cnt', root).textContent = (i + 1) + ' / ' + ROUND;
      $$('#psteps i', root).forEach((el, k) => { el.className = k < i ? 'done' : k === i ? 'cur' : ''; });
      $('#psteps', root).setAttribute('aria-valuenow', String(i));
      $('#stage', root).innerHTML = '<div class="flipper enter" id="fl"><div class="face front">' + SPK.memeCard(m, 'big') + '</div>'
        + '<div class="face back" aria-hidden="true"><div class="back-in"><span class="back-m" id="bm"></span><p class="eyebrow">Значение</p><h2 class="h2"><span class="mk">' + esc(m.w) + '</span></h2>'
        + '<p class="bk-ru"><b>' + esc(m.o[0]) + '.</b> ' + esc(m.ru) + '</p><p class="ex"><span>Пример</span>' + esc(m.en) + '</p>'
        + '<button class="btn" data-act="save">' + icon('bookmark') + '<span id="svt">' + (store.get().saved.includes(m.w) ? 'Сохранено' : 'Сохранить слово') + '</span></button></div></div></div>'
        + '<h2 class="q">' + esc(m.q) + '</h2><div class="qopts" id="qopts">' + order.map((k, n) =>
          '<button class="opt" data-k="' + k + '"><span class="ob">' + LETTERS[n] + '</span><span class="ot">' + esc(m.o[k]) + '</span></button>').join('') + '</div>'
        + '<div class="verdict" id="verdict" aria-live="polite"></div>';
    }

    function answer(k, btn) {
      if (answered) return;
      answered = true;
      const m = deck[i], ok = k === 0;
      if (ok) right++;
      $$('.opt', root).forEach((b) => { b.disabled = true; b.classList.toggle('right', b.dataset.k === '0'); b.classList.toggle('wrong', !ok && b === btn); });
      store.update((s) => ok ? store.award(s, { xp: 10, sparks: 3, why: 'Мем «' + m.w + '»' }) : s);
      $('#bm', root).innerHTML = mascot(ok ? 'happy' : 'sad', 76);
      const fl = $('#fl', root);
      fl.classList.add('flipped');
      $('.back', fl).removeAttribute('aria-hidden');
      $('.front', fl).setAttribute('aria-hidden', 'true');
      if (ok) confetti(true);
      $('#verdict', root).innerHTML = '<div class="vd ' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? 'Верно! +10 XP, +3 ✦' : 'Почти! Запомни значение выше') + '</b>'
        + '<button class="btn pri" data-act="next">' + (i + 1 >= ROUND ? 'Итоги' : 'Дальше') + icon('next') + '</button></div>';
      const nb = $('[data-act=next]', root);
      if (nb) { nb.focus({ preventScroll: true }); $('#verdict', root).scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); }
    }

    function swipe() {
      if (swiping || i >= ROUND) return;
      swiping = true;
      const fl = $('#fl', root);
      i++;
      if (!fl || reduced()) return i >= ROUND ? finish() : card();
      fl.classList.add('out');
      timer = setTimeout(() => (i >= ROUND ? finish() : card()), 300);
    }

    function finish() {
      const s = store.get();
      $$('#psteps i', root).forEach((el) => { el.className = 'done'; });
      $('#stage', root).innerHTML = '<div class="card finish">' + mascot(right >= 4 ? 'party' : right >= 2 ? 'happy' : 'sad', 128, 'fin-m') + '<h2 class="h1">' + (right === ROUND ? 'Все слова твои!' : 'Раунд завершён') + '</h2>'
        + '<p class="fin-p">Верных ответов: <b>' + right + ' из ' + ROUND + '</b></p>'
        + '<div class="fin-r"><span>+' + right * 10 + ' XP</span><span>+' + right * 3 + ' ✦</span></div><p class="fin-p">В словаре: ' + s.saved.length + ' ' + plural(s.saved.length, 'слово', 'слова', 'слов') + '</p>'
        + '<div class="fin-b"><button class="btn pri" data-act="again">Ещё раунд</button><button class="btn ghost" data-act="exit">К словарю</button></div></div>';
      if (right >= 4) confetti();
    }

    function onClick(e) {
      const b = e.target.closest('[data-act], .opt');
      if (!b) return;
      const act = b.dataset.act;
      if (b.classList.contains('opt')) answer(Number(b.dataset.k), b);
      else if (act === 'save') {
        const m = deck[i], was = store.get().saved.includes(m.w);
        SPK.toggleSave(m.w);
        $('#svt', root).textContent = was ? 'Сохранить слово' : 'Сохранено';
      } else if (act === 'next') swipe();
      else if (act === 'again') SPK.rerender();
      else if (act === 'exit') SPK.go('memes');
    }
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || document.querySelector('dialog[open]')) return;
      if (e.key === 'Escape') return SPK.go('memes');
      const idx = ['1', '2', '3'].indexOf(e.key);
      if (idx >= 0 && !answered && i < ROUND) { const bt = $$('.opt', root)[idx]; if (bt) bt.click(); }
      else if ((e.key === 'ArrowRight' || e.key === 'Enter') && answered && !/BUTTON|A/.test(e.target.tagName)) swipe();
    }
    shell(); card();
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); root.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  };
})();
