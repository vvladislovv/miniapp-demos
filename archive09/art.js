/* SVG-иллюстрации одежды: силуэт, фактура ткани, швы, принты. Три ракурса: спереди, сзади, деталь. */
(function () {
  'use strict';
  const hex = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgb = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (c, t, k) => { const a = hex(c), b = hex(t); return rgb(a.map((v, i) => v + (b[i] - v) * k)); };
  const dark = (c, k = 0.3) => mix(c, '#000000', k);
  const light = (c, k = 0.3) => mix(c, '#ffffff', k);
  const FONT = "font-family=\"Unbounded,'Arial Black',Impact,sans-serif\" font-weight=\"900\"";

  const BODY = {
    tee: 'M132 92L168 72Q200 100 232 72L268 92L338 150L308 192L270 170L270 420L130 420L130 170L92 192L62 150Z',
    long: 'M132 92L168 72Q200 100 232 72L268 92L346 330L306 344L270 196L270 430L130 430L130 196L94 344L54 330Z',
    pants: 'M136 70H264L286 450H212L200 200L188 450H114Z',
    shorts: 'M134 100H266L296 310H214L200 200L186 310H104Z'
  };
  const SHAPE = { tee: 'tee', shirt: 'long', knit: 'long', crew: 'long', hoodie: 'long', bomber: 'long', puffer: 'long', denim: 'long', jeans: 'pants', cargo: 'pants', track: 'pants', shorts: 'shorts' };
  const LEFT_CUFF = 'M54 330L94 344L102 319L62 305Z';
  const RIGHT_CUFF = 'M346 330L306 344L298 319L338 305Z';
  const stroke = (d, col, w = 2, extra = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" ${extra}/>`;

  function patterns(u, c, a, tex) {
    const T = {
      denim: `<pattern id="${u}t" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 .5H5" stroke="rgba(255,255,255,.1)"/><path d="M0 3H5" stroke="rgba(0,0,0,.16)"/></pattern>`,
      knit: `<pattern id="${u}t" width="7" height="8" patternUnits="userSpaceOnUse"><path d="M1 0L3.5 4L1 8M4.5 0L7 4L4.5 8" fill="none" stroke="rgba(0,0,0,.2)"/><path d="M2 0L4.5 4L2 8" fill="none" stroke="rgba(255,255,255,.1)"/></pattern>`,
      nylon: `<pattern id="${u}t" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 0H9M0 0V9" stroke="rgba(255,255,255,.1)"/><path d="M4.5 0V9" stroke="rgba(0,0,0,.08)"/></pattern>`,
      ripstop: `<pattern id="${u}t" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 0H12M0 0V12" stroke="rgba(255,255,255,.09)" stroke-width="1.6"/><path d="M6 0V12M0 6H12" stroke="rgba(0,0,0,.1)"/></pattern>`,
      fleece: `<pattern id="${u}t" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".9" fill="rgba(255,255,255,.1)"/><circle cx="4.5" cy="4.5" r=".9" fill="rgba(0,0,0,.12)"/></pattern>`,
      flannel: `<pattern id="${u}t" width="44" height="44" patternUnits="userSpaceOnUse"><rect x="0" width="12" height="44" fill="${a}" fill-opacity=".34"/><rect y="0" width="44" height="12" fill="${a}" fill-opacity=".34"/><path d="M26 0V44M0 26H44" stroke="rgba(0,0,0,.28)" stroke-width="2"/></pattern>`,
      cotton: `<pattern id="${u}t" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="rgba(255,255,255,.12)"/><circle cx="3" cy="3" r=".6" fill="rgba(0,0,0,.1)"/></pattern>`
    };
    return `<defs><linearGradient id="${u}s" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".32" stop-color="#fff" stop-opacity=".08"/><stop offset=".68" stop-color="#000" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>${T[tex] || T.cotton}</defs>`;
  }

  function plaque(it, u) {
    const bg = it.bg, k = it.bgKind, d = dark(bg, 0.14), l = light(bg, 0.35);
    let extra = '';
    if (k === 'grid') extra = `<defs><pattern id="${u}g" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0V25H0" fill="none" stroke="rgba(0,0,0,.13)"/></pattern></defs><rect width="400" height="500" fill="url(#${u}g)"/>`;
    if (k === 'sun') extra = `<circle cx="200" cy="240" r="170" fill="${l}"/><circle cx="200" cy="240" r="120" fill="${d}" opacity=".35"/>`;
    if (k === 'stripes') extra = `<defs><pattern id="${u}g" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="13" height="26" fill="rgba(0,0,0,.1)"/></pattern></defs><rect width="400" height="500" fill="url(#${u}g)"/>`;
    if (k === 'dots') extra = `<defs><pattern id="${u}g" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="3.4" fill="rgba(0,0,0,.16)"/></pattern></defs><rect width="400" height="500" fill="url(#${u}g)"/>`;
    if (k === 'split') extra = `<rect y="330" width="400" height="170" fill="${d}"/><path d="M0 330H400" stroke="rgba(0,0,0,.4)" stroke-width="3"/>`;
    if (k === 'num') extra = `<text x="200" y="360" text-anchor="middle" ${FONT} font-size="300" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="3">${String(it.id).padStart(2, '0')}</text>`;
    if (k === 'hazard') extra = `<defs><pattern id="${u}g" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="15" height="30" fill="rgba(0,0,0,.75)"/></pattern></defs><rect y="468" width="400" height="32" fill="url(#${u}g)"/><rect y="0" width="400" height="14" fill="url(#${u}g)"/>`;
    return `<rect width="400" height="500" fill="${bg}"/>${extra}<ellipse cx="200" cy="462" rx="118" ry="11" fill="rgba(0,0,0,.28)"/>`;
  }

  function printSvg(it, back, kind) {
    const p = it.print || {};
    const mode = back ? p.back : p.front;
    if (!mode || mode === 'none') return '';
    const a = it.a, t = p.text || '';
    const cy = kind === 'hoodie' ? 262 : 214;
    if (mode === 'stripe') return `<rect x="130" y="${cy - 20}" width="140" height="10" fill="${a}"/><rect x="130" y="${cy - 4}" width="140" height="10" fill="${light(a, .6)}"/><rect x="130" y="${cy + 12}" width="140" height="10" fill="${a}"/>`;
    if (mode === 'circle') {
      const r = back ? 52 : 36, y = back ? 230 : cy;
      return `<circle cx="200" cy="${y}" r="${r}" fill="none" stroke="${a}" stroke-width="${r / 5}"/><circle cx="200" cy="${y}" r="${r / 2.4}" fill="${a}"/>`;
    }
    if (mode === 'num') return `<text x="200" y="300" text-anchor="middle" ${FONT} font-size="120" fill="${a}" stroke="${dark(it.c, .5)}" stroke-width="3">${t}</text>`;
    const len = Math.max(t.length, 3);
    if (back) {
      const fs = Math.min(46, Math.floor(125 / (len * 0.74)));
      return `<text x="200" y="250" text-anchor="middle" ${FONT} font-size="${fs}" letter-spacing="1" fill="${a}">${t}</text><rect x="150" y="262" width="100" height="6" fill="${a}"/>`;
    }
    const fs = Math.min(26, Math.floor(118 / (len * 0.74)));
    return `<text x="200" y="${cy}" text-anchor="middle" ${FONT} font-size="${fs}" letter-spacing="1" fill="${a}">${t}</text><rect x="${200 - fs * len * 0.36}" y="${cy + 8}" width="${fs * len * 0.72}" height="4" fill="${a}"/>`;
  }

  function garment(it, back, u) {
    const { c, a, kind } = it;
    const shape = SHAPE[kind], d = BODY[shape];
    const dk = dark(c, 0.5), mid = dark(c, 0.22);
    const fab = (path, fill = c) => `<path d="${path}" fill="${fill}"/><path d="${path}" fill="url(#${u}t)"/><path d="${path}" fill="url(#${u}s)"/><path d="${path}" fill="none" stroke="${dk}" stroke-width="2.6" stroke-linejoin="round"/>`;
    const seam = (p) => stroke(p, 'rgba(0,0,0,.3)', 1.6, 'stroke-dasharray="5 4"');
    const collar = (w = 9) => stroke(back ? 'M166 72Q200 88 234 72' : 'M166 72Q200 116 234 72', mid, w, 'stroke-linecap="round"') + stroke(back ? 'M166 72Q200 88 234 72' : 'M166 72Q200 116 234 72', 'rgba(255,255,255,.14)', 2);
    const cuffs = `<path d="${LEFT_CUFF}${RIGHT_CUFF}" fill="${mid}" stroke="${dk}" stroke-width="2"/>`;
    const hem = `<rect x="130" y="404" width="140" height="26" fill="${mid}" stroke="${dk}" stroke-width="2"/>`;
    const ribLines = (x, y, w, h) => { let s = ''; for (let i = x + 6; i < x + w; i += 7) s += `M${i} ${y}V${y + h}`; return stroke(s, 'rgba(0,0,0,.22)', 1.2); };
    const longSeams = seam('M130 196V404M270 196V404M132 94Q120 150 130 196M268 94Q280 150 270 196');
    const buttons = (x, ys) => ys.map((y) => `<circle cx="${x}" cy="${y}" r="4.2" fill="${light(c, .55)}" stroke="${dk}" stroke-width="1.4"/>`).join('');
    const pr = printSvg(it, back, kind);
    let s = '';

    if (kind === 'tee') {
      s = fab(d) + seam('M130 172V418M270 172V418M132 94Q122 140 130 172M268 94Q278 140 270 172M130 408H270') + collar(10) + pr;
    } else if (kind === 'crew') {
      s = fab(d) + longSeams + cuffs + hem + ribLines(130, 404, 140, 26) + collar(12) + pr;
    } else if (kind === 'hoodie') {
      const hoodBack = `<path d="M148 96Q130 12 200 14Q270 12 252 96Q200 140 148 96Z" fill="${mid}" stroke="${dk}" stroke-width="2.6"/>`;
      const pocket = `<path d="M140 322H260L274 400H126Z" fill="rgba(0,0,0,.1)" stroke="${dk}" stroke-width="2" stroke-dasharray="6 4"/><path d="M146 324L132 396M254 324L268 396" stroke="rgba(0,0,0,.3)" stroke-width="2"/>`;
      if (back) {
        s = hoodBack + fab(d) + longSeams + cuffs + hem + ribLines(130, 404, 140, 26) +
          `<path d="M150 82Q130 170 200 196Q270 170 250 82Q200 62 150 82Z" fill="${c}" stroke="${dk}" stroke-width="2.4"/><path d="M200 70V196" stroke="rgba(0,0,0,.3)" stroke-width="2"/><path d="M150 82Q130 170 200 196Q270 170 250 82Q200 62 150 82Z" fill="url(#${u}t)"/>` + pr;
      } else {
        s = hoodBack + fab(d) + longSeams + cuffs + hem + ribLines(130, 404, 140, 26) + pocket +
          `<path d="M162 80Q200 130 238 80Q230 36 200 34Q170 36 162 80Z" fill="${dark(c, .72)}" stroke="${dk}" stroke-width="3"/>` +
          stroke('M188 114L186 196M212 114L214 196', a, 3, 'stroke-linecap="round"') + `<circle cx="186" cy="200" r="4" fill="${a}"/><circle cx="214" cy="200" r="4" fill="${a}"/>` + pr;
      }
    } else if (kind === 'shirt' || kind === 'denim') {
      const col = back ? stroke('M168 74Q200 92 232 74', mid, 8) :
        `<path d="M166 72L200 120L178 134L150 94Z" fill="${light(c, .1)}" stroke="${dk}" stroke-width="2.2"/><path d="M234 72L200 120L222 134L250 94Z" fill="${light(c, .1)}" stroke="${dk}" stroke-width="2.2"/>`;
      const fine = kind === 'denim' ? 'stroke-dasharray="3 3"' : '';
      const front = back ? seam('M132 96Q200 128 268 96M200 128V430') + stroke('M164 182Q200 196 236 182', 'rgba(0,0,0,.25)', 2) :
        stroke('M200 120V430', dk, 2) + buttons(200, [150, 196, 242, 288, 334, 380]) +
        `<rect x="140" y="188" width="44" height="48" fill="rgba(0,0,0,.08)" stroke="${kind === 'denim' ? a : dk}" stroke-width="2" ${fine}/><rect x="216" y="188" width="44" height="48" fill="rgba(0,0,0,.08)" stroke="${kind === 'denim' ? a : dk}" stroke-width="2" ${fine}/>` +
        (kind === 'denim' ? stroke('M140 214H184M216 214H260', a, 1.6, fine) : '');
      s = fab(d) + longSeams + cuffs + col + front + (kind === 'denim' ? stroke('M130 400H270', a, 1.8, fine) : '');
    } else if (kind === 'knit') {
      const band = `<rect x="130" y="${back ? 0 : 196}" width="140" height="${back ? 0 : 50}" fill="${a}" opacity=".9"/>` + (back ? '' : `<rect x="130" y="196" width="140" height="50" fill="url(#${u}t)"/><path d="M130 221H270" stroke="${dark(c, .6)}" stroke-width="10" stroke-dasharray="10 10"/>`);
      s = fab(d) + longSeams + cuffs + hem + ribLines(130, 404, 140, 26) + collar(14) + band;
    } else if (kind === 'bomber') {
      const zip = back ? seam('M200 112V404') : stroke('M200 118V404', a, 3) + `<rect x="196" y="118" width="8" height="18" rx="2" fill="${light(a, .3)}" stroke="${dk}"/>`;
      s = fab(d) + longSeams + cuffs + hem + ribLines(130, 404, 140, 26) + zip +
        `<path d="M162 66Q200 96 238 66L238 86Q200 128 162 86Z" fill="${mid}" stroke="${dk}" stroke-width="2.2"/>` +
        (back ? '' : `<rect x="76" y="224" width="26" height="18" transform="rotate(-18 89 233)" fill="${a}" stroke="${dk}" stroke-width="1.6"/>`) + pr;
    } else if (kind === 'puffer') {
      let q = '';
      for (let y = 132; y < 400; y += 44) q += `M130 ${y}Q200 ${y + 12} 270 ${y}`;
      s = fab(d) + stroke(q, dk, 3) + stroke(q, 'rgba(255,255,255,.12)', 1.4, 'transform="translate(0 4)"') +
        stroke('M104 150L66 316M296 150L334 316M118 200L82 330M282 200L318 330', dk, 2, 'opacity=".7"') +
        (back ? '' : stroke('M200 120V430', a, 3)) +
        `<path d="M158 64Q200 96 242 64L244 90Q200 132 156 90Z" fill="${mid}" stroke="${dk}" stroke-width="2.4"/>` + pr;
    } else if (shape === 'pants' || shape === 'shorts') {
      const isShort = shape === 'shorts';
      const waist = `<path d="M136 70H264L265 98H135Z" fill="${mid}" stroke="${dk}" stroke-width="2.2"/>`;
      const loops = [146, 176, 224, 254].map((x) => `<rect x="${x - 3}" y="66" width="6" height="36" fill="${dk}" opacity=".55"/>`).join('');
      let det = '';
      if (kind === 'jeans') {
        det = back ? `<path d="M146 124H190V172L168 190L146 172ZM210 124H254V172L232 190L210 172Z" fill="rgba(0,0,0,.08)" stroke="${a}" stroke-width="2" stroke-dasharray="3 3"/><path d="M136 100Q200 140 264 100" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="3 3"/>`
          : stroke('M140 100Q146 160 190 148M260 100Q254 160 210 148', a, 2, 'stroke-dasharray="3 3"') + stroke('M200 98V190Q200 204 186 204', a, 2, 'stroke-dasharray="3 3"') +
            `<circle cx="144" cy="108" r="3" fill="${a}"/><circle cx="256" cy="108" r="3" fill="${a}"/>` +
            stroke('M138 320Q164 332 190 318M262 320Q236 332 210 318', 'rgba(255,255,255,.2)', 12, 'stroke-linecap="round"');
      } else if (kind === 'cargo') {
        det = loops + (back ? `<path d="M146 124H190V168H146ZM210 124H254V168H210Z" fill="rgba(0,0,0,.1)" stroke="${dk}" stroke-width="2"/>`
          : `<path d="M126 268H172V334H124ZM228 268H274V334H276Z" fill="rgba(0,0,0,.1)" stroke="${dk}" stroke-width="2"/><path d="M125 268H172V288H125ZM228 268H275V288H228Z" fill="rgba(0,0,0,.14)" stroke="${dk}" stroke-width="2"/><circle cx="148" cy="283" r="3.5" fill="${a}"/><circle cx="251" cy="283" r="3.5" fill="${a}"/>`)
          + stroke('M200 98V190', dk, 2) + stroke('M114 430H168M232 430H286', a, 3);
      } else if (kind === 'track') {
        det = stroke('M146 104L124 446M155 104L133 446M254 104L276 446M245 104L267 446', a, 4) + stroke('M188 100Q184 134 190 150M212 100Q216 134 210 150', a, 3, 'stroke-linecap="round"') +
          stroke('M116 432H186M214 432H284', 'rgba(0,0,0,.35)', 3);
      } else {
        det = (back ? `<path d="M142 120H188V160H142ZM212 120H258V160H212Z" fill="rgba(0,0,0,.1)" stroke="${dk}" stroke-width="2"/>` : `<path d="M134 110L150 200M266 110L250 200" stroke="${dk}" stroke-width="2"/>` + stroke('M200 98V198', dk, 2)) + stroke('M104 296H186M214 296H296', 'rgba(0,0,0,.3)', 3);
      }
      s = fab(d) + waist + det;
    }
    return s;
  }

  A9.art = function (it, view) {
    const v = view || 0;
    const u = `a${it.id}v${v}`;
    const labelTxt = `${it.brand} ${it.name}, ракурс ${v + 1}`;
    const body = garment(it, v === 1, u);
    let inner;
    if (v === 2) {
      const focusY = SHAPE[it.kind] === 'pants' || SHAPE[it.kind] === 'shorts' ? 150 : 130;
      inner = `<g transform="translate(-200 ${220 - focusY * 2}) scale(2)">${garment(it, false, u)}</g>` +
        `<g transform="rotate(-5 300 420)"><rect x="236" y="384" width="136" height="76" fill="#f2f0e8" stroke="#0b0b0b" stroke-width="3"/><circle cx="248" cy="396" r="4" fill="${it.bg}" stroke="#0b0b0b" stroke-width="2"/>` +
        `<text x="258" y="412" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#0b0b0b">ARCHIVE/09</text>` +
        `<text x="248" y="430" font-family="JetBrains Mono,monospace" font-size="9" fill="#0b0b0b">№${String(it.id).padStart(3, '0')} · 1 OF 1</text>` +
        `<text x="248" y="444" font-family="JetBrains Mono,monospace" font-size="9" fill="#0b0b0b">${it.brand.toUpperCase()}</text>` +
        `<text x="248" y="456" font-family="JetBrains Mono,monospace" font-size="9" fill="#0b0b0b">SIZE ${it.size} · ${it.year}</text></g>`;
    } else {
      inner = body;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${labelTxt}">` +
      patterns(u, it.c, it.a, it.tex) + plaque(it, u) + inner + `</svg>`;
  };
})();
