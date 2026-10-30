/* Иконки и иллюстрации Out of Box (всё в SVG, без внешних файлов) */
const ICON = {
  home: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15 16 4l12 11M7 13v14h7v-8h4v8h7V13"/></svg>',
  gem: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 5h14l6 8-13 15L3 13z"/><path d="M3 13h26M12 5l-3 8 7 15 7-15-3-8"/></svg>',
  user: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="16" cy="10" r="6"/><path d="M5 29c0-6.5 5-11 11-11s11 4.500 11 11"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  wing: '<svg viewBox="0 0 70 44" fill="currentColor" aria-hidden="true"><path d="M2 40C16 38 40 30 69 3 63 24 40 37 2 40z"/><path d="M2 41C20 42 40 38 62 20 54 36 32 44 2 41z" opacity=".75"/><path d="M4 42c18 2 34-2 50-12-8 12-26 18-50 12z" opacity=".5"/></svg>'
};

function londonSvg() {
  const bars = Array.from({ length: 7 }, (_, i) => `<ellipse cx="${26 + i * 55}" cy="168" rx="${i % 2 ? 29 : 25}" ry="${i % 2 ? 58 : 48}"/>`).join('');
  const reflect = [[48, '#f2c36b'], [92, '#e8894a'], [130, '#f2c36b'], [176, '#e8894a'], [226, '#f2c36b'], [290, '#f2c36b'], [318, '#e8894a'], [336, '#f2c36b']]
    .map(([x, c], i) => `<rect x="${x}" y="144" width="${i % 2 ? 3 : 5}" height="${70 - (i % 3) * 10}" fill="${c}" opacity=".55"/>`).join('');
  const windows = Array.from({ length: 18 }, (_, i) => `<rect x="${58 + i * 11}" y="${i % 2 ? 100 : 94}" width="3" height="6" fill="#ffd98a"/>`).join('');
  const spires = [70, 110, 150, 190, 225].map((x, i) => `<path d="M${x - 4} 86h8l-4-${24 + (i % 2) * 10}z" fill="#a67a4c"/>`).join('');
  const arches = Array.from({ length: 9 }, (_, i) => `<path d="M${10 + i * 40} 142a16 12 0 0 1 32 0z" fill="#10192c"/>`).join('');
  return `<svg class="london" viewBox="0 0 380 230" role="img" aria-label="Вестминстер и Биг-Бен">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3560"/><stop offset=".55" stop-color="#6b79a8"/><stop offset="1" stop-color="#eab07a"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27385e"/><stop offset="1" stop-color="#0b1020"/></linearGradient>
      <clipPath id="arch"><rect x="0" y="0" width="380" height="168"/>${bars}</clipPath>
    </defs>
    <g clip-path="url(#arch)">
      <rect width="380" height="150" fill="url(#sky)"/>
      <ellipse cx="90" cy="40" rx="70" ry="9" fill="#fff" opacity=".12"/><ellipse cx="230" cy="64" rx="60" ry="7" fill="#fff" opacity=".1"/>
      <rect x="44" y="86" width="214" height="50" fill="#b48a5a"/>${spires}
      <rect x="44" y="60" width="26" height="76" fill="#c09560"/><path d="M42 60h30l-15-26z" fill="#a67a4c"/>
      ${windows}
      <rect x="300" y="44" width="30" height="92" fill="#c9a068"/><path d="M298 44h34l-17-34z" fill="#a67a4c"/>
      <circle cx="315" cy="68" r="10" fill="#fff4d6"/><path d="M315 62v6l4 2" stroke="#3a2a1a" stroke-width="1.400" fill="none"/>
      <rect x="296" y="110" width="38" height="4" fill="#a67a4c"/>
      <rect x="0" y="130" width="380" height="16" fill="#2f5a52"/>${arches}
      <rect x="0" y="144" width="380" height="90" fill="url(#water)"/>${reflect}
    </g></svg>`;
}
