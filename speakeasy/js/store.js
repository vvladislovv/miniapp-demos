/* Состояние Speakeasy. Всё обновляется иммутабельно: update(fn) получает старое состояние и возвращает новое. */
(function () {
  const KEY = 'spk_state_v1';
  const START_SPARKS = 999, SEED_XP = 240, LOG_LIMIT = 60;
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const todayKey = () => dayKey(new Date());
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return dayKey(d); };

  const fresh = () => ({
    name: 'Гость', level: 'B1', sparks: START_SPARKS, xp: SEED_XP,
    days: [daysAgo(1), daysAgo(2), daysAgo(3)],
    daily: { date: todayKey(), xp: 0 },
    unlocked: [], done: {}, saved: [], bonusDay: '', spent: 0,
    log: [{ t: Date.now(), d: 'Стартовый баланс', n: START_SPARKS }]
  });

  const isStr = (v) => typeof v === 'string';
  const num = (v, d) => (Number.isFinite(v) ? v : d);

  function sanitize(raw) {
    const f = fresh();
    if (!raw || typeof raw !== 'object') return f;
    const arr = (v) => (Array.isArray(v) ? v : []);
    const today = todayKey();
    const done = raw.done && typeof raw.done === 'object' && !Array.isArray(raw.done) ? raw.done : {};
    return {
      name: isStr(raw.name) && raw.name.trim() ? raw.name.slice(0, 24) : f.name,
      level: ['A2', 'B1', 'B2'].includes(raw.level) ? raw.level : f.level,
      sparks: Math.max(0, num(raw.sparks, f.sparks)),
      xp: Math.max(0, num(raw.xp, f.xp)),
      days: arr(raw.days).filter(isStr).slice(-400),
      daily: raw.daily && raw.daily.date === today ? { date: today, xp: Math.max(0, num(raw.daily.xp, 0)) } : { date: today, xp: 0 },
      unlocked: arr(raw.unlocked).filter(isStr),
      done,
      saved: arr(raw.saved).filter(isStr),
      bonusDay: isStr(raw.bonusDay) ? raw.bonusDay : '',
      spent: Math.max(0, num(raw.spent, 0)),
      log: arr(raw.log).filter((e) => e && isStr(e.d) && Number.isFinite(e.n)).slice(0, LOG_LIMIT)
    };
  }

  let mem = null;
  function read() {
    try { return sanitize(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return mem ? sanitize(mem) : fresh(); }
  }
  function write(s) {
    mem = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* хранилище недоступно — работаем в памяти */ }
  }

  let state = read();
  const subs = new Set();
  const get = () => (state.daily.date === todayKey() ? state : { ...state, daily: { date: todayKey(), xp: 0 } });
  function update(fn) {
    const next = fn(get());
    if (!next || next === state) return state;
    state = next;
    write(state);
    subs.forEach((f) => f(state));
    return state;
  }
  const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
  function reset() { state = fresh(); write(state); subs.forEach((f) => f(state)); }

  /* чистые помощники: возвращают новое состояние */
  function award(s, { xp = 0, sparks = 0, why = '' }) {
    const today = todayKey();
    const log = sparks ? [{ t: Date.now(), d: why, n: sparks }, ...s.log].slice(0, LOG_LIMIT) : s.log;
    const days = xp > 0 && !s.days.includes(today) ? [...s.days, today] : s.days;
    return { ...s, xp: s.xp + xp, sparks: s.sparks + sparks, days, log, daily: { date: today, xp: s.daily.xp + xp } };
  }
  function spend(s, n, why) {
    if (s.sparks < n) return null;
    return { ...s, sparks: s.sparks - n, spent: s.spent + n, log: [{ t: Date.now(), d: why, n: -n }, ...s.log].slice(0, LOG_LIMIT) };
  }
  function streak(s) {
    const set = new Set(s.days);
    const d = new Date();
    if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const level = (s) => Math.floor(s.xp / 120) + 1;

  SPK.store = { get, update, subscribe, reset, award, spend, streak, level, todayKey, dayKey };
})();
