/* Страница товара, быстрый просмотр, похожие и недавно просмотренное. */
(function () {
  'use strict';
  const { esc, fmt, no } = A9;
  const $ = (s, r) => (r || document).querySelector(s);
  const VIEWS = ['Спереди', 'Сзади', 'Деталь'];

  function buyBtn(it, cls) {
    if (A9.isSold(it)) return `<button class="btn ${cls || ''} btn-dead" disabled>Продано</button>`;
    if (A9.inCart(it.id)) return `<a class="btn btn-line ${cls || ''}" href="#/cart">В корзине. Открыть</a>`;
    return `<button class="btn btn-lime ${cls || ''}" data-act="add" data-id="${it.id}">В корзину · ${fmt(it.price)}</button>`;
  }
  A9.buyBtn = buyBtn;

  function favBtn(it) {
    const on = A9.isFav(it.id);
    return `<button class="btn btn-line btn-fav${on ? ' on' : ''}" data-act="fav" data-id="${it.id}" aria-pressed="${on}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21s-8-5.300-8-11a4.500 4.500 0 018-2.800A4.500 4.500 0 0120 10c0 5.700-8 11-8 11z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.400" stroke-linejoin="round"/></svg><span>${on ? 'В избранном' : 'В избранное'}</span></button>`;
  }

  function miniRow(title, items) {
    if (!items.length) return '';
    return `<section class="strip"><div class="strip-head"><h2>${title}</h2></div><div class="grid grid-strip">${items.map((it) => A9.card(it, { noQuick: true })).join('')}</div></section>`;
  }

  A9.views.item = (id) => {
    const it = A9.byId(id);
    if (!it) return notFound();
    const sold = A9.isSold(it), cond = A9.CONDS[it.cond];
    const recent = A9.state.recent.filter((x) => x !== it.id).map(A9.byId).filter(Boolean).slice(0, 4);
    return `<article class="pdp" data-id="${it.id}">
      <nav class="crumbs" aria-label="Путь"><a href="#/">Каталог</a><span>/</span><span>${esc(A9.catLabel(it.cat))}</span><span>/</span><b>${esc(it.name)}</b></nav>
      <div class="pdp-grid">
        <div class="gal-wrap">
          <div class="gal" id="gal" tabindex="0" aria-label="Галерея, листайте">${VIEWS.map((v, i) => `<figure class="gal-fig">${A9.art(it, i)}<figcaption>${v}</figcaption>${sold && i === 0 ? '<span class="stamp stamp-lg" aria-hidden="true">SOLD</span>' : ''}</figure>`).join('')}<div class="gal-tile" aria-hidden="true"><b>${no(it)}</b><span>${esc(it.brand)}</span><span>1 OF 1 · ARCHIVE/09</span><em>${esc(it.mat)}</em></div></div>
          <div class="gal-dots" id="gal-dots" aria-hidden="true">${VIEWS.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
        </div>
        <aside class="buy">
          <div class="buy-top"><span class="tagno">${no(it)}</span><span class="tagno tagno-o">1 OF 1</span>${it.drop && !sold ? `<span class="tagno tagno-l">DROP ${A9.DROP_NO}</span>` : ''}</div>
          <p class="buy-brand">${esc(it.brand)} · ${esc(it.year)}</p>
          <h1 class="buy-name">${esc(it.name)}</h1>
          <p class="buy-price">${fmt(it.price)}</p>
          <div class="cond-box"><div class="cond-top">${A9.meter(it.cond)}<b>${cond.label}</b><span>${it.cond}/5</span></div><p>${cond.note}</p></div>
          <div class="size-row"><span>Размер</span><b class="size-one">${it.size}</b><em>единственный, вещь одна</em></div>
          <div class="buy-actions">${buyBtn(it, 'btn-xl')}${favBtn(it)}</div>
          <p class="buy-note">${sold ? 'Эту вещь уже купили. Посмотрите похожие ниже.' : 'В корзине вещь не резервируется: её может купить другой человек.'}</p>
          <details class="acc" open><summary>Описание</summary><p>${esc(it.desc)}</p></details>
          <details class="acc"><summary>Замеры, см</summary><table class="meas"><tbody>${it.meas.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody></table></details>
          <details class="acc"><summary>Материал и происхождение</summary><p>${esc(it.mat)}. Год: ${esc(it.year)}. Бренд ${esc(it.brand)}, оригинальные бирки сохранены.</p></details>
          <details class="acc"><summary>Доставка и оплата</summary><p>Самовывоз бесплатно. Пункт выдачи СДЭК от 290 ₽, курьер от 490 ₽. Бесплатно от ${fmt(A9.FREE_FROM)}.</p><p class="integ">Подключение: оплата (эквайринг) и доставка (СДЭК), в демо отключены.</p></details>
        </aside>
      </div>
      ${miniRow('Похожие вещи', A9.similar(it))}
      ${miniRow('Недавно просмотрено', recent)}
      <div class="buybar" id="buybar"><div><span>${no(it)}</span><b>${fmt(it.price)}</b></div>${buyBtn(it, 'btn-bar')}</div>
    </article>`;
  };

  function notFound() {
    return `<section class="page"><div class="empty"><div class="empty-big" aria-hidden="true">404</div><h3>Такой вещи нет в архиве</h3><p>Возможно, ссылка устарела.</p><a class="btn btn-lime" href="#/">В каталог</a></div></section>`;
  }

  A9.mounts.item = () => {
    const gal = $('#gal'), dots = document.querySelectorAll('#gal-dots i');
    if (!gal) return;
    gal.addEventListener('scroll', () => {
      const i = Math.round(gal.scrollLeft / Math.max(1, gal.clientWidth));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
    }, { passive: true });
  };

  /* Быстрый просмотр (ПК) */
  A9.quickView = (id) => {
    const it = A9.byId(id);
    if (!it) return;
    A9.openLayer('modal', `<div class="qv" role="dialog" aria-modal="true" aria-label="Быстрый просмотр: ${esc(it.name)}">
      <button class="icon-btn qv-x" data-act="close-layer" aria-label="Закрыть">×</button>
      <div class="qv-art"><div class="qv-main" id="qv-main">${A9.art(it, 0)}</div>
        <div class="qv-thumbs">${VIEWS.map((v, i) => `<button class="qv-th${i ? '' : ' on'}" data-act="qv-view" data-id="${it.id}" data-v="${i}" aria-label="${v}">${A9.art(it, i)}</button>`).join('')}</div></div>
      <div class="qv-info"><div class="buy-top"><span class="tagno">${no(it)}</span><span class="tagno tagno-o">1 OF 1</span></div>
        <p class="buy-brand">${esc(it.brand)} · ${esc(it.year)}</p><h2 class="buy-name">${esc(it.name)}</h2><p class="buy-price">${fmt(it.price)}</p>
        <div class="cond-box"><div class="cond-top">${A9.meter(it.cond)}<b>${A9.CONDS[it.cond].label}</b></div></div>
        <div class="size-row"><span>Размер</span><b class="size-one">${it.size}</b></div>
        <p class="qv-desc">${esc(it.desc)}</p>
        <div class="buy-actions">${buyBtn(it, 'btn-xl')}<a class="btn btn-line" href="#/item/${it.id}" data-act="close-layer">Полная страница</a></div></div></div>`);
  };

  A9.acts.quick = (el) => A9.quickView(Number(el.dataset.id));
  A9.acts['qv-view'] = (el) => {
    const it = A9.byId(el.dataset.id), v = Number(el.dataset.v);
    $('#qv-main').innerHTML = A9.art(it, v);
    document.querySelectorAll('.qv-th').forEach((b) => b.classList.toggle('on', b === el));
  };
})();
