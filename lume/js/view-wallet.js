/* Кошелёк: баланс, номер, пополнение (карта, СБП, USDT) с комиссиями и проверками. */
(() => {
  const { esc, money, whole, group4, store, uid, round2, monthSpent } = Lume;
  const { ico } = Lume.art;
  const { topbar, segmented, integ, receipt, receiptActions } = Lume.w;
  const ui = Lume.ui; const D = Lume.data;
  const tp = { m: 'card', amt: '' };
  const PRESETS = [500, 1000, 5000, 10000];
  const method = () => D.TOPUP_METHODS.find((x) => x.id === tp.m);
  const amount = () => Number(tp.amt) || 0;
  const check = () => {
    const a = amount();
    if (!a) return 'Введите сумму пополнения';
    if (a < D.MIN_TOPUP) return `Минимальная сумма ${whole(D.MIN_TOPUP)}`;
    if (a > D.MAX_TOPUP) return `Максимум ${whole(D.MAX_TOPUP)} за одно пополнение`;
    return '';
  };
  const calcHtml = () => {
    const a = amount(); const m = method(); const fee = round2(a * m.fee); const pay = a + fee;
    const err = tp.amt ? check() : '';
    return `<dl class="sum"><div><dt>Зачислится</dt><dd>${a ? money(a) : '—'}</dd></div><div><dt>Комиссия ${(m.fee * 100).toFixed(1).replace('.', ',')}%</dt><dd>${a ? money(fee) : '—'}</dd></div>
      <div class="tot"><dt>${tp.m === 'usdt' ? 'К оплате' : 'Спишется'}</dt><dd>${a ? (tp.m === 'usdt' ? `${(pay / D.USDT_RATE).toFixed(2).replace('.', ',')} USDT` : money(pay)) : '—'}</dd></div>
      ${tp.m === 'usdt' && a ? `<div><dt>Курс</dt><dd>1 USDT = ${D.USDT_RATE.toFixed(2).replace('.', ',')} ₽</dd></div>` : ''}</dl>
      <p class="field-err" id="tp-err" role="alert">${esc(err)}</p>`;
  };
  const html = () => {
    const S = store.get(); const used = monthSpent(); const pct = Math.min(100, (used / D.MONTH_LIMIT) * 100);
    const m = method();
    return `${topbar('Кошелёк', 'Баланс, номер и пополнение')}
    <div class="wallet-grid">
      <section class="panel wallet-card"><p class="eyebrow">Баланс</p><div class="bal-big">${ui.bigNum(S.bal)}<span class="bal-cur">₽</span></div>
        <div class="wid"><div><small>Номер кошелька</small><b>${group4(D.WALLET_ID)}</b></div><button type="button" class="btn btn-soft sm" data-act="copy-id">${ico('copy')}Копировать</button></div>
        <div class="limit-bar" role="img" aria-label="Использовано ${Math.round(pct)}% месячного лимита"><i style="width:${pct.toFixed(1)}%"></i></div>
        <p class="muted">Лимит месяца: ${whole(used)} из ${whole(D.MONTH_LIMIT)}</p>${integ('Подключение: верификация KYC для повышения лимитов.')}</section>
      <section class="panel"><h2 class="panel-t">Пополнить кошелёк</h2>
        ${segmented({ label: 'Способ пополнения', items: D.TOPUP_METHODS.map((x) => [x.id, x.name]), value: tp.m, act: 'tp-method' })}
        <p class="muted method-hint">${esc(m.hint)}</p>
        <div class="field"><label for="tp-amt">Сумма, ₽</label><input class="input big" id="tp-amt" inputmode="numeric" autocomplete="off" placeholder="1000" value="${esc(tp.amt)}" aria-describedby="tp-err"></div>
        <div class="presets">${PRESETS.map((v) => `<button type="button" class="chip-btn" data-act="tp-preset" data-v="${v}">${whole(v)}</button>`).join('')}</div>
        <div id="tp-calc">${calcHtml()}</div>
        <button type="button" class="btn btn-primary wide" data-act="tp-go">Пополнить</button>
        ${integ('Подключение: платёжный шлюз (карта, СБП, крипто), в демо зачисляется сразу.')}</section>
    </div>`;
  };

  Lume.acts['tp-method'] = (el) => { tp.m = el.dataset.v; Lume.render(); };
  Lume.acts['tp-preset'] = (el) => { tp.amt = el.dataset.v; Lume.render(); };
  Lume.inputs['tp-amt'] = (el) => {
    el.value = el.value.replace(/\D/g, '').slice(0, 7); tp.amt = el.value;
    const c = document.getElementById('tp-calc'); if (c) c.innerHTML = calcHtml();
  };
  Lume.acts['tp-go'] = () => {
    const err = check();
    if (err) { const e = document.getElementById('tp-err'); if (e) e.textContent = err; document.getElementById('tp-amt')?.focus(); return; }
    const a = amount(); const m = method();
    ui.openSheet({ title: 'Обработка пополнения', html: '' });
    ui.process({ title: 'Обрабатываем пополнение', note: 'Подключение: платёжный шлюз (карта, СБП, крипто), в демо зачисляется сразу.', run: () => {
      const op = { id: uid(), d: Date.now(), type: 'in', t: `Пополнение: ${m.name}`, method: m.id, v: a, fee: round2(a * m.fee) };
      store.addOp(op); store.notify('Кошелёк пополнен', `Зачислено ${money(a)} через «${m.name}».`);
      tp.amt = '';
      ui.setSheet(`<div class="done"><span class="state-ico ok">${ico('check')}</span><h2>Деньги на счёте</h2></div>${receipt(op)}${receiptActions(op)}`, { title: 'Чек пополнения' });
    } });
  };
  Lume.views = { ...(Lume.views || {}), wallet: { title: 'Кошелёк', html } };
})();
