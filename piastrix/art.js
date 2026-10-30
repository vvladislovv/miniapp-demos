/* Логотипы витрин в SVG (упрощённые, в духе оригиналов). */
const LOGOS = {
  piastrix: `<svg viewBox="0 0 100 100"><defs><linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0589a"/><stop offset="1" stop-color="#f7a24a"/></linearGradient></defs>
    <rect x="6" y="22" width="88" height="56" rx="10" fill="url(#gp)"/><g transform="translate(70 50)" fill="#fff" fill-opacity=".9">${[0, 45, 90, 135].map((r) => `<ellipse rx="4.500" ry="13" transform="rotate(${r})"/>`).join('')}<circle r="5" fill="#ffd34a"/></g>
    <text x="14" y="50" font-family="Arial" font-weight="700" font-size="13" fill="#fff">Gift</text><text x="14" y="65" font-family="Arial" font-weight="700" font-size="13" fill="#fff">Card</text></svg>`,
  apple: `<svg viewBox="0 0 100 100"><defs><clipPath id="ap"><path d="M72 53c0-11 9-16 9-16-5-7-12-8-15-8-6-1-12 3-15 3s-8-3-14-3c-8 0-15 5-19 12-8 14-2 35 6 46 4 6 8 11 14 11 5 0 7-3 14-3s9 3 14 3 10-5 14-11c4-6 6-12 6-12s-13-5-13-19z"/><path d="M60 20c3-4 5-9 4-14-5 1-10 4-13 8-3 3-5 8-4 13 5 0 10-3 13-7z"/></clipPath></defs>
    <g clip-path="url(#ap)"><rect width="100" height="100" fill="#8a5cf6"/><path d="M0 0h50L25 50z" fill="#ff5a6a"/><path d="M50 0h50L75 50z" fill="#ffb02e"/><path d="M25 50L50 0l25 50z" fill="#ffe14a"/><path d="M0 50h50L25 100z" fill="#3ccf6a"/><path d="M50 50h50L75 100z" fill="#2f9bff"/><path d="M25 50h50L50 100z" fill="#a066ff"/></g></svg>`,
  spotify: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#1ed760"/><path d="M25 37c18-6 37-4 51 5" stroke="#0c1f12" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M29 51c15-4 29-3 41 4" stroke="#0c1f12" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M33 63c11-3 21-2 30 3" stroke="#0c1f12" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
  tgprem: `<svg viewBox="0 0 100 100"><defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b9bff"/><stop offset="1" stop-color="#b44df0"/></linearGradient></defs>
    <path d="M50 10l12 24 26 4-19 18 5 26-24-12-24 12 5-26-19-18 26-4z" fill="url(#tg)" stroke="url(#tg)" stroke-width="6" stroke-linejoin="round"/></svg>`,
  steam: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#1b2838"/><circle cx="62" cy="40" r="13" fill="none" stroke="#fff" stroke-width="5"/><circle cx="62" cy="40" r="5" fill="#fff"/><circle cx="36" cy="64" r="9" fill="#fff"/><path d="M42 58l12-8" stroke="#fff" stroke-width="5"/><circle cx="36" cy="64" r="4" fill="#1b2838"/></svg>`,
  netflix: `<svg viewBox="0 0 100 100"><rect x="14" y="8" width="72" height="84" rx="10" fill="#141414"/><rect x="31" y="20" width="10" height="60" fill="#b20710"/><rect x="59" y="20" width="10" height="60" fill="#b20710"/><path d="M31 20h10l28 60H59z" fill="#e50914"/></svg>`,
  ps: `<svg viewBox="0 0 100 100"><rect x="8" y="22" width="84" height="56" rx="14" fill="#0b3da0"/><text x="50" y="62" text-anchor="middle" font-family="Arial" font-style="italic" font-weight="800" font-size="34" fill="#fff">PS</text></svg>`,
  xbox: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#107c10"/><path d="M28 28c10 8 16 16 22 22 6-6 12-14 22-22M28 72c10-8 16-16 22-22 6 6 12 14 22 22" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`,
  gplay: `<svg viewBox="0 0 100 100"><path d="M24 12l40 38-40 38z" fill="#2fb4ff"/><path d="M24 12l52 30-12 8z" fill="#35d56a"/><path d="M24 88l52-30-12-8z" fill="#ef4452"/><path d="M76 42l12 8-12 8-12-8z" fill="#ffc72c"/></svg>`,
  roblox: `<svg viewBox="0 0 100 100"><rect x="22" y="22" width="56" height="56" rx="7" transform="rotate(15 50 50)" fill="#26282b"/><rect x="42" y="42" width="16" height="16" transform="rotate(15 50 50)" fill="#fff"/></svg>`,
  discord: `<svg viewBox="0 0 100 100"><rect x="8" y="16" width="84" height="68" rx="20" fill="#5865f2"/><path d="M28 36c8-4 14-5 22-5s14 1 22 5c4 10 6 20 5 30-6 4-10 5-15 6l-4-6c-4 1-8 1-12 0l-4 6c-5-1-9-2-15-6-1-10 1-20 5-30z" fill="#fff"/><circle cx="40" cy="52" r="5" fill="#5865f2"/><circle cx="60" cy="52" r="5" fill="#5865f2"/></svg>`,
  mobile: `<svg viewBox="0 0 100 100"><rect x="32" y="10" width="36" height="80" rx="9" fill="#e6f1ff" stroke="#2b7de9" stroke-width="4"/><rect x="38" y="20" width="24" height="46" rx="3" fill="#2b7de9" opacity=".18"/><circle cx="50" cy="78" r="4" fill="#2b7de9"/><path d="M80 30a22 22 0 0 1 0 28M88 22a34 34 0 0 1 0 44" stroke="#2b7de9" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
};

const FLOWER = `<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="translate(20 20)">${[0, 45, 90, 135].map((r) => `<ellipse rx="3.800" ry="12" transform="rotate(${r})" fill="#e6397a"/>`).join('')}<circle r="4.500" fill="#ffc83a"/></g></svg>`;

const PX = {
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17V11a6 6 0 0112 0v6l1.500 2h-15zM10 21h4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.500 3.500-7 8-7s8 2.500 8 7"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>',
  star: '<svg viewBox="0 0 24 24" stroke="#f5b301" stroke-width="1.800" stroke-linejoin="round"><path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.500"/><path d="M16 16l4 4"/></svg>'
};
