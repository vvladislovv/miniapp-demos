/* Piastrix Wallet — витрины, кошелёк, покупки. Состояние в localStorage. */
(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = 'pxw_state_v1';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => `${n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/ /g, ' ')} ₽`;
  const whole = (n) => `${Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`;
  const find = (id) => SHOWCASES.find((s) => s.id === id);
  const fmtDate = (t) => new Date(t).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const priceOf = (sc, v) => Math.round(v[1] * (1 + sc.fee));
  const MIN_TOPUP = 100;
  const MAX_TOPUP = 100000;
  const MIN_TRANSFER = 10;

  const seed = () => {
    const now = Date.now();
    return {
      bal: START_BALANCE, fav: ['apple'], classic: false,
      hist: [
        { id: 'h1', type: 'in', t: 'Пополнение картой', v: 15000, d: now - 864e5 * 2 },
        { id: 'h0', type: 'buy', t: 'Telegram Premium 3 месяца', v: -1090, d: now - 864e5 * 5 }
      ].sort((a, b) => b.d - a.d),
      codes: [],
      notif: [
        { id: 'n2', t: 'Добро пожаловать в Piastrix', s: 'Пополняйте кошелёк и покупайте подарочные карты и подписки.', d: now - 36e5, read: false },
        { id: 'n1', t: 'Скидки на подписки', s: 'Spotify и Telegram Premium без комиссии.', d: now - 864e5, read: false }
      ]
    };
  };
  let S = load();
  function load() {
    try { const r = JSON.parse(localStorage.getItem(KEY)); return r && typeof r === 'object' ? { ...seed(), ...r } : seed(); } catch { return seed(); }
  }
  function set(patch) {
    S = { ...S, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* приватный режим */ }
  }
  const toggle = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  const addOp = (type, t, v) => set({ bal: Math.round((S.bal + v) * 100) / 100, hist: [{ id: uid(), type, t, v, d: Date.now() }, ...S.hist] });
  const notify = (t, s) => set({ notif: [{ id: uid(), t, s, d: Date.now(), read: false }, ...S.notif] });
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1900);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Скопировано'); return; } catch { /* запасной путь */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('Скопировано'); } catch { toast('Не удалось скопировать'); }
    ta.remove();
  }
  function genCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const buf = new Uint32Array(16);
    (window.crypto || { getRandomValues: (a) => a.map(() => Math.random() * 4e9) }).getRandomValues(buf);
    const s = Array.from(buf, (n) => chars[n % chars.length]).join('');
    return [0, 4, 8, 12].map((i) => s.slice(i, i + 4)).join('-');
  }

  let ui = { view: 'shop', cat: 'all', q: '', sid: null, vi: 0, phone: '', hf: 'all', revealed: [] };
  const setUi = (p) => { ui = { ...ui, ...p }; };
  const BACK = { item: 'shop', wallet: 'shop', history: 'wallet', codes: 'wallet' };
  const unread = () => S.notif.filter((n) => !n.read).length;

  /* ---------- Экраны ---------- */
  const head = () => `<div class="head"><div class="logo">${FLOWER}</div>
    <div class="wid">${WALLET_ID}<button class="ib cp" data-act="copyId" aria-label="Копировать номер">${PX.copy}</button></div>
    <button class="ib" data-act="notif" aria-label="Уведомления">${PX.bell}${unread() ? `<span class="dot">${unread()}</span>` : ''}</button>
    <button class="ib" data-act="profile" aria-label="Профиль">${PX.user}</button>
    <button class="ib" data-act="drawer" aria-label="Меню">${PX.menu}</button></div>`;

  function visibleShowcases() {
    const q = ui.q.trim().toLowerCase();
    return SHOWCASES.filter((s) => (ui.cat === 'all' || (ui.cat === 'fav' ? S.fav.includes(s.id) : s.cats.includes(ui.cat))) && (!q || s.title.toLowerCase().includes(q)));
  }
  const tile = (s) => `<div class="tile" role="button" tabindex="0" data-act="open" data-id="${s.id}" aria-label="${esc(s.title)}">
    <button class="star ${S.fav.includes(s.id) ? 'on' : ''}" data-act="fav" data-id="${s.id}" aria-label="В избранное">${PX.star}</button>
    <div class="ico">${LOGOS[s.id]}</div><div class="tt">${esc(s.title)}</div></div>`;
  function tilesHtml() {
    const list = visibleShowcases();
    return list.length ? `<div class="tiles" id="tiles">${list.map(tile).join('')}</div>`
      : `<div class="empty" id="tiles"><b>Ничего не найдено</b>${ui.cat === 'fav' ? 'Отмечайте витрины звёздочкой.' : 'Измените запрос или категорию.'}</div>`;
  }
  function shop() {
    return `<div class="banner"><button data-act="design">${S.classic ? 'Перейти к новому дизайну' : 'Вернуться к старому дизайну'}</button></div>${head()}
      <h1 class="t">Все витрины</h1>
      <div class="srch">${PX.search}<input id="q" type="search" placeholder="Поиск по витринам" value="${esc(ui.q)}" autocomplete="off"></div>
      <div class="cats">${CATS.map((c) => `<button class="cat ${ui.cat === c.id ? 'on' : ''}" data-act="cat" data-id="${c.id}">${c.name}</button>`).join('')}</div>${tilesHtml()}`;
  }

  function item() {
    const s = find(ui.sid);
    if (!s) return shop();
    const v = s.variants[ui.vi] || s.variants[s.def];
    const price = priceOf(s, v);
    const fee = price - v[1];
    const variants = s.variants.map((x, i) => `<button class="v ${i === ui.vi ? 'on' : ''}" data-act="variant" data-i="${i}"><span>${x[0]}</span><span>${whole(priceOf(s, x))}</span></button>`).join('');
    const phone = s.needsPhone ? `<div class="blk"><h3>Номер телефона</h3><div class="fld ${ui.phoneErr ? 'err' : ''}"><input class="inp" id="pn" inputmode="tel" placeholder="+7 900 000-00-00" value="${esc(ui.phone)}" autocomplete="off"><em>Введите номер в формате +7XXXXXXXXXX</em></div></div>` : '';
    return `<div class="hero"><div class="big">${LOGOS[s.id]}</div><h2>${esc(s.title)}</h2>
      <div class="tags"><span class="tag">${esc(s.region)}</span><span class="tag">Мгновенная выдача</span></div></div>
      <div class="blk"><h3>Выберите вариант</h3><div class="vs">${variants}</div></div>${phone}
      <div class="blk"><div class="sum"><span>Номинал</span><span>${esc(v[0])}</span></div>${fee ? `<div class="sum"><span>Комиссия витрины</span><span>${whole(fee)}</span></div>` : ''}
      <div class="sum tot"><span>К оплате</span><span>${whole(price)}</span></div></div>
      <div class="blk"><h3>Как активировать</h3><p style="font-size:14.5px;line-height:1.5">${esc(s.how)}</p>
      <p class="note">Подключение: выдача кодов через API поставщика. В демо коды сгенерированы.</p></div>
      <div style="height:12px"></div><div class="sticky"><button class="btn" data-act="buy">Купить за ${whole(price)}</button></div>`;
  }

  const ICON_OP = { in: '⬇️', buy: '🎁', out: '↗️' };
  const opRow = (o) => `<div class="op"><div class="oi">${ICON_OP[o.type] || '•'}</div><div class="ot">${esc(o.t)}<small>${fmtDate(o.d)}</small></div>
    <div class="oa ${o.v > 0 ? 'pos' : 'neg'}">${o.v > 0 ? '+' : '−'}${money(Math.abs(o.v))}</div></div>`;

  function wallet() {
    const last = S.hist.slice(0, 3).map(opRow).join('');
    return `${head()}<div class="bal"><small>Баланс кошелька</small><div class="n">${money(S.bal)}</div>
      <div class="row"><button class="btn" data-act="topup">Пополнить</button><button class="btn" data-act="transfer">Перевести</button></div></div>
      <div class="blk"><h3>Последние операции</h3>${last}<button class="link" data-act="goHistory" style="margin-top:8px">Вся история →</button></div>
      <div class="blk"><div class="op" data-act="goCodes" style="cursor:pointer;border:0;padding:0"><div class="oi">🔑</div><div class="ot">Мои покупки<small>Коды и подписки: ${S.codes.length}</small></div><span class="link">Открыть</span></div></div><div style="height:24px"></div>`;
  }

  const HF = [['all', 'Все'], ['in', 'Пополнения'], ['buy', 'Покупки'], ['out', 'Переводы']];
  function history() {
    const list = S.hist.filter((o) => ui.hf === 'all' || o.type === ui.hf);
    return `<h1 class="t">История</h1><div class="cats">${HF.map(([k, n]) => `<button class="cat ${ui.hf === k ? 'on' : ''}" data-act="hf" data-id="${k}">${n}</button>`).join('')}</div>
      <div class="blk" style="margin-top:0">${list.length ? list.map(opRow).join('') : '<p class="note">Операций нет.</p>'}</div><div style="height:24px"></div>`;
  }

  function codes() {
    const list = S.codes.length ? S.codes.map((c) => {
      const open = ui.revealed.includes(c.id);
      return `<div class="blk"><b>${esc(c.title)}</b><div class="note" style="margin:2px 0 0">${esc(c.variant)} · ${fmtDate(c.d)}${c.phone ? ` · ${esc(c.phone)}` : ''}</div>
        <div class="code"><span>${open ? c.code : '••••-••••-••••-••••'}</span><span><button class="link" data-act="reveal" data-id="${c.id}">${open ? 'Скрыть' : 'Показать'}</button> · <button class="link" data-act="copyCode" data-id="${c.id}">Копировать</button></span></div></div>`;
    }).join('') : '<div class="empty"><b>Покупок пока нет</b>Купленные коды появятся здесь.</div>';
    return `<h1 class="t">Мои покупки</h1>${list}<div style="height:24px"></div>`;
  }

  /* ---------- Рендер ---------- */
  const views = { shop, item, wallet, history, codes };
  function render() {
    const view = $('#view');
    const keep = view.dataset.v === ui.view ? view.scrollTop : 0;
    view.innerHTML = views[ui.view]();
    view.dataset.v = ui.view;
    view.scrollTop = keep;
    $('#phone').classList.toggle('classic', S.classic);
    $('#tgLeft').textContent = ui.view === 'shop' ? 'Закрыть' : 'Назад';
    const q = $('#q');
    if (q) q.addEventListener('input', () => { setUi({ q: q.value }); $('#tiles').outerHTML = tilesHtml(); });
    const ph = $('#pn');
    if (ph) ph.addEventListener('input', () => setUi({ phone: ph.value, phoneErr: false }));
  }
  const sheet = (html) => { $('#sheet').innerHTML = `<div class="sheet-bg"><div class="sheet">${html}</div></div>`; };
  const closeSheet = () => { $('#sheet').innerHTML = ''; };
  const closeDrawer = () => { $('#drawer').innerHTML = ''; };
  const go = (v) => { setUi({ view: v }); closeSheet(); closeDrawer(); render(); $('#view').scrollTop = 0; };

  /* ---------- Покупка ---------- */
  function buy() {
    const s = find(ui.sid);
    const v = s.variants[ui.vi];
    if (s.needsPhone && !/^\+?[78]\d{10}$/.test(ui.phone.replace(/[\s()-]/g, ''))) {
      setUi({ phoneErr: true }); render(); toast('Проверьте номер телефона'); return;
    }
    const price = priceOf(s, v);
    if (S.bal < price) {
      sheet(`<h3>Недостаточно средств</h3><p class="sub">Не хватает ${money(price - S.bal)}. Баланс: ${money(S.bal)}.</p>
        <button class="btn" data-act="topup">Пополнить кошелёк</button>`);
      return;
    }
    sheet(`<h3>Подтвердите покупку</h3><div class="sum"><span>${esc(s.title)}</span></div><div class="sum"><span>Вариант</span><span>${esc(v[0])}</span></div>
      <div class="sum"><span>Спишется</span><span>${whole(price)}</span></div><div class="sum tot"><span>Остаток</span><span>${money(S.bal - price)}</span></div>
      <div style="height:14px"></div><button class="btn" data-act="pay">Оплатить с кошелька</button><button class="btn ghost" data-act="closeSheet">Отмена</button>`);
  }
  function pay() {
    const s = find(ui.sid);
    const v = s.variants[ui.vi];
    const price = priceOf(s, v);
    if (S.bal < price) { closeSheet(); toast('Недостаточно средств'); return; }
    const code = genCode();
    const entry = { id: uid(), title: s.title, variant: v[0], code, d: Date.now(), phone: s.needsPhone ? ui.phone : '' };
    addOp('buy', `${s.title}, ${v[0]}`, -price);
    set({ codes: [entry, ...S.codes] });
    notify('Покупка выполнена', `${s.title}: ${v[0]}`);
    sheet(`<div class="done"><div class="okc">✓</div><h3>${s.needsPhone ? 'Оплачено' : 'Код получен'}</h3>
      ${s.needsPhone ? `<p class="sub">Деньги отправлены на номер ${esc(ui.phone)}.</p>` : `<div class="code"><span>${code}</span><button class="link" data-act="copyCode" data-id="${entry.id}">Копировать</button></div><p class="sub" style="margin-top:12px">${esc(s.how)}</p>`}
      <button class="btn sec" data-act="goCodes">Мои покупки</button></div>`);
    render();
  }

  /* ---------- Пополнение и перевод ---------- */
  let topup = { amount: 1000, method: 'card' };
  function topupSheet() {
    const m = TOPUP_METHODS.find((x) => x.id === topup.method);
    const pay = Math.round(topup.amount * (1 + m.fee) * 100) / 100;
    sheet(`<h3>Пополнение кошелька</h3><div class="chips">${[500, 1000, 3000, 5000].map((n) => `<button class="chip ${topup.amount === n ? 'on' : ''}" data-act="amt" data-n="${n}">${whole(n)}</button>`).join('')}</div>
      <label class="fld" id="tuFld">Сумма, ₽<input class="inp" id="tuAmt" inputmode="numeric" value="${topup.amount || ''}" autocomplete="off"><em>От ${MIN_TOPUP} до ${whole(MAX_TOPUP)}</em></label>
      ${TOPUP_METHODS.map((x) => `<button class="opt ${topup.method === x.id ? 'on' : ''}" data-act="method" data-id="${x.id}"><span class="rd"></span>${x.name}<small>комиссия ${x.fee * 100}%</small></button>`).join('')}
      <div class="sum tot"><span>К оплате</span><span id="tuPay">${money(pay)}</span></div>
      <p class="note">Подключение: платёжный шлюз Piastrix (карта, СБП, крипто). В демо деньги зачисляются сразу.</p><div style="height:12px"></div>
      <button class="btn" data-act="doTopup" id="tuBtn">Пополнить на ${whole(topup.amount || 0)}</button>`);
    $('#tuAmt').addEventListener('input', (e) => {
      topup = { ...topup, amount: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 };
      const mm = TOPUP_METHODS.find((x) => x.id === topup.method);
      $('#tuPay').textContent = money(Math.round(topup.amount * (1 + mm.fee) * 100) / 100);
      $('#tuBtn').textContent = `Пополнить на ${whole(topup.amount)}`;
      $('#tuFld').classList.remove('err');
    });
  }
  function doTopup() {
    if (topup.amount < MIN_TOPUP || topup.amount > MAX_TOPUP) { $('#tuFld').classList.add('err'); return; }
    const btn = $('#tuBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span> Обработка платежа…';
    const amount = topup.amount;
    const m = TOPUP_METHODS.find((x) => x.id === topup.method);
    setTimeout(() => {
      addOp('in', `Пополнение: ${m.name}`, amount);
      notify('Кошелёк пополнен', `Зачислено ${money(amount)}`);
      closeSheet(); toast(`Зачислено ${money(amount)}`); render();
    }, 1100);
  }

  let tr = { to: '', amount: '', note: '', errors: {} };
  function transferSheet() {
    const fee = Math.max(1, Math.round((+tr.amount || 0) * TRANSFER_FEE * 100) / 100);
    sheet(`<h3>Перевод на кошелёк</h3><p class="sub">Доступно: ${money(S.bal)}. Комиссия ${TRANSFER_FEE * 100}%, минимум 1 ₽.</p>
      <label class="fld ${tr.errors.to ? 'err' : ''}">Номер кошелька (12 цифр)<input class="inp" id="trTo" inputmode="numeric" maxlength="12" value="${esc(tr.to)}" placeholder="201586111271" autocomplete="off"><em>${esc(tr.errors.to || '')}</em></label>
      <label class="fld ${tr.errors.amount ? 'err' : ''}">Сумма, ₽<input class="inp" id="trAmt" inputmode="decimal" value="${esc(tr.amount)}" placeholder="0" autocomplete="off"><em>${esc(tr.errors.amount || '')}</em></label>
      <label class="fld">Комментарий<input class="inp" id="trNote" maxlength="60" value="${esc(tr.note)}" placeholder="Необязательно" autocomplete="off"></label>
      <div class="sum"><span>Комиссия</span><span id="trFee">${tr.amount ? money(fee) : '—'}</span></div>
      <div style="height:12px"></div><button class="btn" data-act="doTransfer">Перевести</button>`);
    $('#trTo').addEventListener('input', (e) => { tr = { ...tr, to: e.target.value.replace(/\D/g, '') }; e.target.value = tr.to; });
    $('#trNote').addEventListener('input', (e) => { tr = { ...tr, note: e.target.value }; });
    $('#trAmt').addEventListener('input', (e) => {
      tr = { ...tr, amount: e.target.value.replace(',', '.').replace(/[^\d.]/g, '') };
      e.target.value = tr.amount;
      const f = Math.max(1, Math.round((+tr.amount || 0) * TRANSFER_FEE * 100) / 100);
      $('#trFee').textContent = tr.amount ? money(f) : '—';
    });
  }
  function doTransfer() {
    const amount = Math.round((parseFloat(tr.amount) || 0) * 100) / 100;
    const fee = Math.max(1, Math.round(amount * TRANSFER_FEE * 100) / 100);
    const errors = {};
    if (!/^\d{12}$/.test(tr.to)) errors.to = 'Номер кошелька — 12 цифр';
    else if (tr.to === WALLET_ID) errors.to = 'Нельзя перевести самому себе';
    if (amount < MIN_TRANSFER) errors.amount = `Минимум ${MIN_TRANSFER} ₽`;
    else if (amount + fee > S.bal) errors.amount = `Не хватает средств (с комиссией ${money(amount + fee)})`;
    if (Object.keys(errors).length) { tr = { ...tr, errors }; transferSheet(); return; }
    addOp('out', `Перевод на ${tr.to}${tr.note ? `: ${tr.note}` : ''}`, -(amount + fee));
    tr = { to: '', amount: '', note: '', errors: {} };
    closeSheet(); toast(`Переведено ${money(amount)}`); render();
  }

  /* ---------- Прочие окна ---------- */
  function notifSheet() {
    const rows = S.notif.map((n) => `<div class="nrow ${n.read ? '' : 'un'}"><div><b>${esc(n.t)}</b><small>${esc(n.s)} · ${fmtDate(n.d)}</small></div></div>`).join('');
    set({ notif: S.notif.map((n) => ({ ...n, read: true })) });
    sheet(`<h3>Уведомления</h3>${rows}`);
    render();
  }
  const profileSheet = () => sheet(`<h3>Профиль</h3><div class="op"><div class="oi">${FLOWER}</div><div class="ot">Кошелёк ${WALLET_ID}<small>+7 ••• ••• 12 34</small></div></div>
    <div class="sum"><span>Уровень</span><span>Базовый</span></div><div class="sum"><span>Лимит в месяц</span><span>${whole(100000)}</span></div>
    <p class="note">Подключение: верификация личности (KYC) повышает лимиты. В демо недоступна.</p>`);
  function drawer() {
    const items = [['shop', '🛍️', 'Витрины'], ['wallet', '💳', 'Кошелёк'], ['topup', '⬇️', 'Пополнить'], ['transfer', '↗️', 'Перевести'], ['history', '🕘', 'История'], ['codes', '🔑', 'Мои покупки'], ['support', '💬', 'Поддержка']];
    $('#drawer').innerHTML = `<div class="drawer-bg" data-act="closeDrawer"></div><nav class="drawer"><div class="dh">${FLOWER}<div><b>Piastrix</b><small>${WALLET_ID}</small></div></div>
      ${items.map(([k, e, n]) => `<button class="dli" data-act="menuGo" data-id="${k}"><span>${e}</span>${n}</button>`).join('')}</nav>`;
  }

  const actions = {
    tgLeft: () => {
      if (ui.view === 'shop') { sheet('<div class="done"><h3>Мини-приложение закрыто</h3><p class="sub">В Telegram окно закрылось бы здесь.</p><button class="btn" data-act="closeSheet">Открыть снова</button></div>'); return; }
      go(BACK[ui.view] || 'shop');
    },
    about: () => sheet('<h3>Piastrix</h3><p class="sub">Платёжный кошелёк: витрины подарочных карт и подписок, пополнение, переводы и история операций. Демо-версия: деньги и коды учебные.</p>'),
    design: () => { set({ classic: !S.classic }); render(); },
    copyId: () => copy(WALLET_ID),
    notif: notifSheet, profile: profileSheet, drawer,
    closeDrawer, closeSheet,
    menuGo: (d) => {
      closeDrawer();
      if (d.id === 'topup') topupSheet();
      else if (d.id === 'transfer') transferSheet();
      else if (d.id === 'support') sheet('<h3>Поддержка</h3><p class="sub">Ответим в чате в течение 15 минут. Частые вопросы: как активировать код, сроки зачисления, возвраты.</p><p class="note">Подключение: Telegram-бот поддержки и база знаний.</p>');
      else go(d.id);
    },
    open: (d) => { const s = find(d.id); setUi({ view: 'item', sid: s.id, vi: s.def, phone: '', phoneErr: false }); render(); $('#view').scrollTop = 0; },
    fav: (d) => { set({ fav: toggle(S.fav, d.id) }); if (ui.view === 'shop' && ui.cat === 'fav') render(); else { document.querySelectorAll(`.star[data-id="${d.id}"]`).forEach((b) => b.classList.toggle('on', S.fav.includes(d.id))); } },
    cat: (d) => { setUi({ cat: d.id }); render(); },
    variant: (d) => { setUi({ vi: +d.i }); render(); },
    buy, pay,
    topup: () => { closeSheet(); topupSheet(); },
    transfer: transferSheet,
    amt: (d) => { topup = { ...topup, amount: +d.n }; topupSheet(); },
    method: (d) => { topup = { ...topup, method: d.id }; topupSheet(); },
    doTopup, doTransfer,
    goHistory: () => go('history'), goCodes: () => go('codes'),
    hf: (d) => { setUi({ hf: d.id }); render(); },
    reveal: (d) => { setUi({ revealed: toggle(ui.revealed, d.id) }); render(); },
    copyCode: (d) => { const c = S.codes.find((x) => x.id === d.id); if (c) copy(c.code); }
  };

  $('#phone').addEventListener('click', (e) => {
    if (e.target.classList.contains('sheet-bg')) { closeSheet(); return; }
    const el = e.target.closest('[data-act]');
    if (!el || !actions[el.dataset.act]) return;
    actions[el.dataset.act](el.dataset);
  });
  $('#phone').addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.tile')) { e.preventDefault(); actions.open(e.target.dataset); }
  });
  const clock = () => { $('#clock').textContent = new Date().toLocaleTimeString('ru-RU', { hour: 'numeric', minute: '2-digit' }); };
  clock();
  setInterval(clock, 30000);
  render();
})();
