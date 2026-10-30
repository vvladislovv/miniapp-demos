/* История, покупки (коды), шторки: операция, уведомления, профиль, быстрые действия. */
(() => {
  const { esc, money, whole, group4, store, dayLabel, date, find, monthSpent } = Lume;
  const { ico, mark } = Lume.art;
  const { topbar, segmented, integ, opRow, receipt, receiptActions, receiptText, maskCode } = Lume.w;
  const ui = Lume.ui; const D = Lume.data;
  const hist = { f: 'all' }; let revealed = new Set();
  const FILTERS = [['all', 'Все'], ['in', 'Пополнения'], ['buy', 'Покупки'], ['out', 'Переводы']];

  const historyHtml = () => {
    const all = store.get().hist; const list = all.filter((o) => hist.f === 'all' || o.type === hist.f);
    const inc = list.filter((o) => o.v > 0).reduce((a, o) => a + o.v, 0); const exp = list.filter((o) => o.v < 0).reduce((a, o) => a - o.v, 0);
    const groups = [];
    list.forEach((o) => { const k = dayLabel(o.d); const g = groups[groups.length - 1]; if (g && g.k === k) g.items.push(o); else groups.push({ k, items: [o] }); });
    return `${topbar('История', 'Все операции кошелька')}
    <div class="hist-head">${segmented({ label: 'Фильтр операций', items: FILTERS, value: hist.f, act: 'hf' })}
      <div class="hist-sum"><span class="chip pos">Приход <b>${whole(inc)}</b></span><span class="chip">Расход <b>${whole(exp)}</b></span></div></div>
    <section class="panel hist-list" aria-live="polite">${groups.length ? groups.map((g) => `<h3 class="day">${g.k}</h3><div class="ops">${g.items.map(opRow).join('')}</div>`).join('')
      : '<div class="empty"><b>Операций нет</b><span>Попробуйте другой фильтр.</span></div>'}</section>`;
  };

  const purchaseCard = (o) => {
    const sc = find(o.sc); const open = revealed.has(o.id);
    const body = o.code ? `<div class="codebox"><div><small>Код активации</small><b class="code-val">${esc(open ? o.code : maskCode(o.code))}</b></div>
        <div class="code-btns"><button type="button" class="icon-btn soft" data-act="reveal" data-id="${esc(o.id)}" aria-label="${open ? 'Скрыть код' : 'Показать код'}">${ico(open ? 'eyeoff' : 'eye')}</button>
        <button type="button" class="icon-btn soft" data-act="copy" data-text="${esc(o.code)}" aria-label="Копировать код">${ico('copy')}</button></div></div>`
      : `<div class="codebox"><div><small>Пополнение связи</small><b>${esc(Lume.formatPhone(o.phone || ''))}</b></div><span class="badge">зачислено</span></div>`;
    return `<article class="pcard" style="--c1:${sc.c[0]};--c2:${sc.c[1]}"><div class="pcard-h">${mark(sc, 'sm')}<div><b>${esc(o.t)}</b><small>${esc(o.vl)} · ${date(o.d)}</small></div>
      <button type="button" class="link-btn" data-act="op" data-id="${esc(o.id)}">Чек</button></div>${body}</article>`;
  };
  const purchasesHtml = () => {
    const list = store.get().hist.filter((o) => o.type === 'buy' && find(o.sc));
    return `${topbar('Покупки', `Коды и подписки: ${list.length}`)}
    ${list.length ? `<div class="pgrid">${list.map(purchaseCard).join('')}</div>` : '<div class="empty"><b>Покупок пока нет</b><span>Купленные коды появятся здесь.</span><a class="btn btn-primary" href="#/shop">К витринам</a></div>'}
    <div class="note-wrap">${integ('Подключение: поставщик кодов (API). В демо коды сгенерированы локально.')}</div>`;
  };

  /* ---------- Шторки ---------- */
  const opSheet = (op) => ui.openSheet({ title: 'Чек операции', html: `${receipt(op, { reveal: true })}${receiptActions(op)}` });
  const notifSheet = () => {
    const S = store.get();
    ui.openSheet({ title: 'Уведомления', html: `<div class="sheet-head"><span class="state-ico">${ico('bell')}</span><div><h2>Уведомления</h2><p>${S.notif.length} за последнее время</p></div></div>
      <ul class="notes big">${S.notif.map((n) => `<li class="${n.read ? '' : 'unread'}"><b>${esc(n.t)}</b><span>${esc(n.s)}</span><small>${dayLabel(n.d)}, ${new Date(n.d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</small></li>`).join('')}</ul>` });
    store.markRead();
  };
  const profileSheet = () => {
    const used = monthSpent();
    ui.openSheet({ title: 'Профиль', html: `<div class="sheet-head"><span class="avatar lg">${D.USER_INITIALS}</span><div><h2>${esc(D.USER_NAME)}</h2><p>Уровень: базовый</p></div></div>
      <div class="wid"><div><small>Номер кошелька</small><b>${group4(D.WALLET_ID)}</b></div><button type="button" class="btn btn-soft sm" data-act="copy-id">${ico('copy')}Копировать</button></div>
      <dl class="sum"><div><dt>Лимит в месяц</dt><dd>${whole(used)} из ${whole(D.MONTH_LIMIT)}</dd></div><div><dt>Один перевод</dt><dd>до ${whole(D.MAX_TRANSFER)}</dd></div><div><dt>Одно пополнение</dt><dd>до ${whole(D.MAX_TOPUP)}</dd></div></dl>
      <button type="button" class="btn btn-soft wide" data-act="kyc">${ico('shield')}Повысить лимиты</button>${integ('Подключение: верификация KYC.')}
      <button type="button" class="btn btn-ghost wide" data-act="reset">Сбросить демо-данные</button>` });
  };
  const quickSheet = () => ui.openSheet({ title: 'Что сделать?', html: `<div class="sheet-head"><span class="state-ico">${ico('sparkle')}</span><div><h2>Что сделать?</h2><p>Быстрые действия кошелька</p></div></div>
    <div class="quick-list"><a href="#/wallet" data-act="sheet-close">${ico('down')}<span><b>Пополнить</b><small>Карта, СБП или USDT</small></span></a>
    <a href="#/send" data-act="sheet-close">${ico('up')}<span><b>Перевести</b><small>По номеру кошелька</small></span></a>
    <a href="#/shop" data-act="sheet-close">${ico('shop')}<span><b>Купить карту или подписку</b><small>Витрины сервисов</small></span></a></div>` });

  const A = Lume.acts;
  A.hf = (el) => { hist.f = el.dataset.v; Lume.render(); };
  A['sheet-close'] = () => ui.closeSheet();
  A.op = (el) => { const op = store.get().hist.find((o) => o.id === el.dataset.id); if (op) opSheet(op); };
  A.notifs = notifSheet; A.profile = profileSheet; A.quick = quickSheet;
  A.copy = (el) => ui.copy(el.dataset.text);
  A['copy-id'] = () => ui.copy(D.WALLET_ID, 'Номер кошелька скопирован');
  A.reveal = (el) => { const id = el.dataset.id; const n = new Set(revealed); if (n.has(id)) n.delete(id); else n.add(id); revealed = n; Lume.render(); };
  A.kyc = () => ui.toast('В демо верификация не подключена');
  A.reset = () => { store.reset(); revealed = new Set(); ui.closeSheet(); ui.toast('Демо-данные сброшены'); };
  A.share = async (el) => {
    const op = store.get().hist.find((o) => o.id === el.dataset.id); if (!op) return;
    const text = receiptText(op);
    if (navigator.share) { try { await navigator.share({ title: 'Чек Lume', text }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    ui.copy(text, 'Чек скопирован');
  };
  Lume.views = { ...(Lume.views || {}), history: { title: 'История', html: historyHtml }, purchases: { title: 'Покупки', html: purchasesHtml } };
})();
