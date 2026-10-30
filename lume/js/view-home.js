/* Главная: bento-сетка с балансом, виртуальной картой, избранным, лимитом и графиком. */
(() => {
  const { esc, money, whole, group4, find, priceOf, store, dailySpend, monthSpent, DAY } = Lume;
  const { ico, mark, ring, spendChart } = Lume.art;
  const { topbar, integ } = Lume.w;
  const D = Lume.data;
  const greet = () => { const h = new Date().getHours(); return h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; };
  const fromPrice = (sc) => Math.min(...sc.variants.map((v) => priceOf(sc, v)));
  const dayName = (t) => new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  const miniTile = (sc) => `<a class="mini" href="#/shop/${sc.id}" style="--c1:${sc.c[0]};--c2:${sc.c[1]}">${mark(sc)}<b>${esc(sc.title)}</b><small>от ${whole(fromPrice(sc))}</small></a>`;

  const html = () => {
    const S = store.get();
    const days = dailySpend(30);
    const total = days.reduce((a, d) => a + d.v, 0);
    const since = Date.now() - 30 * DAY;
    const topped = S.hist.filter((o) => o.type === 'in' && o.d >= since).reduce((a, o) => a + o.v, 0);
    const used = monthSpent(); const pct = used / D.MONTH_LIMIT;
    const favs = S.fav.map(find).filter(Boolean);
    const shown = (favs.length ? favs : D.SHOWCASES).slice(0, 4);
    const first = D.USER_NAME.split(' ')[0];
    return `${topbar(`Привет, ${first}`, `${greet()}. Ваш кошелёк Lume`)}
    <div class="bento">
      <section class="tile balance" aria-labelledby="bal-h">
        <p class="eyebrow" id="bal-h">Доступно сейчас</p>
        <div class="bal-row"><div class="bal-num" id="bal-num" role="status" aria-label="Баланс ${money(S.bal)}"></div><span class="bal-cur">₽</span></div>
        <div class="bal-meta"><span class="chip">Расходы за 30 дней: <b>${whole(total)}</b></span><span class="chip pos">Пополнено: <b>${whole(topped)}</b></span></div>
        <div class="bal-actions"><a class="btn btn-primary" href="#/wallet">${ico('plus')}Пополнить</a><a class="btn btn-soft" href="#/send">${ico('send')}Перевести</a><a class="btn btn-soft" href="#/shop">${ico('shop')}Купить</a></div>
      </section>
      <section class="tile vcard-tile" aria-label="Виртуальная карта Lume"><div class="vcard" id="vcard">
        <div class="vc-top"><span class="vc-brand">Lume</span><span class="vc-type">Virtual</span></div>
        <div class="vc-chip" aria-hidden="true"></div>
        <div class="vc-num" aria-label="Номер кошелька">${group4(D.WALLET_ID)}</div>
        <div class="vc-bot"><div><small>Владелец</small><b>${esc(D.USER_NAME.toUpperCase())}</b></div>
        <button type="button" class="vc-copy" data-act="copy-id" aria-label="Скопировать номер кошелька">${ico('copy')}</button></div></div></section>
      <nav class="quick" aria-label="Быстрые действия">
        <a href="#/wallet">${ico('down')}<span>Пополнить</span></a><a href="#/send">${ico('up')}<span>Перевести</span></a>
        <a href="#/shop">${ico('shop')}<span>Витрины</span></a><a href="#/purchases">${ico('key')}<span>Мои коды</span></a></nav>
      <section class="tile favs"><div class="tile-h"><h2>${favs.length ? 'Избранные витрины' : 'Популярные витрины'}</h2><a href="#/shop">Все витрины</a></div>
        <div class="minis">${shown.map(miniTile).join('')}</div></section>
      <section class="tile limit"><div class="tile-h"><h2>Лимит месяца</h2></div>
        <div class="limit-body"><div class="ring-wrap">${ring(pct)}<div class="ring-c"><b>${Math.round(pct * 100)}%</b><small>использовано</small></div></div>
        <div class="limit-info"><p><b>${whole(used)}</b> из ${whole(D.MONTH_LIMIT)}</p><p class="muted">Осталось ${whole(Math.max(0, D.MONTH_LIMIT - used))}. Уровень: базовый.</p></div></div>
        ${integ('Подключение: верификация KYC повышает лимит до 600 000 ₽.')}</section>
      <section class="tile chart-tile"><div class="tile-h"><h2>Расходы за 30 дней</h2><b class="chart-total">${whole(total)}</b></div>
        <p class="chart-read" id="chart-read" aria-live="polite">Наведите на столбец, чтобы увидеть день. Пунктир показывает средний расход.</p>
        ${spendChart(days)}</section>
    </div>`;
  };

  const mount = (root) => {
    Lume.ui.animateBalance(root.querySelector('#bal-num'), store.get().bal);
    Lume.ui.tilt(root.querySelector('#vcard'));
    const days = dailySpend(30); const read = root.querySelector('#chart-read');
    const show = (e) => { const b = e.target.closest('.bar'); if (!b) return; const d = days[Number(b.dataset.i)]; read.textContent = `${dayName(d.t)}: ${d.v ? whole(d.v) : 'без расходов'}`; };
    const c = root.querySelector('.chart');
    c.addEventListener('mouseover', show); c.addEventListener('focusin', show);
  };
  Lume.views = { ...(Lume.views || {}), home: { title: 'Главная', html, mount } };
})();
