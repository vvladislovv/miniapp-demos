/* SVG-иконки и маскот Speakeasy (облачко-реплика Спик). Всё нарисовано кодом. */
(function () {
  const P = {
    home: 'M3.5 11.5 12 4l8.5 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5',
    dates: 'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z',
    memes: 'M4 5.5h16v11H10l-5 4v-4H4zM9 10.2h.01M15 10.2h.01M9.4 13c1.5 1.2 3.7 1.2 5.2 0',
    spark: 'M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.8 3.8-5.8 7.5-5.8s6.7 2 7.5 5.8',
    back: 'M15 5l-7 7 7 7',
    next: 'M5 12h14M13 6l6 6-6 6',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    x: 'M6 6l12 12M18 6 6 18',
    bookmark: 'M7 4h10v16l-5-3.5L7 20z',
    trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
    gift: 'M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0',
    lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
    translate: 'M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 5.5 7M11.5 6c-.5 3-3 6-7 8M13 20l4-9 4 9M14.5 17h5'
  };
  const icon = (name, cls) => '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (P[name] || '') + '"/></svg>';

  /* заливные «стикерные» иконки */
  const flame = (cls) => '<svg class="ic fill ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.8 4 5.2 6 5.2 11a5.2 5.2 0 0 1-10.4 0c0-2.2 1-3.5 2.2-4.6.1 2 .9 3 2 3.2C10.6 8.6 10.6 5.4 12 2.5z" fill="#FF5A3C" stroke="#1B1530" stroke-width="2" stroke-linejoin="round"/><path d="M12 12.5c1.3 1.2 2 2.2 2 3.4a2 2 0 0 1-4 0c0-1.2.9-2.2 2-3.4z" fill="#FFD23F"/></svg>';
  const sparkFill = (cls) => '<svg class="ic fill ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" fill="#FFD23F" stroke="#1B1530" stroke-width="2" stroke-linejoin="round"/></svg>';
  const star = (on) => '<svg class="star' + (on ? ' on' : '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z" fill="' + (on ? '#FFD23F' : '#fff') + '" stroke="#1B1530" stroke-width="2" stroke-linejoin="round"/></svg>';

  /* маскот Спик: облачко-реплика с глазами и румянцем. mood: happy | wink | sad | party */
  const BODY = 'M44 92C16 94 4 66 24 56C16 34 40 18 58 28C70 10 102 16 100 40C122 46 120 78 98 84C90 98 68 98 58 91L30 108Z';
  const FACE = {
    happy: '<ellipse cx="48" cy="54" rx="5" ry="7" fill="#1B1530"/><ellipse cx="76" cy="54" rx="5" ry="7" fill="#1B1530"/><circle cx="49.8" cy="51" r="2" fill="#fff"/><circle cx="77.8" cy="51" r="2" fill="#fff"/><path d="M52 68c4 7 16 7 20 0z" fill="#1B1530" stroke="#1B1530" stroke-width="3" stroke-linejoin="round"/><path d="M56 71.5c3 2 9 2 12 0" stroke="#FF5A3C" stroke-width="3" stroke-linecap="round" fill="none"/>',
    wink: '<path d="M42 55c3-6 9-6 12 0" stroke="#1B1530" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="76" cy="54" rx="5" ry="7" fill="#1B1530"/><circle cx="77.8" cy="51" r="2" fill="#fff"/><path d="M52 67c5 6 14 6 19-1" stroke="#1B1530" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M96 24l2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8z" fill="#FFD23F" stroke="#1B1530" stroke-width="2" stroke-linejoin="round"/>',
    sad: '<ellipse cx="48" cy="56" rx="5" ry="7" fill="#1B1530"/><ellipse cx="76" cy="56" rx="5" ry="7" fill="#1B1530"/><circle cx="49.8" cy="53" r="2" fill="#fff"/><circle cx="77.8" cy="53" r="2" fill="#fff"/><path d="M40 49l14-5M84 49l-14-5" stroke="#1B1530" stroke-width="4" stroke-linecap="round"/><path d="M54 74c4-6 14-6 18 0" stroke="#1B1530" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M86 62c3 5 4 8 0 9-4-1-3-4 0-9z" fill="#7CC8FF" stroke="#1B1530" stroke-width="2"/>',
    party: '<path d="M42 56c3-7 9-7 12 0M70 56c3-7 9-7 12 0" stroke="#1B1530" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M50 66c0 11 24 11 24 0z" fill="#1B1530" stroke="#1B1530" stroke-width="3" stroke-linejoin="round"/><path d="M56 73c3 3 9 3 12 0" stroke="#FF5A3C" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M50 26l14-22 14 22z" fill="#FF5A3C" stroke="#1B1530" stroke-width="3" stroke-linejoin="round"/><circle cx="64" cy="4" r="4.5" fill="#FFD23F" stroke="#1B1530" stroke-width="2.5"/><circle cx="12" cy="30" r="3.5" fill="#5BE0B3"/><circle cx="112" cy="22" r="3.5" fill="#FF8FC7"/><rect x="104" y="64" width="9" height="5" rx="1.5" fill="#B79CFF" transform="rotate(30 108 66)"/><rect x="8" y="76" width="9" height="5" rx="1.5" fill="#FFD23F" transform="rotate(-25 12 78)"/>'
  };
  const mascot = (mood, size, cls) => {
    const m = FACE[mood] ? mood : 'happy';
    return '<svg class="mascot ' + (cls || '') + ' m-' + m + '" viewBox="-2 -4 128 118" width="' + (size || 96) + '" height="' + Math.round((size || 96) * 118 / 128) + '" role="img" aria-label="Маскот Спик"><path d="' + BODY + '" fill="#fff" stroke="#1B1530" stroke-width="4" stroke-linejoin="round"/>'
      + '<ellipse cx="38" cy="66" rx="7" ry="4.5" fill="#FF8FC7"/><ellipse cx="86" cy="66" rx="7" ry="4.5" fill="#FF8FC7"/>' + FACE[m] + '</svg>';
  };

  /* аватар партнёра/пользователя: цветной круг с инициалом */
  const AV = ['#FFD23F', '#B79CFF', '#5BE0B3', '#FF8FC7', '#FF9A7F', '#8FD3FF'];
  const avatar = (name, seed, size, emoji) => {
    const str = String(name || '?').trim();
    const k = Math.abs(Math.round(Number(seed) || 0) + str.length) % AV.length;
    const content = emoji ? emoji : str.charAt(0).toUpperCase().replace(/[<>&"']/g, '') || '?';
    return '<span class="av" style="--bg:' + AV[k] + ';--s:' + (size || 40) + 'px" aria-hidden="true">' + content + '</span>';
  };

  SPK.EMO = { coffee: '☕', match: '💌', dinner: '🍝', parents: '🏡', nyc: '🗽', makeup: '🤝' };
  SPK.EMO_WHO = { coffee: '🧔', match: '🧑‍🎤', dinner: '👨‍🍳', parents: '👩‍🦳', nyc: '🧢', makeup: '🧑' };
  SPK.art = { icon, flame, sparkFill, star, mascot, avatar };
})();
