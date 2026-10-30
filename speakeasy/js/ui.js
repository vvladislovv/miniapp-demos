/* Общие помощники интерфейса: экранирование, тосты, диалоги, конфетти. */
(function () {
  const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => MAP[c]);
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const plural = (n, a, b, c) => { const m = Math.abs(n) % 100, k = m % 10; return m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c; };
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  let toastTimer = 0;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
  }

  /* диалог на <dialog>: кнопки внутри <form method="dialog">, результат в returnValue */
  function dialog(html) {
    const d = $('#dlg');
    return new Promise((resolve) => {
      if (d.open) d.close('cancel');
      d.innerHTML = '<form method="dialog" class="dlg-in">' + html + '</form>';
      let done = false;
      const finish = (v) => { if (done) return; done = true; d.removeEventListener('click', onClick); resolve(v); };
      const onClick = (e) => { if (e.target === d) d.close('cancel'); };
      d.addEventListener('click', onClick);
      $('form', d).addEventListener('submit', (e) => finish(e.submitter && e.submitter.value ? e.submitter.value : 'cancel'));
      d.addEventListener('close', () => finish(d.returnValue), { once: true });
      d.returnValue = 'cancel';
      d.showModal();
      const first = $('[autofocus]', d) || $('button[value="ok"]', d) || $('button', d);
      if (first) first.focus();
    });
  }
  async function confirm({ title, body, ok, cancel, danger }) {
    const res = await dialog('<h2 class="dlg-t">' + esc(title) + '</h2><p class="dlg-p">' + body + '</p>'
      + '<div class="dlg-b"><button class="btn ghost" value="cancel">' + esc(cancel || 'Отмена') + '</button>'
      + '<button class="btn ' + (danger ? 'danger' : 'pri') + '" value="ok" autofocus>' + esc(ok || 'Да') + '</button></div>');
    return res === 'ok';
  }

  function confetti() {
    if (reduced()) return;
    const fx = $('#fx');
    const colors = ['#ff3d9a', '#ffb347', '#6ef0e0', '#ffd9a3', '#c77dff'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 46; i++) {
      const s = document.createElement('i');
      s.style.cssText = '--x:' + (Math.random() * 100) + 'vw;--dx:' + (Math.random() * 160 - 80) + 'px;--r:' + (Math.random() * 720 - 360) + 'deg;--d:' + (1.6 + Math.random() * 1.4) + 's;--w:' + (6 + Math.random() * 7) + 'px;background:' + colors[i % colors.length] + ';animation-delay:' + (Math.random() * 0.3) + 's';
      frag.appendChild(s);
    }
    fx.appendChild(frag);
    setTimeout(() => { fx.textContent = ''; }, 3600);
  }

  SPK.ui = { esc, $, $$, reduced, shuffle, plural, fmt, toast, dialog, confirm, confetti };
  SPK.go = (path) => { location.hash = '#/' + path; };
  SPK.replace = (path) => { history.replaceState(null, '', '#/' + path); window.dispatchEvent(new HashChangeEvent('hashchange')); };
})();
