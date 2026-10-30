/* Корзина (выезжающая панель), оформление шагами, «Мои заказы». */
(function () {
  'use strict';
  const { esc, fmt, no } = A9;
  const $ = (s, r) => (r || document).querySelector(s);
  A9.forms = {};
  A9.co = { step: 1, errors: {}, done: null };
  const INTEG = 'Подключение: оплата (эквайринг) и доставка (СДЭК), в демо отключены.';

  const thumb = (it) => `<div class="thumb">${A9.art(it, 0)}</div>`;

  function totalsHtml(t, withShip) {
    return `<dl class="totals"><div><dt>Вещи (${t.count})</dt><dd>${fmt(t.sum)}</dd></div>
      ${t.discount ? `<div class="disc"><dt>Промокод ${esc(A9.state.promo)}</dt><dd>−${fmt(t.discount)}</dd></div>` : ''}
      ${withShip ? `<div><dt>Доставка</dt><dd>${t.shipping ? fmt(t.shipping) : 'бесплатно'}</dd></div>` : ''}
      <div class="grand"><dt>${withShip ? 'Итого' : 'Итого без доставки'}</dt><dd>${fmt(withShip ? t.total : t.goods)}</dd></div></dl>`;
  }

  /* ---------- Корзина ---------- */
  A9.cartHtml = () => {
    const t = A9.totals();
    const body = t.count ? `<ul class="dr-list">${t.items.map((it) => `<li class="dr-item">${thumb(it)}
        <div class="dr-info"><span class="mono">${no(it)} · ${esc(it.brand)}</span><a href="#/item/${it.id}" data-act="cart-nav">${esc(it.name)}</a><span class="mono">Размер ${it.size} · ${A9.CONDS[it.cond].label}</span></div>
        <div class="dr-side"><b>${fmt(it.price)}</b><button class="link-btn" data-act="remove" data-id="${it.id}" aria-label="Удалить из корзины: ${esc(it.name)}">Удалить</button></div></li>`).join('')}</ul>`
      : `<div class="empty empty-dr"><div class="empty-big" aria-hidden="true">00</div><h3>Корзина пуста</h3><p>Каждая вещь одна, сохраните понравившиеся в избранное.</p><a class="btn btn-lime" href="#/">В каталог</a></div>`;
    const pct = Math.min(100, Math.round(t.goods / A9.FREE_FROM * 100));
    const foot = t.count ? `<div class="dr-foot">
        <div class="ship"><p>${t.left ? `До бесплатной доставки: <b>${fmt(t.left)}</b>` : '<b>Доставка бесплатная</b>'}</p><div class="bar"><i style="width:${pct}%"></i></div></div>
        ${A9.state.promo ? `<p class="promo-ok">Промокод ${esc(A9.state.promo)} применён: −${A9.PROMO.percent}%</p>` :
          `<form class="promo" data-form="promo" novalidate><label class="sr" for="promo-in">Промокод</label><input id="promo-in" class="input" placeholder="Промокод" autocomplete="off"><button class="btn btn-line" type="submit">Применить</button></form><p class="field-err" id="promo-err" role="alert"></p>`}
        ${totalsHtml(t, false)}
        <a class="btn btn-lime btn-xl" href="#/checkout" data-act="cart-nav">Оформить заказ</a>
        <p class="integ">${INTEG}</p></div>` : '';
    return `<aside class="drawer" role="dialog" aria-modal="true" aria-label="Корзина">
      <div class="dr-head"><h2>Корзина <sup>${t.count}</sup></h2><button class="icon-btn" data-act="close-cart" aria-label="Закрыть корзину">×</button></div>
      <div class="dr-body">${body}</div>${foot}</aside>`;
  };

  A9.forms.promo = (form) => {
    const v = $('#promo-in', form).value;
    if (!v.trim()) { $('#promo-err').textContent = 'Введите промокод'; return; }
    if (!A9.applyPromo(v)) { $('#promo-err').textContent = 'Такого промокода нет. Подсказка: ARCH10'; return; }
    A9.toast(`Промокод применён: −${A9.PROMO.percent}%`);
  };

  A9.acts.remove = (el) => { A9.removeCart(Number(el.dataset.id)); A9.toast('Вещь убрана из корзины'); };

  /* ---------- Оформление ---------- */
  const STEPS = ['Контакты', 'Доставка', 'Проверка'];
  const stepper = () => `<ol class="steps">${STEPS.map((s, i) => `<li class="${A9.co.step === i + 1 ? 'on' : ''}${A9.co.step > i + 1 ? ' done' : ''}"${A9.co.step === i + 1 ? ' aria-current="step"' : ''}><b>0${i + 1}</b><span>${s}</span></li>`).join('')}</ol>`;
  const field = (name, label, attrs, hint) => {
    const err = A9.co.errors[name];
    return `<div class="field${err ? ' bad' : ''}"><label for="f-${name}">${label}</label><input class="input" id="f-${name}" name="${name}" data-in="u" value="${esc(A9.state.user[name])}" ${attrs || ''} ${err ? `aria-invalid="true" aria-describedby="e-${name}"` : ''}>
      ${hint ? `<small>${hint}</small>` : ''}<p class="field-err" id="e-${name}" role="alert">${err ? esc(err) : ''}</p></div>`;
  };

  function sumAside(t) {
    return `<h2>Ваш заказ</h2><ul class="sum-list">${t.items.map((it) => `<li>${thumb(it)}<div><span class="mono">${no(it)} · ${esc(it.brand)}</span><b>${esc(it.name)}</b><span class="mono">Размер ${it.size}</span></div><em>${fmt(it.price)}</em></li>`).join('')}</ul>${totalsHtml(t, true)}`;
  }

  function stepBody(t) {
    const u = A9.state.user, d = A9.state.delivery;
    if (A9.co.step === 1) {
      return `<h2 class="step-h">Кому отправляем</h2>${field('name', 'Имя и фамилия', 'autocomplete="name" placeholder="Анна Смирнова"')}
        ${field('contact', 'Telegram или телефон', 'autocomplete="off" placeholder="@username или +7 900 000-00-00"', 'Напишем, когда соберём заказ')}`;
    }
    if (A9.co.step === 2) {
      const opts = Object.entries(A9.DELIVERY).map(([k, o]) => {
        const free = o.free || t.goods >= A9.FREE_FROM;
        return `<label class="opt${d === k ? ' on' : ''}"><input type="radio" name="delivery" data-in="delivery" value="${k}" ${d === k ? 'checked' : ''}><span class="opt-t"><b>${o.label}</b><small>${o.hint}</small></span><em>${free ? 'бесплатно' : fmt(o.cost)}</em></label>`;
      }).join('');
      return `<h2 class="step-h">Куда и как</h2>${field('city', 'Город', 'autocomplete="address-level2" placeholder="Москва"')}
        <fieldset class="opts"><legend>Способ получения</legend>${opts}</fieldset>
        <div id="addr-wrap">${d === 'pickup' ? '<p class="pick-note">Заберёте в шоуруме: Москва, м. Курская, Нижний Сусальный пер., 5. Адрес пришлём в сообщении.</p>' : field('address', d === 'pvz' ? 'Адрес или код пункта выдачи' : 'Адрес доставки', 'autocomplete="street-address" placeholder="Улица, дом, квартира"')}</div>
        <p class="integ">Бесплатная доставка от ${fmt(A9.FREE_FROM)}. ${INTEG}</p>`;
    }
    const dl = A9.DELIVERY[d];
    return `<h2 class="step-h">Проверьте заказ</h2><dl class="review"><div><dt>Получатель</dt><dd>${esc(u.name)}<br>${esc(u.contact)}</dd></div>
      <div><dt>Получение</dt><dd>${dl.label}, ${esc(u.city)}${d === 'pickup' ? '' : '<br>' + esc(u.address)}</dd></div>
      <div><dt>Оплата</dt><dd>Картой при подтверждении</dd></div></dl>
      <p class="integ">${INTEG}</p>`;
  }

  A9.views.checkout = () => {
    const co = A9.co;
    if (co.done) return doneHtml(co.done);
    const t = A9.totals();
    if (!t.count) return `<section class="page"><div class="empty"><div class="empty-big" aria-hidden="true">00</div><h3>Корзина пуста</h3><p>Добавьте вещи, чтобы оформить заказ.</p><a class="btn btn-lime" href="#/">В каталог</a></div></section>`;
    return `<section class="co"><div class="page-head"><h1>Оформление</h1>${stepper()}</div>
      <div class="co-grid"><form class="co-main" id="co-form" data-form="co" novalidate>${stepBody(t)}
        <div class="co-nav">${co.step > 1 ? '<button type="button" class="btn btn-line" data-act="co-back">Назад</button>' : '<a class="btn btn-line" href="#/">Продолжить выбор</a>'}
        <button class="btn btn-lime btn-xl" type="submit">${co.step === 3 ? `Подтвердить заказ · ${fmt(t.total)}` : 'Далее'}</button></div></form>
        <aside class="co-sum" id="co-sum">${sumAside(t)}</aside></div></section>`;
  };

  const RULES = {
    name: (v) => (v.trim().length >= 2 && /[A-Za-zА-Яа-яЁё]/.test(v) ? '' : 'Укажите имя, минимум 2 буквы'),
    contact: (v) => {
      const x = v.trim(), digits = x.replace(/\D/g, '');
      if (/^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(x)) return '';
      if (/^\+?[\d\s()-]+$/.test(x) && digits.length >= 10 && digits.length <= 12) return '';
      return 'Нужен Telegram (@username) или телефон из 10-11 цифр';
    },
    city: (v) => (v.trim().length >= 2 ? '' : 'Укажите город'),
    address: (v) => (v.trim().length >= 5 ? '' : 'Укажите адрес подробнее')
  };

  function validate(names) {
    const errors = {};
    names.forEach((n) => { const e = RULES[n](A9.state.user[n] || ''); if (e) errors[n] = e; });
    return errors;
  }

  const redraw = () => { $('#view').innerHTML = A9.views.checkout(); window.scrollTo(0, 0); };

  A9.forms.co = () => {
    const co = A9.co, d = A9.state.delivery;
    const names = co.step === 1 ? ['name', 'contact'] : co.step === 2 ? (d === 'pickup' ? ['city'] : ['city', 'address']) : [];
    const errors = validate(names);
    if (Object.keys(errors).length) {
      A9.co = { ...co, errors };
      redraw();
      const first = $('#f-' + Object.keys(errors)[0]);
      if (first) first.focus();
      return;
    }
    if (co.step < 3) { A9.co = { ...co, step: co.step + 1, errors: {} }; redraw(); return; }
    placeOrder();
  };

  A9.acts['co-back'] = () => { A9.co = { ...A9.co, step: Math.max(1, A9.co.step - 1), errors: {} }; redraw(); };

  A9.inputs.u = (el) => {
    A9.setUser({ [el.name]: el.value });
    if (A9.co.errors[el.name]) {
      A9.co = { ...A9.co, errors: { ...A9.co.errors, [el.name]: '' } };
      const p = $('#e-' + el.name); if (p) p.textContent = '';
      el.removeAttribute('aria-invalid');
    }
  };
  A9.inputs.delivery = (el) => {
    A9.set({ delivery: el.value });
    $('#co-sum').innerHTML = sumAside(A9.totals());
    document.querySelectorAll('.opt').forEach((o) => o.classList.toggle('on', o.querySelector('input').checked));
    $('#addr-wrap').innerHTML = el.value === 'pickup' ? '<p class="pick-note">Заберёте в шоуруме: Москва, м. Курская, Нижний Сусальный пер., 5. Адрес пришлём в сообщении.</p>' :
      field('address', el.value === 'pvz' ? 'Адрес или код пункта выдачи' : 'Адрес доставки', 'autocomplete="street-address" placeholder="Улица, дом, квартира"');
  };

  function placeOrder() {
    const t = A9.totals();
    if (!t.count) return;
    const u = A9.state.user;
    const order = {
      id: 'A9-' + (1000 + Math.floor(Math.random() * 9000)), date: new Date().toISOString(),
      items: t.items.map((i) => ({ id: i.id, brand: i.brand, name: i.name, price: i.price, size: i.size })),
      sum: t.sum, discount: t.discount, shipping: t.shipping, total: t.total,
      delivery: A9.state.delivery, city: u.city, name: u.name, contact: u.contact
    };
    A9.set((s) => ({ orders: [order, ...s.orders], cart: [], sold: [...s.sold, ...order.items.map((i) => i.id)], promo: null }));
    A9.co = { step: 1, errors: {}, done: order };
    redraw();
  }

  A9.leaveCheckout = () => { if (A9.co.done || A9.co.step !== 1) A9.co = { step: 1, errors: {}, done: null }; };

  function doneHtml(o) {
    return `<section class="done"><p class="kicker"><span class="dot"></span>ЗАКАЗ ПРИНЯТ</p><h1 class="done-h">Спасибо,<br><span class="lime">${esc(o.name.split(' ')[0])}!</span></h1>
      <p class="lead">Заказ <b class="mono">№${esc(o.id)}</b> на ${fmt(o.total)} оформлен. Вещи сняты с витрины и закреплены за вами. Мы напишем на ${esc(o.contact)}.</p>
      <p class="integ">${INTEG}</p>
      <div class="hero-cta"><a class="btn btn-lime" href="#/orders">Мои заказы</a><a class="btn btn-line" href="#/">В каталог</a></div></section>`;
  }

  /* ---------- Мои заказы ---------- */
  A9.views.orders = () => {
    const list = A9.state.orders;
    const when = (iso) => new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const body = list.length ? list.map((o) => `<article class="order"><header><b class="mono">№${esc(o.id)}</b><span class="status">Принят</span><time>${when(o.date)}</time></header>
      <ul>${o.items.map((i) => { const it = A9.byId(i.id); return `<li>${it ? thumb(it) : ''}<div><span class="mono">${esc(i.brand)} · ${i.size}</span><b>${esc(i.name)}</b></div><em>${fmt(i.price)}</em></li>`; }).join('')}</ul>
      <footer><span>${A9.DELIVERY[o.delivery].label}, ${esc(o.city)}</span><b>${fmt(o.total)}</b></footer></article>`).join('') :
      `<div class="empty"><div class="empty-big" aria-hidden="true">№</div><h3>Заказов пока нет</h3><p>После оформления они появятся здесь.</p><a class="btn btn-lime" href="#/">В каталог</a></div>`;
    return `<section class="page"><div class="page-head"><h1>Мои заказы <sup>${list.length}</sup></h1><p>${INTEG}</p></div><div class="orders">${body}</div></section>`;
  };
})();
