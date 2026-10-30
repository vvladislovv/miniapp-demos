/* Плоские иллюстрации одежды на светлом фоне, как фото-карточки каталога. */
const GARMENT = {
  pants: (c, a) => `<path d="M62 28h76l10 206h-42l-6-120-6 120H52z" fill="${c}"/><path d="M62 28h76v14H62z" fill="rgba(0,0,0,.28)"/>
    <path d="M100 42v70" stroke="rgba(0,0,0,.35)" stroke-width="2"/><path d="M68 56q10 14 24 12M132 56q-10 14-24 12" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/>
    <circle cx="127" cy="150" r="5" fill="${a}"/>`,
  jeans: (c, a) => `<path d="M62 28h76l10 206h-42l-6-120-6 120H52z" fill="${c}"/><path d="M62 28h76v12H62z" fill="rgba(0,0,0,.25)"/>
    <path d="M100 40v72M66 44q6 26 30 26M134 44q-6 26-30 26" stroke="${a}" stroke-opacity=".7" stroke-width="1.600" stroke-dasharray="4 3" fill="none"/>
    <path d="M64 120q40 20 74 0" stroke="rgba(255,255,255,.18)" stroke-width="14" fill="none"/>`,
  shorts: (c, a) => `<path d="M58 54h84l12 100h-48l-6-44-6 44H46z" fill="${c}"/><path d="M58 54h84v12H58z" fill="rgba(0,0,0,.28)"/>
    <path d="M100 66v44" stroke="rgba(0,0,0,.35)" stroke-width="2"/><rect x="118" y="86" width="22" height="20" rx="2" fill="none" stroke="${a}" stroke-opacity=".8" stroke-width="1.600"/>`,
  track: (c, a) => `<path d="M62 28h76l10 206h-42l-6-120-6 120H52z" fill="${c}"/><path d="M62 28h76v12H62z" fill="rgba(255,255,255,.12)"/>
    <path d="M70 40l-10 194M76 40l-10 194M130 40l10 194M124 40l10 194" stroke="${a}" stroke-width="3"/>`,
  jacket: (c, a) => `<path d="M70 38l30-10 30 10 38 34-8 120-22-6-2 44H64l-2-44-22 6-8-120z" fill="${c}"/>
    <path d="M100 28v204" stroke="rgba(0,0,0,.4)" stroke-width="2.500"/><path d="M80 34l20 22 20-22" fill="rgba(0,0,0,.3)" stroke="rgba(0,0,0,.4)"/>
    <path d="M62 100h30v36H62zM108 100h30v36h-30z" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="2"/><rect x="108" y="76" width="22" height="9" rx="2" fill="${a}"/>
    <path d="M32 90l16 -2M168 90l-16 -2" stroke="${a}" stroke-width="3"/>`,
  bomber: (c, a) => `<path d="M72 40l28-10 28 10 40 30-6 112-20-4v34H58v-34l-20 4-6-112z" fill="${c}"/>
    <rect x="58" y="206" width="84" height="12" fill="rgba(0,0,0,.3)"/><path d="M100 30v176" stroke="rgba(0,0,0,.4)" stroke-width="2.500"/>
    <path d="M74 38q26 20 52 0" fill="${a}" opacity=".95"/><rect x="40" y="148" width="14" height="30" fill="rgba(0,0,0,.28)"/><rect x="146" y="148" width="14" height="30" fill="rgba(0,0,0,.28)"/>
    <rect x="118" y="82" width="18" height="12" rx="2" fill="${a}"/>`,
  hoodie: (c, a) => `<path d="M72 44q28-22 56 0l40 28-6 116-20-4-2 34H60l-2-34-20 4-6-116z" fill="${c}"/>
    <path d="M78 42q22 28 44 0q-4-30-22-30t-22 30z" fill="rgba(0,0,0,.28)"/><path d="M92 58v28M108 58v28" stroke="${a}" stroke-width="2.500" stroke-linecap="round"/>
    <path d="M70 170h60l8 28H62z" fill="rgba(0,0,0,.2)"/><path d="M82 112q18 8 36 0" stroke="${a}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <rect x="60" y="212" width="80" height="12" fill="rgba(0,0,0,.25)"/>`,
  sweat: (c, a) => `<path d="M72 36q28 14 56 0l42 32-6 120-20-4-2 32H60l-2-32-20 4-6-120z" fill="${c}"/>
    <path d="M82 34q18 16 36 0" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="6"/><path d="M62 212h76v12H62z" fill="rgba(0,0,0,.28)"/>
    <text x="100" y="116" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="24" fill="${a}">C</text>
    <path d="M50 190l4-1M150 190l-4-1" stroke="rgba(0,0,0,.4)" stroke-width="2"/>`,
  tee: (c, a) => `<path d="M64 40l24-10q12 18 24 0l24 10 34 32-18 24-14-10v128H62V86L48 96 30 72z" fill="${c}"/>
    <path d="M88 30q12 18 24 0" fill="rgba(0,0,0,.35)"/>
    <circle cx="100" cy="106" r="24" fill="none" stroke="${a}" stroke-width="4"/><path d="M80 98h40M80 114h40" stroke="${a}" stroke-width="4"/><path d="M82 142h36" stroke="${a}" stroke-width="3" stroke-linecap="round"/>`
};

function art(p, variant = 0) {
  const body = (GARMENT[p.art] || GARMENT.tee)(p.c, p.a);
  const zoom = [[1, 0, 0], [1.9, -90, -40], [1.5, -50, -120]][variant] || [1, 0, 0];
  const back = variant === 1 ? 'scale(-1,1) translate(-200,0)' : '';
  return `<svg viewBox="0 0 200 260" class="art" role="img" aria-label="${p.title}" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="bg${p.id}${variant}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eaec"/><stop offset="1" stop-color="#c9cbd0"/></linearGradient></defs>
    <rect width="200" height="260" fill="url(#bg${p.id}${variant})"/>
    <ellipse cx="100" cy="246" rx="64" ry="7" fill="rgba(0,0,0,.14)"/>
    <g transform="translate(${zoom[1]} ${zoom[2]}) scale(${zoom[0]})"><g transform="${back}">${body}</g></g></svg>`;
}

const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#f5f5f5"/><circle cx="20" cy="20" r="15" fill="none" stroke="#111" stroke-width="1.500"/>
  <path d="M9 26l7-12 4 7 3-5 8 10z" fill="#111"/><path d="M11 27h18" stroke="#111" stroke-width="1.500"/></svg>`;
