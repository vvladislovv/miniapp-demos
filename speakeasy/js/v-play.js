/* Раунд мемов: карточка-полароид переворачивается в квиз, затем смахивается. */
(function () {
  const { esc, $, $$, shuffle, confetti, reduced, plural } = SPK.ui;
  const { icon } = SPK.art;
  const store = SPK.store;
  const ROUND = 5;

  SPK.views.play = function (root) {
    const deck = shuffle(SPK.MEMES).slice(0, ROUND);
    let i = 0, right = 0, flipped = false, answered = false, swiping = false, order = [], timer = 0;

    function shell() {
      root.innerHTML = '<section class="page play"><header class="play-h"><button class="ib" data-act="exit" aria-label="Выйти из раунда">' + icon('back') + '</button>'
        + '<h1 class="page-h sm" tabindex="-1">Раунд мемов</h1><span class="cnt" id="cnt"></span></header>'
        + '<div class="steps" id="psteps" role="progressbar" aria-label="Прогресс раунда" aria-valuemin="0" aria-valuemax="' + ROUND + '" aria-valuenow="0">' + deck.map(() => '<i></i>').join('') + '</div>'
        + '<div class="stage" id="stage"></div><div class="verdict" id="verdict" aria-live="polite"></div></section>';
    }

    function card() {
      const m = deck[i];
      flipped = false; answered = false; swiping = false; order = shuffle([0, 1, 2]);
      $('#cnt', root).textContent = (i + 1) + ' / ' + ROUND;
      $$('#psteps i', root).forEach((el, k) => { el.className = k < i ? 'done' : k === i ? 'cur' : ''; });
      $('#psteps', root).setAttribute('aria-valuenow', String(i));
      $('#verdict', root).innerHTML = '';
      const st = $('#stage', root);
      st.innerHTML = '<div class="flipper enter" id="fl" style="--r:' + (i % 2 ? 2 : -2) + 'deg"><div class="face front polaroid">' + SPK.photo(m)
        + '<span class="pl-t">' + esc(m.w) + '</span></div>'
        + '<div class="face back polaroid" aria-hidden="true"><p class="q-l">Вопрос</p><h2 class="q">' + esc(m.q) + '</h2><div class="qopts">' + order.map((k, n) =>
          '<button class="opt" data-k="' + k + '" tabindex="-1"><span class="ob">' + (n + 1) + '</span><span class="ot">' + esc(m.o[k]) + '</span></button>').join('') + '</div></div></div>'
        + '<button class="btn pri big" id="flipbtn" data-act="flip">' + icon('flip') + 'Что это значит?</button>';
    }

    function flip() {
      if (flipped) return;
      flipped = true;
      $('#fl', root).classList.add('flipped');
      const back = $('.back', root);
      back.removeAttribute('aria-hidden');
      $$('.opt', back).forEach((b) => b.removeAttribute('tabindex'));
      $('.front', root).setAttribute('aria-hidden', 'true');
      $('#flipbtn', root).hidden = true;
      const first = $('.opt', back);
      setTimeout(() => first && first.focus(), reduced() ? 0 : 450);
    }

    function answer(k, btn) {
      if (!flipped || answered) return;
      answered = true;
      const m = deck[i], ok = k === 0;
      if (ok) right++;
      $$('.opt', root).forEach((b) => { b.disabled = true; b.classList.toggle('right', b.dataset.k === '0'); b.classList.toggle('wrong', !ok && b === btn); });
      const saved = store.get().saved.includes(m.w);
      store.update((s) => ok ? store.award(s, { xp: 10, sparks: 3, why: 'Мем «' + m.w + '»' }) : s);
      $('#verdict', root).innerHTML = '<div class="vd ' + (ok ? 'ok' : 'bad') + '"><h3>' + (ok ? 'Верно! +10 XP, +3 ✦' : 'Почти. Запомните значение') + '</h3><p>' + esc(m.ru) + '</p><p class="ex"><span>Пример</span>' + esc(m.en) + '</p>'
        + '<div class="vd-b"><button class="btn ghost" data-act="save">' + icon('bookmark') + '<span id="svt">' + (saved ? 'Сохранено' : 'Сохранить слово') + '</span></button>'
        + '<button class="btn pri" data-act="next" autofocus>' + (i + 1 >= ROUND ? 'Итоги' : 'Дальше') + icon('next') + '</button></div></div>';
      const nb = $('[data-act=next]', root);
      if (nb) { nb.focus({ preventScroll: true }); $('#verdict', root).scrollIntoView({ block: 'end', behavior: reduced() ? 'auto' : 'smooth' }); }
    }

    function swipe() {
      if (swiping || i >= ROUND) return;
      swiping = true;
      const fl = $('#fl', root);
      i++;
      if (!fl || reduced()) return i >= ROUND ? finish() : card();
      fl.classList.add('out');
      timer = setTimeout(() => (i >= ROUND ? finish() : card()), 380);
    }

    function finish() {
      const s = store.get();
      $$('#psteps i', root).forEach((el) => { el.className = 'done'; });
      $('#stage', root).innerHTML = '<div class="finish"><h2 class="fin-h">' + (right === ROUND ? 'Все слова ваши' : 'Раунд завершён') + '</h2><p class="fin-p">Верных ответов: <b>' + right + ' из ' + ROUND + '</b></p>'
        + '<div class="fin-r"><span>+' + right * 10 + ' XP</span><span>+' + right * 3 + ' ✦</span></div><p class="fin-p">В словаре: ' + s.saved.length + ' ' + plural(s.saved.length, 'слово', 'слова', 'слов') + '</p>'
        + '<div class="fin-b"><button class="btn pri" data-act="again">Ещё раунд</button><button class="btn ghost" data-act="exit">К словарю</button></div></div>';
      $('#verdict', root).innerHTML = '';
      if (right === ROUND) confetti();
    }

    function onClick(e) {
      const b = e.target.closest('[data-act], .opt, .face.front');
      if (!b) return;
      const act = b.dataset.act;
      if (b.classList.contains('opt')) answer(Number(b.dataset.k), b);
      else if (b.classList.contains('front') || act === 'flip') flip();
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
      if (['1', '2', '3'].includes(e.key) && flipped && !answered) { const bt = $$('.back .opt', root)[Number(e.key) - 1]; if (bt) bt.click(); }
      else if (e.key === ' ' && !flipped && deck[i] && /BODY|MAIN/.test(e.target.tagName)) { e.preventDefault(); flip(); }
      else if ((e.key === 'ArrowRight') && answered) swipe();
    }
    shell(); card();
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); root.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  };
})();
