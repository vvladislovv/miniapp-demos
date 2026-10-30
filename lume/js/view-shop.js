/* Витрины: плитки/список, страница витрины, покупка с подтверждением и чеком. */
(() => {
  const { esc, money, whole, find, priceOf, store, uid, genCode, formatPhone, round2 } = Lume;
  const { ico, icoFill, mark } = Lume.art;
  const { topbar, segmented, integ, receipt, receiptActions } = Lume.w;
  const ui = Lume.ui; const D = Lume.data;
  Lume.acts = Lume.acts || {}; Lume.inputs = Lume.inputs || {};
  const shop = { cat: 'all', q: '' };
  let sel = { id: '', vi: 0, phone: '' };
  const fromPrice = (sc) => Math.min(...sc.variants.map((v) => priceOf(sc, v)));

  const visible = () => {
    const q = shop.q.trim().toLowerCase(); const { fav } = store.get();
    return D.SHOWCASES.filter((s) => (shop.cat === 'all' || (shop.cat === 'fav' ? fav.includes(s.id) : s.cats.includes(shop.cat)))
      && (!q || `${s.title} ${s.region}`.toLowerCase().includes(q)));
  };
  const favBtn = (sc) => {
    const on = store.get().fav.includes(sc.id);
    return `<button type="button" class="fav ${on ? 'on' : ''}" data-act="fav" data-id="${sc.id}" aria-pressed="${on}" aria-label="${on ? 'Убрать из избранного' : 'В избранное'}: ${esc(sc.title)}">${on ? icoFill('star') : ico('star')}</button>`;
  };
  const tile = (sc, uniform) => {
    const size = uniform ? '' : sc.size || '';
    return `<article class="stile ${size}" style="--c1:${sc.c[0]};--c2:${sc.c[1]}"><a class="stile-link" href="#/shop/${sc.id}" aria-label="${esc(sc.title)}, ${esc(sc.region)}, от ${whole(fromPrice(sc))}"></a>
      ${mark(sc)}<div class="stile-t"><b>${esc(sc.title)}</b><small>${esc(sc.region)}</small><small class="stile-from">от ${whole(fromPrice(sc))}</small></div>
      <span class="stile-p">от ${whole(fromPrice(sc))}</span>${size === 'hero' ? '<span class="badge hit">Хит</span>' : ''}${favBtn(sc)}</article>`;
  };
  const row = (sc) => `<div class="srow"><a href="#/shop/${sc.id}" class="srow-link" style="--c1:${sc.c[0]};--c2:${sc.c[1]}">${mark(sc, 'sm')}
    <span class="srow-t"><b>${esc(sc.title)}</b><small>${esc(sc.region)} · ${sc.cats.includes('subs') ? 'подписка' : sc.cats.includes('mobile') ? 'связь' : 'карта'}</small></span><span class="srow-p">от ${whole(fromPrice(sc))}</span></a>${favBtn(sc)}</div>`;

  const results = () => {
    const list = visible(); const view = store.get().view;
    if (!list.length) return `<div class="empty"><b>Ничего не найдено</b><span>${shop.cat === 'fav' ? 'Отмечайте витрины звёздочкой, они появятся здесь.' : 'Измените запрос или категорию.'}</span></div>`;
    const uniform = shop.cat !== 'all' || shop.q.trim() !== '';
    return view === 'list' ? `<div class="slist">${list.map(row).join('')}</div>` : `<div class="tiles ${uniform ? 'uniform' : ''}">${list.map((s) => tile(s, uniform)).join('')}</div>`;
  };
  const paintResults = () => { const el = document.getElementById('shop-results'); if (el) el.innerHTML = results(); };

  const shopHtml = () => `${topbar('Витрины', `${D.SHOWCASES.length} сервисов с мгновенной выдачей`)}
    <div class="shop-controls"><label class="search">${ico('search')}<input id="shop-q" type="search" placeholder="Найти витрину" value="${esc(shop.q)}" autocomplete="off" aria-label="Поиск по витринам"></label>
      ${segmented({ label: 'Вид витрин', items: [['tiles', 'Плитки'], ['list', 'Список']], value: store.get().view, act: 'view', cls: 'view-seg' })}</div>
    <div class="scroll-x">${segmented({ label: 'Категории', items: D.CATS, value: shop.cat, act: 'cat', cls: 'cat-seg' })}</div>
    <div id="shop-results" aria-live="polite">${results()}</div>`;

  /* ---------- Страница витрины ---------- */
  const calc = (sc) => {
    const v = sc.variants[sel.vi]; const price = priceOf(sc, v); const bal = store.get().bal;
    return { v, price, fee: price - v[1], bal, short: round2(price - bal) };
  };
  const summary = (sc) => {
    const c = calc(sc);
    return `<dl class="sum"><div><dt>Номинал</dt><dd>${esc(c.v[0])}</dd></div>${c.fee ? `<div><dt>Комиссия витрины</dt><dd>${whole(c.fee)}</dd></div>` : ''}
      <div class="tot"><dt>К оплате</dt><dd>${whole(c.price)}</dd></div><div><dt>Баланс после</dt><dd>${c.short > 0 ? '—' : money(c.bal - c.price)}</dd></div></dl>
      ${c.short > 0 ? `<p class="warn" role="alert">Не хватает ${money(c.short)}. Пополните кошелёк, чтобы купить.</p>` : ''}
      <button type="button" class="btn btn-primary wide" data-act="buy">${c.short > 0 ? 'Пополнить и купить' : `Купить за ${whole(c.price)}`}</button>`;
  };
  const showcaseHtml = (id) => {
    const sc = find(id);
    if (!sc) return `${topbar('Витрина не найдена')}<div class="empty"><b>Такой витрины нет</b><a class="btn btn-primary" href="#/shop">К витринам</a></div>`;
    if (sel.id !== id) sel = { id, vi: sc.def, phone: '' };
    const opts = sc.variants.map((x, i) => `<button type="button" role="radio" aria-checked="${i === sel.vi}" class="opt ${i === sel.vi ? 'on' : ''}" data-act="variant" data-i="${i}"><b>${esc(x[0])}</b><small>${whole(priceOf(sc, x))}</small></button>`).join('');
    const phone = sc.needsPhone ? `<div class="field"><label for="sc-phone">Номер телефона</label><input class="input" id="sc-phone" inputmode="tel" autocomplete="off" placeholder="+7 (900) 000-00-00" value="${esc(formatPhone(sel.phone))}"><p class="field-err" id="sc-err" role="alert"></p></div>` : '';
    return `${topbar(sc.title, sc.region)}
      <a class="back" href="#/shop">${ico('back')}Все витрины</a>
      <section class="sc-hero" style="--c1:${sc.c[0]};--c2:${sc.c[1]}">${mark(sc, 'xl')}<div><h2>${esc(sc.title)}</h2><div class="tags"><span>${esc(sc.region)}</span><span>${sc.needsPhone ? 'Зачисление сразу' : 'Код сразу после оплаты'}</span></div></div>${favBtn(sc)}</section>
      <div class="sc-grid"><section class="panel"><h3>Выберите номинал</h3><div class="opts" role="radiogroup" aria-label="Номинал">${opts}</div>${phone}
        <h3>Как активировать</h3><p class="how">${esc(sc.how)}</p>${integ('Подключение: поставщик кодов (API). В демо код генерируется локально.')}</section>
      <aside class="panel sum-panel" id="sc-sum" aria-label="Сводка заказа">${summary(sc)}</aside></div>`;
  };

  /* ---------- Покупка ---------- */
  const confirmBuy = (sc) => {
    const c = calc(sc);
    ui.openSheet({ title: 'Подтверждение покупки', html: `<div class="sheet-head">${mark(sc)}<div><h2>Подтвердите покупку</h2><p>${esc(sc.title)} · ${esc(c.v[0])}</p></div></div>
      <dl class="sum"><div><dt>Номинал</dt><dd>${esc(c.v[0])}</dd></div>${c.fee ? `<div><dt>Комиссия витрины</dt><dd>${whole(c.fee)}</dd></div>` : ''}${sc.needsPhone ? `<div><dt>Номер</dt><dd>${esc(formatPhone(sel.phone))}</dd></div>` : ''}
      <div class="tot"><dt>К оплате</dt><dd>${whole(c.price)}</dd></div></dl>
      <div class="sheet-actions"><button class="btn btn-soft" data-act="sheet-close">Отмена</button><button class="btn btn-primary" data-act="buy-go" data-autofocus>Оплатить ${whole(c.price)}</button></div>` });
  };
  const noFunds = (short) => ui.openSheet({ title: 'Недостаточно средств', html: `<div class="sheet-head"><span class="state-ico warn">${ico('wallet')}</span><div><h2>Недостаточно средств</h2><p>Не хватает ${money(short)}</p></div></div>
    <p class="how">Пополните кошелёк картой, через СБП или USDT. В демо деньги зачисляются сразу.</p>
    <div class="sheet-actions"><button class="btn btn-soft" data-act="sheet-close">Позже</button><a class="btn btn-primary" href="#/wallet" data-act="sheet-close">Пополнить</a></div>` });

  Lume.acts.variant = (el) => { sel = { ...sel, vi: Number(el.dataset.i) }; Lume.render(); };
  Lume.acts.cat = (el) => { shop.cat = el.dataset.v; Lume.render(); };
  Lume.acts.view = (el) => store.set({ view: el.dataset.v });
  Lume.acts.fav = (el) => { const id = el.dataset.id; const was = store.get().fav.includes(id); store.toggleFav(id); ui.toast(was ? 'Убрано из избранного' : 'Добавлено в избранное'); };
  Lume.inputs['shop-q'] = (el) => { shop.q = el.value; paintResults(); };
  Lume.inputs['sc-phone'] = (el) => {
    const raw = el.value; let d = raw.replace(/\D/g, '');
    if (/^(\+7|7|8)/.test(raw)) d = d.slice(1);
    sel = { ...sel, phone: d.slice(0, 10) };
    el.value = formatPhone(sel.phone);
    const err = document.getElementById('sc-err'); if (err) err.textContent = '';
  };
  Lume.acts.buy = () => {
    const sc = find(sel.id); if (!sc) return;
    if (sc.needsPhone && sel.phone.length !== 10) {
      const err = document.getElementById('sc-err'); if (err) err.textContent = 'Введите номер полностью: 10 цифр после +7';
      document.getElementById('sc-phone')?.focus(); return;
    }
    const c = calc(sc);
    if (c.short > 0) { noFunds(c.short); return; }
    confirmBuy(sc);
  };
  Lume.acts['buy-go'] = () => {
    const sc = find(sel.id); if (!sc) return;
    const snapshot = { ...sel };
    ui.process({ title: 'Оплачиваем и выпускаем код', note: 'Подключение: поставщик кодов (API). В демо код выдаётся сразу.', run: () => {
      const c = calc(sc);
      if (c.short > 0) { ui.closeSheet(true); noFunds(c.short); return; }
      const op = { id: uid(), d: Date.now(), type: 'buy', sc: sc.id, t: sc.title, vl: c.v[0], face: c.v[1], fee: c.fee, v: -c.price, code: sc.needsPhone ? null : genCode(), phone: sc.needsPhone ? snapshot.phone : null };
      store.addOp(op);
      store.notify(sc.needsPhone ? 'Связь пополнена' : 'Покупка готова', sc.needsPhone ? `${formatPhone(op.phone)}: ${c.v[0]} зачислено.` : `${sc.title}, ${c.v[0]}. Код ждёт вас в разделе «Покупки».`);
      ui.setSheet(`<div class="done"><span class="state-ico ok">${ico('check')}</span><h2>${sc.needsPhone ? 'Баланс пополнен' : 'Покупка прошла'}</h2></div>${receipt(op)}${receiptActions(op)}`, { title: 'Чек' });
    } });
  };

  Lume.views = { ...(Lume.views || {}),
    shop: { title: 'Витрины', html: shopHtml },
    showcase: { title: 'Витрина', html: (p) => showcaseHtml(p.id) } };
})();
