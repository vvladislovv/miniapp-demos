/* Lume: тосты, шторки (на ПК модальное окно), копирование, счётчик баланса, наклон карты. */
(() => {
  const { esc, fixSp } = Lume;
  const { ico } = Lume.art;
  const $ = (s) => document.querySelector(s);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  let opener = null; let locked = false; let closeTimer = 0; let lastBal = null;

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2000);
  }
  async function copy(text, okMsg = 'Скопировано') {
    try { await navigator.clipboard.writeText(text); toast(okMsg); return true; } catch { /* запасной путь */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    toast(ok ? okMsg : 'Не удалось скопировать');
    return ok;
  }

  const sheetEl = () => $('#overlay .sheet');
  function openSheet({ title, html, cls = '' }) {
    clearTimeout(closeTimer);
    const ov = $('#overlay');
    if (ov.hidden) opener = document.activeElement;
    locked = false;
    ov.hidden = false;
    ov.innerHTML = `<div class="sheet ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1"><span class="sheet-grab" aria-hidden="true"></span>
      <button class="icon-btn sheet-x" data-act="sheet-close" aria-label="Закрыть">${ico('close')}</button><div class="sheet-body">${html}</div></div>`;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => ov.classList.add('open'));
    focusSheet();
  }
  function focusSheet() {
    const s = sheetEl(); if (!s) return;
    const first = s.querySelector('.sheet-body input, .sheet-body [data-autofocus]');
    (first || s).focus({ preventScroll: true });
  }
  function setSheet(html, { lock = false, title } = {}) {
    const s = sheetEl(); if (!s) return;
    locked = lock;
    s.querySelector('.sheet-body').innerHTML = html;
    if (title) s.setAttribute('aria-label', title);
    s.querySelector('.sheet-x').hidden = lock;
    focusSheet();
  }
  function closeSheet(force = false) {
    const ov = $('#overlay');
    if (ov.hidden || (locked && !force)) return;
    ov.classList.remove('open');
    document.body.classList.remove('no-scroll');
    const done = () => { ov.hidden = true; ov.innerHTML = ''; if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); };
    if (reduced()) done(); else closeTimer = setTimeout(done, 220);
  }
  // Имитация обработки платежа: спиннер и скелетон, шторка не закрывается.
  function process({ title, note, ms = 1300, run }) {
    setSheet(`<div class="process" aria-live="polite"><span class="spinner" aria-hidden="true"></span><h2>${esc(title)}</h2>
      <div class="skel"><i></i><i></i><i></i></div><p class="integ">${esc(note)}</p></div>`, { lock: true, title });
    setTimeout(() => { locked = false; run(); }, reduced() ? 150 : ms);
  }

  document.addEventListener('keydown', (e) => {
    const ov = $('#overlay');
    if (ov.hidden) return;
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key !== 'Tab') return;
    const items = [...ov.querySelectorAll(FOCUSABLE)].filter((n) => !n.hidden && n.offsetParent !== null);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0]; const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheetEl())) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', (e) => { if (e.target.id === 'overlay') closeSheet(); });

  /* ---------- Крупный баланс ---------- */
  const bigNum = (v) => {
    const [i, d] = v.toFixed(2).split('.');
    return `${fixSp(Number(i).toLocaleString('ru-RU'))}<span class="dec">,${d}</span>`;
  };
  function animateBalance(el, to) {
    if (!el) return;
    const from = lastBal === null ? to : lastBal;
    lastBal = to;
    if (from === to || reduced()) { el.innerHTML = bigNum(to); return; }
    const t0 = performance.now(); const dur = 800;
    el.classList.add('pulse');
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur); const e = 1 - (1 - k) ** 3;
      if (!el.isConnected) return;
      el.innerHTML = bigNum(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(tick); else el.classList.remove('pulse');
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Наклон виртуальной карты за курсором и гироскопом ---------- */
  function tilt(card) {
    if (!card || reduced()) return;
    const set = (nx, ny) => {
      card.style.setProperty('--ry', `${((nx - 0.5) * 18).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - ny) * 14).toFixed(2)}deg`);
      card.style.setProperty('--gx', (nx * 100).toFixed(1));
      card.style.setProperty('--gy', (ny * 100).toFixed(1));
    };
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    }
    const onOrient = (e) => {
      if (!card.isConnected) { window.removeEventListener('deviceorientation', onOrient); return; }
      if (e.gamma == null || e.beta == null) return;
      set(Math.min(1, Math.max(0, 0.5 + e.gamma / 60)), Math.min(1, Math.max(0, 0.5 + (e.beta - 45) / 60)));
    };
    if ('DeviceOrientationEvent' in window && matchMedia('(pointer:coarse)').matches) window.addEventListener('deviceorientation', onOrient);
  }
  Lume.ui = { toast, copy, openSheet, setSheet, closeSheet, process, animateBalance, bigNum, tilt, reduced };
})();
