/* Чат-диалог: мессенджер с «печатает…», крупными вариантами, подсказкой, переводом и разбором ошибок. */
(function () {
  const { esc, $, $$, shuffle, toast, confetti, reduced } = SPK.ui;
  const { icon, avatar, mascot, star } = SPK.art;
  const store = SPK.store;
  const LETTERS = ['A', 'B', 'C'];
  const OK_MOOD = ['happy', 'wink'];

  SPK.views.chat = function (root, id) {
    const sc = SPK.SCENARIOS.find((x) => x.id === id);
    const s0 = store.get();
    if (!sc) { toast('Такого сценария нет'); return SPK.replace('dates'); }
    if (sc.cost && !s0.unlocked.includes(id)) { toast('Сценарий закрыт: откройте его за искры'); return SPK.replace('dates'); }

    const orders = sc.steps.map(() => shuffle([0, 1, 2]));
    const timers = new Set();
    let step = 0, correct = 0, busy = true, showRu = false, hintUsed = false, finished = false;
    const mistakes = [];
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, reduced() ? Math.min(ms, 80) : ms); timers.add(t); };

    root.innerHTML = '<section class="chat" aria-label="Диалог: ' + esc(sc.title) + '">'
      + '<header class="chat-h"><button class="ib" data-act="back" aria-label="Назад к сценариям">' + icon('back') + '</button>'
      + '<div class="who">' + avatar(sc.who, sc.hue, 44, SPK.EMO_WHO[sc.id]) + '<div><h1 class="who-n" tabindex="-1">' + esc(sc.who) + '</h1><small>' + esc(sc.title) + ' · ' + sc.lvl + '</small></div></div>'
      + '<div class="chat-tools"><button class="chip-b" data-act="tr" aria-pressed="false" title="Показать перевод на русский">' + icon('translate') + '<span>RU</span></button>'
      + '<button class="chip-b" data-act="hint" aria-label="Подсказка за ' + SPK.HINT_COST + ' искр">' + icon('bulb') + '<span><span class="hl">Подсказка · </span>' + SPK.HINT_COST + ' ✦</span></button></div></header>'
      + '<div class="steps" id="steps" role="progressbar" aria-label="Прогресс диалога" aria-valuemin="0" aria-valuemax="' + sc.steps.length + '" aria-valuenow="0">' + sc.steps.map(() => '<i></i>').join('') + '</div>'
      + '<div class="feed" id="feed" role="log" aria-live="polite"></div><div class="opts" id="opts"></div></section>';

    const feed = $('#feed', root), opts = $('#opts', root), steps = $('#steps', root);
    const scroll = () => { feed.scrollTo({ top: feed.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' }); };
    const setSteps = () => {
      $$('i', steps).forEach((el, i) => el.className = i < step ? 'done' : i === step ? 'cur' : '');
      steps.setAttribute('aria-valuenow', String(step));
    };

    function addMsg(side, html, cls) {
      const el = document.createElement('div');
      el.className = 'msg ' + side + (cls ? ' ' + cls : '');
      el.innerHTML = html;
      feed.appendChild(el);
      scroll();
      return el;
    }
    const himHtml = (st) => avatar(sc.who, sc.hue, 34, SPK.EMO_WHO[sc.id]) + '<div class="bub"><p class="en">' + esc(st.him) + '</p><p class="ru' + (showRu ? ' on' : '') + '">' + esc(st.ru) + '</p>'
      + '<button class="tr-b" data-act="trone" aria-label="Показать перевод реплики">перевод</button></div>';

    function say() {
      busy = true; opts.innerHTML = ''; setSteps();
      const st = sc.steps[step];
      const typing = addMsg('him', avatar(sc.who, sc.hue, 34, SPK.EMO_WHO[sc.id]) + '<div class="bub typing" aria-label="' + esc(sc.who) + ' печатает"><i></i><i></i><i></i></div>');
      later(() => { typing.remove(); addMsg('him', himHtml(st)); showOpts(); }, 900);
    }

    function showOpts() {
      const st = sc.steps[step];
      hintUsed = false; busy = false;
      opts.innerHTML = '<p class="opts-h">Ваш ответ <span>клавиши 1–3</span></p>' + orders[step].map((k, i) =>
        '<button class="opt" data-k="' + k + '"><span class="ob">' + LETTERS[i] + '</span><span class="ot">' + esc(st.opts[k][0]) + '</span></button>').join('');
      $$('.opt', opts).forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.k), b)));
      refreshHint();
    }

    function choose(k, btn) {
      if (busy) return;
      busy = true;
      const st = sc.steps[step], ok = k === 0;
      $$('.opt', opts).forEach((b) => { b.disabled = true; b.classList.toggle('right', b.dataset.k === '0'); b.classList.toggle('wrong', !ok && b === btn); });
      addMsg('me', '<div class="bub"><p class="en">' + esc(st.opts[k][0]) + '</p></div>', ok ? 'ok' : 'bad');
      if (ok) {
        correct++;
        addMsg('note', '<div class="note ok">' + mascot(OK_MOOD[step % 2], 64) + '<span><b>' + ['Верно!', 'Отлично!', 'Супер!', 'В точку!'][step % 4] + '</b> ' + esc(st.opts[0][1]) + '</span></div>');
        confetti(true);
        later(scroll, 60);
        later(next, 1500);
      } else {
        mistakes.push({ him: st.him, mine: st.opts[k][0], right: st.opts[0][0], why: st.opts[k][1], tip: st.opts[0][1] });
        addMsg('note', '<div class="note bad">' + mascot('sad', 64) + '<span><b>Лучше сказать:</b> <span class="mk">' + esc(st.opts[0][0]) + '</span><br>' + esc(st.opts[k][1]) + '</span></div>');
        opts.insertAdjacentHTML('beforeend', '<button class="btn pri big next-b" data-act="next">Дальше' + icon('next') + '</button>');
        $('[data-act=next]', opts).focus({ preventScroll: true });
        later(scroll, 60);
      }
      refreshHint();
    }

    function next() {
      step++;
      if (step >= sc.steps.length) return finish();
      say();
    }

    function refreshHint() {
      const b = $('[data-act=hint]', root);
      if (b) b.disabled = busy || hintUsed || finished;
    }

    function hint() {
      if (busy || hintUsed) return;
      const cur = store.get();
      if (cur.sparks < SPK.HINT_COST) { toast('Не хватает искр для подсказки'); return; }
      store.update((c) => store.spend(c, SPK.HINT_COST, 'Подсказка: «' + sc.title + '»'));
      hintUsed = true;
      const right = $('.opt[data-k="0"]', opts);
      if (right) right.classList.add('hinted');
      toast('Подсказка: верный вариант подсвечен');
      refreshHint();
    }

    function finish() {
      finished = true; busy = true; setSteps();
      $$('i', steps).forEach((el) => { el.className = 'done'; });
      steps.setAttribute('aria-valuenow', String(sc.steps.length));
      opts.innerHTML = '';
      const total = sc.steps.length, flawless = correct === total;
      const first = !store.get().done[sc.id];
      const gainXp = correct * 10 + 20, gainSp = first ? correct * 5 + (flawless ? 15 : 0) : 0;
      const stars = flawless ? 3 : correct >= total - 1 ? 2 : 1;
      store.update((cur) => {
        const prev = cur.done[sc.id] || { best: 0, runs: 0, flawless: false };
        const done = { ...cur.done, [sc.id]: { best: Math.max(prev.best, correct), runs: prev.runs + 1, flawless: prev.flawless || flawless } };
        return { ...store.award(cur, { xp: gainXp, sparks: gainSp, why: 'Свидание «' + sc.title + '»' }), done };
      });
      if (flawless) confetti();
      const rev = mistakes.length ? '<h3 class="rev-h">Разбор ошибок</h3><ul class="rev">' + mistakes.map((m) =>
        '<li><p class="rv-q">' + esc(m.him) + '</p><p class="rv-bad">' + icon('x') + esc(m.mine) + '</p><p class="rv-ok">' + icon('check') + '<span class="mk">' + esc(m.right) + '</span></p><p class="rv-w">' + esc(m.why) + '</p></li>').join('') + '</ul>'
        : '<p class="rev-none">Ни одной ошибки. Так держать!</p>';
      const card = addMsg('note', '<section class="finish" aria-label="Итоги">' + mascot(flawless ? 'party' : correct >= total / 2 ? 'happy' : 'sad', 128, 'fin-m') + '<div class="fin-stars" aria-label="Звёзд: ' + stars + ' из 3">' + [1, 2, 3].map((i) => star(i <= stars)).join('') + '</div>'
        + '<h2 class="fin-h">' + (flawless ? 'Идеальное свидание' : 'Свидание завершено') + '</h2>'
        + '<p class="fin-p">Верных ответов: <b>' + correct + ' из ' + total + '</b></p>'
        + '<div class="fin-r"><span>+' + gainXp + ' XP</span><span>' + (gainSp ? '+' + gainSp + ' ✦' : 'искры только за первый проход') + '</span></div>'
        + rev + '<div class="fin-b"><button class="btn pri" data-act="again">Ещё раз</button><button class="btn ghost" data-act="back">К сценариям</button></div></section>');
      card.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
      refreshHint();
    }

    function onClick(e) {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const act = b.dataset.act;
      if (act === 'back') SPK.go('dates');
      else if (act === 'tr') { showRu = !showRu; b.setAttribute('aria-pressed', String(showRu)); $$('.msg.him .ru', feed).forEach((el) => el.classList.toggle('on', showRu)); }
      else if (act === 'trone') b.parentElement.querySelector('.ru').classList.toggle('on');
      else if (act === 'hint') hint();
      else if (act === 'next') next();
      else if (act === 'again') SPK.rerender();
    }
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return;
      const idx = ['1', '2', '3'].indexOf(e.key);
      if (idx >= 0 && !busy) { const b = $$('.opt', opts)[idx]; if (b) b.click(); }
      else if (e.key === 'Escape' && !document.querySelector('dialog[open]')) SPK.go('dates');
    }
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    say();
    return () => { timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey); root.removeEventListener('click', onClick); };
  };
})();
