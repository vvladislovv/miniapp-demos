/* Out of Box — логика приложения. Состояние хранится в localStorage. */
(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = 'oob_state_v1';
  const GEMS_PER_ANSWER = 5;
  const HINT_COST = 2;
  const DAILY_BONUS = 20;
  const MEME_ROUND = 6;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const dayKey = (offset = 0) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

  const defaults = () => ({
    name: 'Гость', lvl: 'A2', gems: 999, xp: 0, streak: 0, lastDay: '', daily: '',
    done: {}, unlocked: {}, words: [], memeRounds: 0, ok: 0, total: 0,
    hist: [{ t: 'Стартовый бонус', v: 999, d: Date.now() }]
  });
  let S = load();
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      return raw && typeof raw === 'object' ? { ...defaults(), ...raw } : defaults();
    } catch { return defaults(); }
  }
  function set(patch) {
    S = { ...S, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* приватный режим */ }
  }
  const addGems = (v, why) => set({ gems: S.gems + v, hist: [{ t: why, v, d: Date.now() }, ...S.hist].slice(0, 30) });
  function touchStreak() {
    const t = dayKey();
    if (S.lastDay === t) return;
    set({ lastDay: t, streak: S.lastDay === dayKey(1) ? S.streak + 1 : 1 });
  }
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  let route = 'home';
  let sess = null; // диалог
  let meme = null; // раунд мемов
  const ss = (patch) => { sess = { ...sess, ...patch }; };
  const ms = (patch) => { meme = { ...meme, ...patch }; };

  /* ---------- Главная ---------- */
  function home() {
    return `<div class="home">
      <div class="hero"><h1 class="title"><span class="l1">Out of Box</span><span class="l2">by Marina</span><span class="l3">Kar</span></h1>${londonSvg()}</div>
      <div class="home-menu">
        <button class="gold-btn" data-go="dating">Dating English</button>
        <div class="row-wing"><button class="gold-btn" data-go="memes">English by Memes</button>${ICON.wing}</div>
      </div>
      <div class="hello"><span>Привет, ${esc(S.name)}!</span><span>🔥 серия: ${S.streak}</span></div>
    </div>`;
  }

  /* ---------- Dating English ---------- */
  function dating() {
    const cards = SCENARIOS.map((sc) => {
      const locked = sc.cost > 0 && !S.unlocked[sc.id];
      const done = S.done[sc.id];
      const badge = locked ? `<span class="pill">🔒 ${sc.cost} 💎</span>`
        : done !== undefined ? `<span class="pill fill">✓ ${done}/${sc.steps.length}</span>` : `<span class="pill">${sc.lvl}</span>`;
      return `<button class="card sc" data-act="start" data-id="${sc.id}"><span class="em">${sc.emoji}</span>
        <span class="tx"><b>${sc.title}</b><small>${sc.sub} · ${sc.lvl}</small></span>${badge}</button>`;
    }).join('');
    return `<div class="page"><div class="topbar"><button class="back" data-go="home" aria-label="Назад">${ICON.back}</button></div>
      <h2>Dating English</h2><p class="sub">Выбирайте ответы в диалоге. За верный ответ +${GEMS_PER_ANSWER} 💎, подсказка стоит ${HINT_COST} 💎.</p>${cards}</div>`;
  }

  function askUnlock(sc) {
    $('#sheet').innerHTML = `<div class="sheet-bg"><div class="sheet"><h3>${sc.emoji} ${sc.title}</h3>
      <p>Сценарий уровня ${sc.lvl}. Открыть за ${sc.cost} 💎? У вас ${S.gems} 💎.</p>
      <div class="actions"><button class="gold-btn ghost" data-act="closeSheet">Не сейчас</button>
      <button class="gold-btn" data-act="unlock" data-id="${sc.id}">Открыть</button></div></div></div>`;
  }
  const closeSheet = () => { $('#sheet').innerHTML = ''; };

  function stepState(sc, i) {
    const st = sc.steps[i];
    return {
      i, typing: true, chosen: null, off: null,
      opts: shuffle(st.opts.map((o, k) => ({ t: o[0], why: o[1], ok: k === 0 }))),
      log: [{ him: true, t: st.him, ru: st.ru }]
    };
  }
  let typingTimer = 0;
  function startTyping() {
    clearTimeout(typingTimer);
    const cur = sess;
    typingTimer = setTimeout(() => {
      if (sess === cur && route === 'chat') { ss({ typing: false }); render(); }
    }, 650);
  }
  function startScenario(id) {
    const sc = SCENARIOS.find((x) => x.id === id);
    if (!sc) return;
    if (sc.cost > 0 && !S.unlocked[id]) { askUnlock(sc); return; }
    sess = { sc, right: 0, earned: 0, tr: false, finished: false, ...stepState(sc, 0) };
    route = 'chat';
    render();
    startTyping();
  }
  function pick(i) {
    if (!sess || sess.typing || sess.chosen !== null || sess.finished) return;
    const o = sess.opts[i];
    if (!o) return;
    touchStreak();
    set({ total: S.total + 1, ok: S.ok + (o.ok ? 1 : 0), xp: S.xp + (o.ok ? 10 : 2) });
    if (o.ok) addGems(GEMS_PER_ANSWER, 'Верный ответ');
    ss({ chosen: i, log: [...sess.log, { me: true, t: o.t }], right: sess.right + (o.ok ? 1 : 0), earned: sess.earned + (o.ok ? GEMS_PER_ANSWER : 0) });
    render();
  }
  function hint() {
    if (!sess || sess.typing || sess.chosen !== null || sess.off !== null) return;
    if (S.gems < HINT_COST) { toast('Не хватает кристаллов'); return; }
    addGems(-HINT_COST, 'Подсказка');
    ss({ off: sess.opts.findIndex((o) => !o.ok) });
    render();
  }
  function next() {
    if (!sess || sess.chosen === null) return;
    const { sc } = sess;
    if (sess.i + 1 < sc.steps.length) {
      const nextStep = stepState(sc, sess.i + 1);
      ss({ ...nextStep, log: [...sess.log, ...nextStep.log] });
      render();
      startTyping();
      return;
    }
    const perfect = sess.right === sc.steps.length;
    const prev = S.done[sc.id] || 0;
    set({ done: { ...S.done, [sc.id]: Math.max(prev, sess.right) } });
    if (perfect) { addGems(10, 'Диалог без ошибок'); ss({ earned: sess.earned + 10 }); }
    ss({ finished: true });
    render();
  }

  function chat() {
    const { sc } = sess;
    const msgs = sess.log.map((m) => m.him
      ? `<div class="bub him">${esc(m.t)}${sess.tr ? `<span class="tr">${esc(m.ru)}</span>` : ''}</div>`
      : `<div class="bub me">${esc(m.t)}</div>`).join('');
    const typing = sess.typing ? '<div class="typing"><i></i><i></i><i></i></div>' : '';
    let panel = '';
    if (sess.finished) {
      const n = sc.steps.length;
      const stars = '★'.repeat(Math.round((sess.right / n) * 3)) + '☆'.repeat(3 - Math.round((sess.right / n) * 3));
      panel = `<div class="result"><div class="big">${sess.right}/${n}</div><div class="stars">${stars}</div>
        <p>Заработано: +${sess.earned} 💎</p></div>
        <div class="actions"><button class="gold-btn ghost" data-go="dating">К сценариям</button><button class="gold-btn" data-act="start" data-id="${sc.id}">Ещё раз</button></div>`;
    } else if (!sess.typing && sess.chosen === null) {
      panel = sess.opts.map((o, i) => `<button class="opt ${sess.off === i ? 'off' : ''}" data-act="pick" data-i="${i}">${esc(o.t)}</button>`).join('')
        + `<div class="hint-row"><span>У вас ${S.gems} 💎</span><button class="link" data-act="hint">Подсказка за ${HINT_COST} 💎</button></div>`;
    } else if (sess.chosen !== null) {
      const o = sess.opts[sess.chosen];
      const good = sess.opts.find((x) => x.ok);
      panel = o.ok
        ? `<div class="fb ok"><b>✓ Отлично! +${GEMS_PER_ANSWER} 💎</b>${esc(o.why)}</div>`
        : `<div class="fb no"><b>✗ Не совсем</b>${esc(o.why)}<br><br><b style="margin:0">Лучше сказать:</b>${esc(good.t)}<br>${esc(good.why)}</div>`;
      const last = sess.i + 1 >= sc.steps.length;
      panel += `<button class="gold-btn" data-act="next">${last ? 'Завершить' : 'Дальше'}</button>`;
    }
    return `<div class="chat"><div class="chat-head"><button class="back" data-go="dating" aria-label="Назад">${ICON.back}</button>
      <div class="avatar">A</div><div class="nm"><b>Alex</b><small>${esc(sc.title)}</small></div>
      <button class="chip ${sess.tr ? 'on' : ''}" data-act="tr">RU</button></div>
      <div class="msgs" id="msgs">${msgs}${typing}</div><div class="panel">${panel}</div></div>`;
  }

  /* ---------- English by Memes ---------- */
  function startMemes() {
    meme = { order: shuffle(MEMES.map((_, i) => i)).slice(0, MEME_ROUND), pos: 0, picked: null, right: 0, opts: null, done: false };
    ms({ opts: memeOpts(meme.order[0]) });
    render();
  }
  const memeOpts = (idx) => shuffle(MEMES[idx].opts.map((t, k) => ({ t, ok: k === 0 })));
  function memePick(i) {
    if (!meme || meme.picked !== null) return;
    const ok = meme.opts[i].ok;
    touchStreak();
    set({ total: S.total + 1, ok: S.ok + (ok ? 1 : 0), xp: S.xp + (ok ? 10 : 2) });
    if (ok) addGems(3, 'Мем угадан');
    ms({ picked: i, right: meme.right + (ok ? 1 : 0) });
    render();
  }
  function memeNext() {
    if (!meme || meme.picked === null) return;
    if (meme.pos + 1 >= meme.order.length) {
      set({ memeRounds: S.memeRounds + 1 });
      ms({ done: true });
    } else {
      ms({ pos: meme.pos + 1, picked: null, opts: memeOpts(meme.order[meme.pos + 1]) });
    }
    render();
  }
  function saveWord() {
    const m = MEMES[meme.order[meme.pos]];
    if (S.words.some((w) => w.p === m.phrase)) return;
    set({ words: [{ p: m.phrase, r: m.ru }, ...S.words] });
    toast('Слово сохранено в профиле');
    render();
  }

  function memes() {
    const head = `<div class="topbar"><button class="back" data-act="memeExit" aria-label="Назад">${ICON.back}</button></div>`;
    if (!meme) {
      return `<div class="page">${head}<h2>English by Memes</h2><p class="sub">Угадывайте значение фраз из мемов. Раунд: ${MEME_ROUND} карточек, +3 💎 за верный ответ.</p>
        <div class="card"><div class="stats"><div class="stat"><b>${S.memeRounds}</b><small>раундов</small></div><div class="stat"><b>${S.words.length}</b><small>слов</small></div><div class="stat"><b>${S.total ? Math.round((S.ok / S.total) * 100) : 0}%</b><small>точность</small></div></div></div>
        <button class="gold-btn" data-act="memeStart">Начать раунд</button></div>`;
    }
    if (meme.done) {
      return `<div class="page">${head}<div class="card result"><div class="big">${meme.right}/${meme.order.length}</div><div class="stars">${'★'.repeat(Math.round((meme.right / meme.order.length) * 3)).padEnd(3, '☆')}</div>
        <p>Раунд пройден. Сохранённые слова ищите в профиле.</p></div>
        <div class="actions"><button class="gold-btn ghost" data-act="memeExit">Домой</button><button class="gold-btn" data-act="memeStart">Ещё раунд</button></div></div>`;
    }
    const m = MEMES[meme.order[meme.pos]];
    const picked = meme.picked !== null;
    const opts = meme.opts.map((o, i) => {
      const cls = picked ? (o.ok ? 'right' : i === meme.picked ? 'wrong' : '') : '';
      return `<button class="opt ${cls}" data-act="mpick" data-i="${i}" ${picked ? 'disabled' : ''}>${esc(o.t)}</button>`;
    }).join('');
    const saved = S.words.some((w) => w.p === m.phrase);
    const expl = picked ? `<div class="card ex"><b>${meme.opts[meme.picked].ok ? '✓ Верно!' : '✗ Не совсем'}</b><br>${esc(m.ru)}<em>“${esc(m.en)}”</em>
      <div class="actions"><button class="gold-btn ghost" data-act="saveWord" ${saved ? 'disabled' : ''}>${saved ? 'Сохранено' : 'Сохранить слово'}</button>
      <button class="gold-btn" data-act="memeNext">${meme.pos + 1 >= meme.order.length ? 'Итоги' : 'Дальше'}</button></div></div>` : '';
    return `<div class="page">${head}<div class="progress"><i style="width:${((meme.pos + (picked ? 1 : 0)) / meme.order.length) * 100}%"></i></div>
      <div class="meme" style="--g1:${m.g[0]};--g2:${m.g[1]}"><div class="t">${esc(m.top)}</div><div class="e">${m.emoji}</div><div class="b">${esc(m.bottom)}</div></div>
      <div class="q">${esc(m.q)}</div><div class="opts">${opts}</div>${expl}</div>`;
  }

  /* ---------- Кристаллы ---------- */
  const PACKS = [[100, '99 ₽'], [500, '399 ₽'], [1000, '699 ₽']];
  function gems() {
    const claimed = S.daily === dayKey();
    const hist = S.hist.slice(0, 8).map((h) => `<div class="hist"><span>${esc(h.t)}</span><span class="${h.v >= 0 ? 'p' : 'm'}">${h.v >= 0 ? '+' : ''}${h.v}</span></div>`).join('');
    const packs = PACKS.map(([n, price]) => `<div class="pack"><div><b>${n} 💎</b><small>Демо-покупка</small></div><button class="chip" data-act="buy" data-n="${n}">${price}</button></div>`).join('<div style="height:10px"></div>');
    return `<div class="page"><h2>Кристаллы</h2><p class="sub">Валюта для открытия сценариев и подсказок.</p>
      <div class="card balance"><div class="n">${ICON.gem}${S.gems}</div></div>
      <button class="gold-btn" data-act="daily" ${claimed ? 'disabled' : ''}>${claimed ? 'Бонус получен, приходите завтра' : `Ежедневный бонус +${DAILY_BONUS} 💎`}</button>
      <h2 style="font-size:20px;margin:24px 0 10px">Купить кристаллы</h2><div class="card">${packs}
        <p class="note">Подключение: оплата картой / СБП (эквайринг). В демо кристаллы начисляются сразу.</p></div>
      <h2 style="font-size:20px;margin:24px 0 10px">История</h2><div class="card">${hist}</div></div>`;
  }

  /* ---------- Профиль ---------- */
  function profile() {
    const level = Math.floor(S.xp / 100) + 1;
    const into = S.xp % 100;
    const perfect = SCENARIOS.some((sc) => S.done[sc.id] === sc.steps.length);
    const ach = [
      ['🎬', 'Первый диалог', Object.keys(S.done).length >= 1],
      ['🔥', 'Серия 3 дня', S.streak >= 3],
      ['📚', '5 сохранённых слов', S.words.length >= 5],
      ['😎', 'Мемолог: раунд пройден', S.memeRounds >= 1],
      ['💯', 'Диалог без ошибок', perfect]
    ].map(([e, t, ok]) => `<div class="ach ${ok ? '' : 'lock'}"><span>${e}</span>${t}</div>`).join('');
    const words = S.words.length ? S.words.map((w, i) => `<div class="word"><div><b>${esc(w.p)}</b><small>${esc(w.r)}</small></div><button class="x" data-act="delWord" data-i="${i}" aria-label="Удалить">×</button></div>`).join('')
      : '<p class="note">Пока пусто. Сохраняйте слова из раздела English by Memes.</p>';
    return `<div class="page"><h2>Профиль</h2><p class="sub">Уровень ${level} · ${into}/100 XP</p>
      <div class="progress"><i style="width:${into}%"></i></div>
      <div class="stats" style="margin-bottom:12px"><div class="stat"><b>🔥 ${S.streak}</b><small>дней подряд</small></div><div class="stat"><b>${S.ok}</b><small>верных</small></div><div class="stat"><b>${Object.keys(S.done).length}</b><small>диалогов</small></div></div>
      <div class="card"><label class="note" for="nm" style="margin:0 0 6px;display:block">Имя</label><input id="nm" class="field" maxlength="24" value="${esc(S.name)}" autocomplete="off">
      <p class="note" style="margin-top:14px">Мой уровень английского</p><div class="chips" style="margin-top:6px">${['A2', 'B1', 'B2'].map((l) => `<button class="chip ${S.lvl === l ? 'on' : ''}" data-act="lvl" data-v="${l}">${l}</button>`).join('')}</div></div>
      <div class="card"><b>Достижения</b>${ach}</div>
      <div class="card"><b>Мои слова</b><div style="margin-top:6px">${words}</div></div>
      <button class="gold-btn ghost" data-act="reset">Сбросить прогресс</button></div>`;
  }

  /* ---------- Рендер и события ---------- */
  const views = { home, dating, chat: () => (sess ? chat() : dating()), memes, gems, profile };
  const TAB = { home: 'home', dating: 'home', chat: 'home', memes: 'home', gems: 'gems', profile: 'profile' };
  const ICONS = { home: ICON.home, gems: ICON.gem + `<span class="gem-count" id="gemCount"></span>`, profile: ICON.user };

  function render() {
    const view = $('#view');
    const keep = route === 'chat' ? 0 : view.scrollTop;
    view.innerHTML = views[route]();
    view.scrollTop = keep;
    const msgs = $('#msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    document.querySelectorAll('#tabs button').forEach((b) => {
      const r = b.dataset.go;
      b.innerHTML = ICONS[r];
      b.classList.toggle('on', TAB[route] === r);
    });
    $('#gemCount').textContent = S.gems;
    const nm = $('#nm');
    if (nm) nm.addEventListener('change', () => { set({ name: nm.value.trim() || 'Гость' }); toast('Имя сохранено'); });
  }
  const go = (r) => { route = r; if (r !== 'memes') meme = null; closeSheet(); render(); };

  const actions = {
    start: (d) => startScenario(d.id),
    unlock: (d) => {
      const sc = SCENARIOS.find((x) => x.id === d.id);
      if (S.gems < sc.cost) { closeSheet(); toast('Не хватает кристаллов'); return; }
      addGems(-sc.cost, `Сценарий «${sc.title}»`);
      set({ unlocked: { ...S.unlocked, [sc.id]: true } });
      closeSheet();
      startScenario(sc.id);
    },
    closeSheet, hint, next,
    pick: (d) => pick(+d.i),
    tr: () => { ss({ tr: !sess.tr }); render(); },
    memeStart: startMemes, memeNext, saveWord,
    memeExit: () => { if (route === 'memes' && meme && !meme.done) { meme = null; render(); } else go('home'); },
    mpick: (d) => memePick(+d.i),
    daily: () => { if (S.daily === dayKey()) return; set({ daily: dayKey() }); addGems(DAILY_BONUS, 'Ежедневный бонус'); toast(`+${DAILY_BONUS} 💎`); render(); },
    buy: (d) => { addGems(+d.n, 'Покупка (демо)'); toast(`+${d.n} 💎 (демо)`); render(); },
    lvl: (d) => { set({ lvl: d.v }); render(); },
    delWord: (d) => { set({ words: S.words.filter((_, i) => i !== +d.i) }); render(); },
    reset: () => { set(defaults()); toast('Прогресс сброшен'); render(); }
  };

  $('#phone').addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    if (goEl) { go(goEl.dataset.go); return; }
    const bg = e.target.classList.contains('sheet-bg');
    if (bg) { closeSheet(); return; }
    const el = e.target.closest('[data-act]');
    if (el && actions[el.dataset.act]) actions[el.dataset.act](el.dataset);
  });

  const clock = () => { $('#clock').textContent = new Date().toLocaleTimeString('ru-RU', { hour: 'numeric', minute: '2-digit' }); };
  clock();
  setInterval(clock, 30000);
  render();
})();
