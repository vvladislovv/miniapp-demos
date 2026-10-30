/* Искры: баланс, ежедневный бонус, пакеты (демо-покупка), история. */
(function () {
  const { esc, $, $$, fmt, confirm, toast, confetti } = SPK.ui;
  const { icon } = SPK.art;
  const store = SPK.store;

  const when = (t) => new Date(t).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  SPK.views.sparks = function (root, arg) {
    if (arg) return SPK.replace('sparks');
    const s = store.get();
    const claimed = s.bonusDay === store.todayKey();
    root.innerHTML = '<section class="page"><header class="ph-head"><p class="eyebrow">Раздел 03</p><h1 class="page-h" tabindex="-1">Искры</h1>'
      + '<p class="lead">Искры открывают платные свидания и дают подсказки в диалогах.</p></header>'
      + '<div class="balance"><div><span class="bl">Ваш баланс</span><div class="bn">' + icon('spark') + '<b>' + fmt(s.sparks) + '</b></div></div>'
      + '<button class="btn ' + (claimed ? 'ghost' : 'pri') + '" data-act="bonus"' + (claimed ? ' disabled' : '') + '>' + icon('gift') + (claimed ? 'Бонус получен, приходите завтра' : 'Ежедневный бонус +' + SPK.DAILY_BONUS + ' ✦') + '</button></div>'
      + '<h2 class="sec-h">Пополнить</h2><div class="packs">' + SPK.PACKS.map((p) => '<button class="pack" data-id="' + p.id + '">' + (p.tag ? '<span class="tag">' + esc(p.tag) + '</span>' : '')
        + '<span class="pk-n">' + esc(p.name) + '</span><span class="pk-s">' + icon('spark') + fmt(p.sparks) + '</span><span class="pk-p">' + p.price + ' ₽</span></button>').join('') + '</div>'
      + '<p class="note-int"><span>Подключение</span> оплата (эквайринг). В демо искры начисляются сразу, деньги не списываются.</p>'
      + '<h2 class="sec-h">История</h2>' + (s.log.length ? '<ul class="log">' + s.log.map((e) => '<li><span class="lg-d">' + esc(e.d) + '<small>' + when(e.t) + '</small></span><b class="' + (e.n > 0 ? 'pl' : 'mi') + '">' + (e.n > 0 ? '+' : '−') + fmt(Math.abs(e.n)) + ' ✦</b></li>').join('') + '</ul>' : '<p class="empty">Операций пока нет. Откройте сценарий или заберите бонус.</p>') + '</section>';

    root.onclick = async (e) => {
      const b = e.target.closest('[data-act], .pack');
      if (!b) return;
      if (b.dataset.act === 'bonus') {
        store.update((c) => c.bonusDay === store.todayKey() ? c : { ...store.award(c, { sparks: SPK.DAILY_BONUS, why: 'Ежедневный бонус' }), bonusDay: store.todayKey() });
        toast('+' + SPK.DAILY_BONUS + ' ✦ за сегодня'); confetti(); SPK.views.sparks(root);
      } else if (b.classList.contains('pack')) {
        const p = SPK.PACKS.find((x) => x.id === b.dataset.id);
        if (!p) return;
        const ok = await confirm({ title: 'Пакет «' + p.name + '»', body: 'Начислим <b>' + fmt(p.sparks) + ' ✦</b> за ' + p.price + ' ₽.<br><small>Подключение: оплата (эквайринг), в демо начисляется сразу.</small>', ok: 'Купить за ' + p.price + ' ₽' });
        if (!ok) return;
        store.update((c) => store.award(c, { sparks: p.sparks, why: 'Покупка пакета «' + p.name + '»' }));
        toast('Начислено ' + fmt(p.sparks) + ' ✦ (демо)'); confetti(); SPK.views.sparks(root);
      }
    };
    return () => { root.onclick = null; };
  };
})();
