/* SVG-иллюстрации и иконки Speakeasy. Всё нарисовано кодом. */
(function () {
  const P = {
    home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
    dates: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    memes: 'M4 5h16v11H9l-5 4zM9 10h.01M15 10h.01M9.5 13c1.4 1 3.6 1 5 0',
    spark: 'M12 3l2 6.2L20.5 11 14 13l-2 6.5L10 13 3.5 11 10 9.2z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5',
    back: 'M15 5l-7 7 7 7',
    next: 'M5 12h14M13 6l6 6-6 6',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
    flip: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    x: 'M6 6l12 12M18 6 6 18',
    plus: 'M12 5v14M5 12h14',
    bookmark: 'M7 4h10v16l-5-3.5L7 20z',
    trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
    gift: 'M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0',
    lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
    star: 'M12 3.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8z'
  };
  function icon(name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (P[name] || '') + '"/></svg>';
  }

  /* детерминированный «шум» для окон */
  function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

  function windows(x, y, w, h, seed, cols, rows) {
    const r = rng(seed), cw = w / cols, rh = h / rows;
    let out = '';
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const v = r();
      if (v < 0.42) continue;
      const fill = v > 0.9 ? '#ff5fae' : v > 0.7 ? '#ffd08a' : '#ffb347';
      out += '<rect x="' + (x + i * cw + cw * 0.22).toFixed(1) + '" y="' + (y + j * rh + rh * 0.2).toFixed(1) + '" width="' + (cw * 0.5).toFixed(1) + '" height="' + (rh * 0.5).toFixed(1) + '" rx="1" fill="' + fill + '" opacity="' + (0.5 + v * 0.5).toFixed(2) + '"/>';
    }
    return out;
  }

  const SERIF = 'font-family="Fraunces,Georgia,serif" font-style="italic"';

  function hero() {
    const far = [[0, 190, 70, 150], [60, 150, 60, 190], [115, 210, 80, 130], [190, 130, 70, 210], [255, 175, 90, 165], [340, 120, 64, 220], [400, 185, 80, 155], [475, 140, 70, 200], [540, 200, 90, 140], [625, 125, 70, 215], [690, 170, 80, 170], [765, 140, 70, 200], [830, 190, 80, 150]]
      .map((b) => '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="#1e0f2b"/>').join('');
    const near = [[20, 150, 120, 270, 5, 6, 10], [150, 235, 100, 185, 9, 5, 7], [262, 120, 110, 300, 14, 6, 11], [520, 205, 120, 215, 21, 6, 8], [655, 130, 130, 290, 33, 7, 11], [800, 220, 110, 200, 41, 5, 7]];
    const nearSvg = near.map((b) => '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="#12081c"/>' + windows(b[0] + 6, b[1] + 14, b[2] - 12, b[3] - 40, b[4], b[5], b[6])).join('');
    const letter = (y, ch) => '<text x="300" y="' + y + '" text-anchor="middle" ' + SERIF + ' font-weight="900" font-size="30" fill="#ff7ac0">' + ch + '</text>';
    return '<svg class="hero-art" viewBox="0 0 900 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ночной город с неоновыми вывесками бара">'
      + '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0a2a"/><stop offset=".6" stop-color="#4a1346"/><stop offset="1" stop-color="#ff5a7a" stop-opacity=".7"/></linearGradient>'
      + '<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d26"/><stop offset="1" stop-color="#0b0510"/></linearGradient>'
      + '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
      + '<filter id="glow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>'
      + '<rect width="900" height="420" fill="url(#sky)"/>'
      + '<circle cx="760" cy="74" r="70" fill="#ffb347" opacity=".25" filter="url(#glow2)"/><circle cx="760" cy="74" r="38" fill="#ffd9a3" opacity=".95"/>'
      + '<g opacity=".8">' + far + '</g>' + nearSvg
      + '<g class="sign s1" filter="url(#glow)"><rect x="277" y="150" width="46" height="108" rx="8" fill="#12081c" stroke="#ff3d9a" stroke-width="3"/>' + letter(187, 'B') + letter(222, 'A') + letter(256, 'R') + '</g>'
      + '<g class="sign s2" filter="url(#glow)" fill="none" stroke="#ffb347" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M548 238h58l-29 34zM577 272v28M559 300h36"/><circle cx="598" cy="234" r="7" stroke="#ff3d9a"/></g>'
      + '<g class="sign s3" filter="url(#glow)"><rect x="672" y="300" width="96" height="34" rx="17" fill="none" stroke="#6ef0e0" stroke-width="3"/><text x="720" y="323" text-anchor="middle" font-family="Onest,sans-serif" font-weight="700" font-size="17" letter-spacing="4" fill="#9ff7ec">OPEN</text></g>'
      + '<g class="sign s2" filter="url(#glow)"><text x="80" y="214" text-anchor="middle" ' + SERIF + ' font-weight="700" font-size="25" fill="#ffd08a">speak</text><text x="80" y="242" text-anchor="middle" ' + SERIF + ' font-weight="700" font-size="25" fill="#ffd08a">easy</text></g>'
      + '<rect y="360" width="900" height="60" fill="url(#road)"/>'
      + '<g opacity=".55"><rect x="296" y="362" width="8" height="50" fill="#ff3d9a" filter="url(#glow2)"/><rect x="574" y="362" width="14" height="50" fill="#ffb347" filter="url(#glow2)"/><rect x="705" y="362" width="30" height="40" fill="#6ef0e0" filter="url(#glow2)"/></g>'
      + '<g stroke="#ffffff" stroke-opacity=".25" stroke-width="3" stroke-dasharray="26 22"><path d="M0 395h900"/></g>'
      + '</svg>';
  }

  /* аватар: градиентный круг с инициалом */
  function avatar(name, hue, size) {
    const ch = String(name || '?').trim().charAt(0).toUpperCase() || '?';
    const h = Number.isFinite(hue) ? hue : 300;
    return '<span class="av" style="--h:' + h + ';--s:' + (size || 40) + 'px" aria-hidden="true">' + ch.replace(/[<>&"']/g, '') + '</span>';
  }

  SPK.art = { icon, hero, avatar };
})();
