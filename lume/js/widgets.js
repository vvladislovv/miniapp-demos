/* Lume: общие блоки интерфейса: верхняя панель, сегменты, строки операций, чек-билет, правая колонка. */
(() => {
  const { esc, money, whole, date, group4, find, store, formatPhone, dayLabel } = Lume;
  const { ico, mark, brandMark, barcode } = Lume.art;
  const D = Lume.data;
  const TYPE = {
    in: { icon: 'down', label: 'Пополнение' },
    buy: { icon: 'bag', label: 'Покупка' },
    out: { icon: 'up', label: 'Перевод' }
  };

  const topbar = (title, sub = '') => {
    const S = store.get(); const n = store.unread();
    return `<header class="topbar"><a class="tb-logo" href="#/" aria-label="Lume, на главную">${brandMark('sm')}</a>
      <div class="tb-title"><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
      <div class="tb-right"><a class="bal-pill" href="#/wallet" aria-label="Баланс ${whole(S.bal)}">${ico('wallet')}<b>${whole(S.bal)}</b></a>
      <button class="icon-btn" data-act="notifs" aria-label="Уведомления${n ? `, непрочитанных: ${n}` : ''}">${ico('bell')}${n ? `<i class="dot">${n}</i>` : ''}</button>
      <button class="avatar" data-act="profile" aria-label="Профиль">${D.USER_INITIALS}</button></div></header>`;
  };

  const segmented = ({ label, items, value, act, cls = '' }) => `<div class="seg ${cls}" role="radiogroup" aria-label="${esc(label)}">${items.map(([id, name]) =>
    `<button type="button" role="radio" aria-checked="${id === value}" class="${id === value ? 'on' : ''}" data-act="${act}" data-v="${esc(id)}">${esc(name)}</button>`).join('')}</div>`;

  const integ = (text) => `<p class="integ">${ico('sparkle')}<span>${esc(text)}</span></p>`;

  const opRow = (op) => {
    const m = TYPE[op.type] || TYPE.buy;
    const sub = op.type === 'buy' && op.vl ? `${esc(op.vl)} · ` : '';
    return `<button type="button" class="op" data-act="op" data-id="${esc(op.id)}"><span class="op-ico ${op.type}">${ico(m.icon)}</span>
      <span class="op-main"><b>${esc(op.t)}</b><small>${sub}${date(op.d)}</small></span>
      <span class="op-sum ${op.v > 0 ? 'pos' : ''}">${op.v > 0 ? '+' : '−'}${money(Math.abs(op.v))}</span></button>`;
  };

  /* ---------- Чек-билет с перфорацией ---------- */
  const tone = (op) => (op.type === 'buy' && find(op.sc) ? find(op.sc).c : op.type === 'in' ? ['#14c7b0', '#2f80ed'] : ['#5b3df5', '#9b7bff']);
  const rowsOf = (op) => {
    const phone = op.phone ? [['Номер', formatPhone(op.phone)]] : [];
    if (op.type === 'buy') return [['Номинал', op.vl], ...(op.fee ? [['Комиссия витрины', whole(op.fee)]] : []), ...phone, ['Итого', money(-op.v)]];
    if (op.type === 'in') return [['Способ', (D.TOPUP_METHODS.find((x) => x.id === op.method) || {}).name || '—'], ['Зачислено', money(op.v)], ['Комиссия', money(op.fee)], ['Списано с источника', money(op.v + op.fee)]];
    return [['Кошелёк получателя', group4(op.to)], ['Сумма', money(op.amt)], ['Комиссия', money(op.fee)], ...(op.note ? [['Комментарий', op.note]] : []), ['Списано', money(-op.v)]];
  };
  const receipt = (op, { reveal = true } = {}) => {
    const [c1, c2] = tone(op); const sc = op.type === 'buy' ? find(op.sc) : null;
    const m = sc ? mark(sc, 'sm') : brandMark('sm');
    const rows = [['Дата', date(op.d)], ['Операция', `№ ${op.id.toUpperCase().slice(0, 10)}`], ...rowsOf(op)];
    const code = op.code ? `<div class="codebox"><div><small>Код активации</small><b class="code-val">${reveal ? esc(op.code) : esc(maskCode(op.code))}</b></div>
      <button type="button" class="btn btn-soft sm" data-act="copy" data-text="${esc(op.code)}">${ico('copy')}Копировать</button></div>` : '';
    return `<div class="ticket" style="--c1:${c1};--c2:${c2}"><div class="ticket-top">${m}<div><small>${TYPE[op.type].label} · Lume</small><b>${esc(op.t)}</b></div>
      <div class="ticket-sum ${op.v > 0 ? 'pos' : ''}">${op.v > 0 ? '+' : '−'}${money(Math.abs(op.v))}</div></div>
      <div class="perf" aria-hidden="true"></div>
      <dl class="ticket-rows">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${code}
      <div class="perf" aria-hidden="true"></div><div class="ticket-foot">${barcode(op.id)}<small>Демо-чек, не является платёжным документом</small></div></div>`;
  };
  const maskCode = (c) => c.replace(/[A-Z0-9]/g, '•').replace(/•{4}$/, c.slice(-4));
  const receiptText = (op) => [`Lume · чек № ${op.id.toUpperCase().slice(0, 10)}`, op.t, ...rowsOf(op).map(([k, v]) => `${k}: ${v}`), `Дата: ${date(op.d)}`].join('\n');
  const receiptActions = (op) => `<div class="sheet-actions"><button class="btn btn-soft" data-act="share" data-id="${esc(op.id)}">${ico('share')}Поделиться</button>
    <button class="btn btn-primary" data-act="sheet-close" data-autofocus>Готово</button></div>`;

  /* ---------- Правая колонка ---------- */
  const aside = () => {
    const S = store.get();
    const ops = S.hist.slice(0, 6).map(opRow).join('');
    const notes = S.notif.slice(0, 3).map((n) => `<li class="${n.read ? '' : 'unread'}"><b>${esc(n.t)}</b><span>${esc(n.s)}</span><small>${dayLabel(n.d)}</small></li>`).join('');
    const rates = D.RATES.map(([a, b, v, ch]) => `<li><b>${a}</b><span>${v.toFixed(2).replace('.', ',')} ${b}</span><em class="${ch >= 0 ? 'pos' : 'neg'}">${ch >= 0 ? '+' : '−'}${Math.abs(ch).toFixed(1).replace('.', ',')}%</em></li>`).join('');
    return `<section class="panel"><div class="panel-h"><h2>Лента операций</h2><a href="#/history">Все</a></div><div class="ops">${ops || '<p class="muted">Пока пусто</p>'}</div></section>
      <section class="panel"><div class="panel-h"><h2>Уведомления</h2><button type="button" class="link-btn" data-act="notifs">Открыть</button></div><ul class="notes">${notes}</ul></section>
      <section class="panel"><div class="panel-h"><h2>Курсы</h2><span class="badge">заглушка</span></div><ul class="rates">${rates}</ul>${integ('Демо-данные. Подключение: источник котировок в реальном времени.')}</section>`;
  };
  Lume.w = { topbar, segmented, integ, opRow, receipt, receiptText, receiptActions, aside, maskCode, TYPE };
})();
