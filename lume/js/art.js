/* Lume: иконки интерфейса, стилизованные марки витрин, SVG-графики. Только SVG, без внешних файлов. */
(() => {
  const ICONS = {
    home: 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
    shop: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    wallet: 'M4 7a2 2 0 0 1 2-2h12v3M4 7v10a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6a2 2 0 0 1-2-1zM16 13.5h2',
    send: 'M7 17L17 7M8 7h9v9',
    history: 'M4 12a8 8 0 1 0 3-6.2M4 4v4h4M12 8v4l3 2',
    bag: 'M5 8h14l-1 12H6zM9 8V7a3 3 0 0 1 6 0v1',
    bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0',
    plus: 'M12 5v14M5 12h14',
    down: 'M12 5v14M6 13l6 6 6-6',
    up: 'M12 19V5M6 11l6-6 6 6',
    copy: 'M9 9h10v11H9zM5 15V4h10',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    eyeoff: 'M3 3l18 18M10.5 6.2A9 9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.3 3.8M6.5 7.6A17 17 0 0 0 2 12s4 7 10 7a9 9 0 0 0 3.5-.7',
    star: 'M12 3.5l2.6 5.4 5.9.8-4.300 4.100 1 5.800-5.200-2.800-5.200 2.800 1-5.800-4.300-4.100 5.900-.8z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
    close: 'M6 6l12 12M18 6L6 18',
    check: 'M5 12.5l4.500 4.500L19 7',
    share: 'M12 15V4M7 8l5-5 5 5M5 13v6h14v-6',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0',
    list: 'M4 7h16M4 12h16M4 17h16',
    tiles: 'M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z',
    shield: 'M12 3l7 3v6c0 4.500-3 7.500-7 9-4-1.500-7-4.500-7-9V6z',
    card: 'M3 6h18v12H3zM3 10h18',
    back: 'M15 5l-7 7 7 7',
    key: 'M14 10a4 4 0 1 0-3.500 4L20 14v3h-3v-3M8 9h.01',
    sparkle: 'M12 3c.8 5.500 2.500 7.200 8 8-5.500.8-7.200 2.500-8 8-.8-5.500-2.500-7.200-8-8 5.500-.8 7.200-2.500 8-8z'
  };
  const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;
  const icoFill = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;

  // Стилизованные марки (48x48), нарисованы с нуля и не повторяют оригинальные знаки.
  const W = 'stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const MARKS = {
    lume: '<path d="M24 6c1.400 9.200 4.800 12.600 14 14-9.200 1.400-12.600 4.800-14 14-1.400-9.200-4.800-12.600-14-14 9.200-1.400 12.600-4.800 14-14z" fill="#fff"/><circle cx="37" cy="37" r="3.500" fill="#fff" opacity=".7"/>',
    apple: '<circle cx="19" cy="28" r="9" fill="#fff"/><circle cx="29" cy="28" r="9" fill="#fff"/><path d="M24 20c0-5 2-8 6-9-.2 4-2 7-6 9z" fill="#fff" opacity=".85"/>',
    spotify: `<g ${W}><path d="M11 18c8-3 18-2.500 26 2"/><path d="M13 26c7-2 14-1.600 21 1.800"/><path d="M15 33.500c5.500-1.400 10.500-1 15.500 1.400"/></g>`,
    tg: '<path d="M7 23L41 9l-7 30-11-8-6 7-1-10z" fill="#fff"/><path d="M16 29l17-13" stroke="rgba(0,0,0,.28)" stroke-width="2" fill="none"/>',
    steam: `<circle cx="30" cy="19" r="8" ${W}/><circle cx="30" cy="19" r="2.600" fill="#fff"/><circle cx="15" cy="32" r="6" fill="#fff"/><path d="M20 29l7-6" ${W}/>`,
    reel: '<circle cx="24" cy="24" r="15" fill="none" stroke="#fff" stroke-width="3.400"/><g fill="#fff"><circle cx="24" cy="16" r="3"/><circle cx="24" cy="32" r="3"/><circle cx="16" cy="24" r="3"/><circle cx="32" cy="24" r="3"/><circle cx="24" cy="24" r="2"/></g>',
    ps: `<g stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M24 9l5.500 9h-11z"/><circle cx="38" cy="24" r="5"/><path d="M6 19l9 9M15 19l-9 9"/><rect x="19.500" y="32" width="9" height="9" rx="1.500"/></g>`,
    xbox: `<circle cx="24" cy="24" r="16" ${W}/><path d="M16.500 16.500l15 15M31.500 16.500l-15 15" ${W}/>`,
    play: '<path d="M14 9l22 15-22 15z" fill="#fff"/><path d="M14 9l13 15-13 15" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2"/>',
    roblox: '<rect x="11" y="11" width="26" height="26" rx="5" transform="rotate(14 24 24)" fill="#fff"/><rect x="20" y="20" width="8" height="8" rx="1.500" transform="rotate(14 24 24)" fill="rgba(0,0,0,.35)"/>',
    vcoin: `<circle cx="24" cy="24" r="16" ${W}/><path d="M16.500 18l7.500 14 7.500-14" ${W}/>`,
    chat: '<path d="M10 17c0-3 2-5 5-5h18c3 0 5 2 5 5v14c0 3-2 5-5 5H15l-5 4z" fill="#fff"/><circle cx="19" cy="24" r="2.800" fill="rgba(0,0,0,.4)"/><circle cx="29" cy="24" r="2.800" fill="rgba(0,0,0,.4)"/>',
    plus: '<path d="M20 9h8v11h11v8H28v11h-8V28H9v-8h11z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>',
    phone: `<rect x="14" y="8" width="20" height="32" rx="5" ${W}/><circle cx="24" cy="33" r="2" fill="#fff"/><path d="M38 14c2 2 3 4 3 7M10 14c-2 2-3 4-3 7" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>`
  };
  const mark = (sc, cls = '') => `<span class="mark ${cls}" style="--c1:${sc.c[0]};--c2:${sc.c[1]}"><svg viewBox="0 0 48 48" aria-hidden="true">${MARKS[sc.mark]}</svg></span>`;
  const brandMark = (cls = '') => mark({ c: ['#5b3df5', '#9b7bff'], mark: 'lume' }, cls);

  let ringId = 0;
  const ring = (pct) => {
    const id = `rg${++ringId}`; const r = 54; const c = 2 * Math.PI * r; const p = Math.min(1, Math.max(0, pct));
    return `<svg class="ring" viewBox="0 0 140 140" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b3df5"/><stop offset="1" stop-color="#14c7b0"/></linearGradient></defs>
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="rgba(91,61,245,.12)" stroke-width="14"/>
      <circle class="ring-arc" cx="70" cy="70" r="${r}" fill="none" stroke="url(#${id})" stroke-width="14" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 70 70)"/></svg>`;
  };

  // Столбчатый график расходов за N дней.
  const spendChart = (days) => {
    const W0 = 480; const H = 170; const padB = 6; const gap = 4;
    const bw = (W0 - gap * (days.length - 1)) / days.length;
    const max = Math.max(1, ...days.map((d) => d.v));
    const avg = days.reduce((a, d) => a + d.v, 0) / days.length;
    const plotH = H - padB - 8;
    const bars = days.map((d, i) => {
      const h = d.v > 0 ? Math.max(6, (d.v / max) * plotH) : 3;
      const x = i * (bw + gap);
      return `<rect class="bar ${d.v > 0 ? 'has' : ''}" data-i="${i}" tabindex="0" x="${x.toFixed(1)}" y="${(H - padB - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(6, bw / 2).toFixed(1)}"><title>${new Date(d.t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}: ${Math.round(d.v)} ₽</title></rect>`;
    }).join('');
    const ay = H - padB - (avg / max) * plotH;
    const lab = (i) => `<span>${new Date(days[i].t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>`;
    return `<svg class="chart" viewBox="0 0 ${W0} ${H}" role="img" aria-label="Расходы за 30 дней, столбчатый график">
      <defs><linearGradient id="barg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5cff"/><stop offset="1" stop-color="#5b3df5"/></linearGradient></defs>
      <line x1="0" x2="${W0}" y1="${(H - padB).toFixed(1)}" y2="${(H - padB).toFixed(1)}" stroke="rgba(20,19,43,.1)"/>
      ${avg > 0 ? `<line x1="0" x2="${W0}" y1="${ay.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="#14c7b0" stroke-width="2" stroke-dasharray="5 6"/>` : ''}
      ${bars}</svg><div class="chart-axis" aria-hidden="true">${lab(0)}${lab(14)}${lab(days.length - 1)}</div>`;
  };

  // Декоративный штрихкод по строке.
  const barcode = (seed) => {
    let h = 7; const bars = []; let x = 0;
    for (const ch of `${seed}${seed}${seed}`) { h = (h * 31 + ch.charCodeAt(0)) % 9973; const w = 1 + (h % 3); if (h % 2) bars.push(`<rect x="${x}" y="0" width="${w}" height="34"/>`); x += w + 1; if (x > 188) break; }
    return `<svg class="barcode" viewBox="0 0 190 34" preserveAspectRatio="none" aria-hidden="true" fill="currentColor">${bars.join('')}</svg>`;
  };
  Lume.art = { ico, icoFill, mark, brandMark, ring, spendChart, barcode };
})();
