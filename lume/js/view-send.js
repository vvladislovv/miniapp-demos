/* Переводы по номеру кошелька: 12 цифр, не себе, достаточно средств, комиссия 1%. */
(() => {
  const { esc, money, whole, group4, store, uid, round2 } = Lume;
  const { ico } = Lume.art;
  const { topbar, integ, receipt, receiptActions } = Lume.w;
  const ui = Lume.ui; const D = Lume.data;
  const sd = { to: '', amt: '', note: '' };
  const amount = () => Number(sd.amt) || 0;
  const feeOf = (a) => (a ? Math.max(1, round2(a * D.TRANSFER_FEE)) : 0);
  const check = () => {
    const a = amount(); const bal = store.get().bal; const total = round2(a + feeOf(a));
    if (sd.to.length !== 12) return ['to', 'Номер кошелька состоит из 12 цифр'];
    if (sd.to === D.WALLET_ID) return ['to', 'Нельзя перевести средства самому себе'];
    if (!a) return ['amt', 'Введите сумму перевода'];
    if (a < D.MIN_TRANSFER) return ['amt', `Минимальный перевод ${whole(D.MIN_TRANSFER)}`];
    if (a > D.MAX_TRANSFER) return ['amt', `Максимум ${whole(D.MAX_TRANSFER)} за один перевод`];
    if (total > bal) return ['amt', `Недостаточно средств: с комиссией нужно ${money(total)}, на балансе ${money(bal)}`];
    return null;
  };
  const calcHtml = (showErr) => {
    const a = amount(); const fee = feeOf(a); const e = check();
    const live = showErr || (sd.to.length === 12 || sd.amt);
    return `<dl class="sum"><div><dt>Сумма</dt><dd>${a ? money(a) : '—'}</dd></div><div><dt>Комиссия 1%</dt><dd>${a ? money(fee) : '—'}</dd></div>
      <div class="tot"><dt>Спишется</dt><dd>${a ? money(a + fee) : '—'}</dd></div></dl>
      <p class="field-err" id="sd-err" role="alert">${e && live && (showErr || sd.amt || sd.to.length === 12) ? esc(e[1]) : ''}</p>`;
  };
  const recent = () => {
    const seen = new Set();
    return store.get().hist.filter((o) => o.type === 'out' && !seen.has(o.to) && seen.add(o.to)).slice(0, 4);
  };
  const html = () => {
    const rec = recent().map((o) => `<button type="button" class="chip-btn" data-act="sd-pick" data-v="${esc(o.to)}">${ico('user')}${group4(o.to)}</button>`).join('');
    return `${topbar('Переводы', 'Мгновенно между кошельками Lume')}
    <div class="send-grid"><section class="panel"><h2 class="panel-t">Новый перевод</h2>
      <div class="field"><label for="sd-to">Номер кошелька получателя</label><input class="input" id="sd-to" inputmode="numeric" autocomplete="off" placeholder="0000 0000 0000" value="${esc(group4(sd.to))}"></div>
      ${rec ? `<p class="muted">Недавние получатели</p><div class="presets">${rec}</div>` : ''}
      <div class="field"><label for="sd-amt">Сумма, ₽</label><input class="input big" id="sd-amt" inputmode="numeric" autocomplete="off" placeholder="500" value="${esc(sd.amt)}"></div>
      <div class="field"><label for="sd-note">Комментарий <span class="muted">(необязательно)</span></label><input class="input" id="sd-note" maxlength="60" autocomplete="off" placeholder="За что перевод" value="${esc(sd.note)}"></div>
      <div id="sd-calc">${calcHtml(false)}</div>
      <button type="button" class="btn btn-primary wide" data-act="sd-go">Перевести</button></section>
      <aside class="panel info-panel"><h3>Как это работает</h3><ul class="steps"><li>Номер кошелька — 12 цифр, его можно скопировать в профиле или на карте.</li><li>Комиссия за перевод — 1%, минимум 1 ₽.</li><li>Лимит одного перевода — ${whole(D.MAX_TRANSFER)}.</li></ul>
        ${integ('Подключение: платёжный шлюз (внутренние переводы) и верификация KYC для крупных сумм.')}</aside></div>`;
  };
  const repaint = () => { const c = document.getElementById('sd-calc'); if (c) c.innerHTML = calcHtml(false); };

  Lume.inputs['sd-to'] = (el) => { sd.to = el.value.replace(/\D/g, '').slice(0, 12); el.value = group4(sd.to); repaint(); };
  Lume.inputs['sd-amt'] = (el) => { sd.amt = el.value.replace(/\D/g, '').slice(0, 6); el.value = sd.amt; repaint(); };
  Lume.inputs['sd-note'] = (el) => { sd.note = el.value; };
  Lume.acts['sd-pick'] = (el) => { sd.to = el.dataset.v; Lume.render(); };
  Lume.acts['sd-go'] = () => {
    const e = check();
    if (e) { const c = document.getElementById('sd-calc'); if (c) c.innerHTML = calcHtml(true); document.getElementById(`sd-${e[0]}`)?.focus(); return; }
    const a = amount(); const to = sd.to; const note = sd.note.trim(); const fee = feeOf(a);
    ui.openSheet({ title: 'Подтверждение перевода', html: `<div class="sheet-head"><span class="state-ico">${ico('send')}</span><div><h2>Подтвердите перевод</h2><p>Кошелёк ${group4(to)}</p></div></div>
      <dl class="sum"><div><dt>Сумма</dt><dd>${money(a)}</dd></div><div><dt>Комиссия 1%</dt><dd>${money(fee)}</dd></div><div class="tot"><dt>Спишется</dt><dd>${money(a + fee)}</dd></div></dl>
      <div class="sheet-actions"><button class="btn btn-soft" data-act="sheet-close">Отмена</button><button class="btn btn-primary" data-act="sd-confirm" data-autofocus>Отправить ${whole(a)}</button></div>` });
  };
  Lume.acts['sd-confirm'] = () => {
    ui.process({ title: 'Отправляем перевод', note: 'Подключение: платёжный шлюз. В демо перевод проходит сразу.', run: () => {
      const e = check();
      if (e) { ui.closeSheet(true); Lume.render(); ui.toast(e[1]); return; }
      const a = amount(); const fee = feeOf(a);
      const op = { id: uid(), d: Date.now(), type: 'out', t: `Перевод ${group4(sd.to)}`, to: sd.to, amt: a, fee, note: sd.note.trim(), v: -round2(a + fee) };
      store.addOp(op); store.notify('Перевод отправлен', `${money(a)} на кошелёк ${group4(op.to)}.`);
      sd.to = ''; sd.amt = ''; sd.note = '';
      ui.setSheet(`<div class="done"><span class="state-ico ok">${ico('check')}</span><h2>Перевод отправлен</h2></div>${receipt(op)}${receiptActions(op)}`, { title: 'Чек перевода' });
    } });
  };
  Lume.views = { ...(Lume.views || {}), send: { title: 'Переводы', html } };
})();
