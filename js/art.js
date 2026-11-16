/* All characters are drawn here with SVG. They are original characters. */
'use strict';

const Art = {};
const svgWrap = (inner, vb = '0 -14 200 280') => `<svg class="char" viewBox="${vb}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
/* eyes that blink (each character blinks at its own time) */
const eyesG = inner => `<g class="eyes" style="animation-delay:-${(Math.random() * 4.5).toFixed(2)}s">${inner}</g>`;

/* Necklaces hang on a curve under the chin. Bead necklaces hang lower so the beads show below the chin:
   beadPt(t) walks along their curve from one side of the neck (t=0) to the other (t=1). */
const NECK_CURVE = 'M76,146 Q100,178 124,146';
const beadPt = t => [72 + 56 * t, 146 + 84 * t * (1 - t)];
const beadsAlong = colors => [...Array(13)].map((_, i) => {
  const [x, y] = beadPt(0.08 + i * 0.07);
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.8" fill="${colors[i % colors.length]}" stroke="rgba(0,0,0,.22)" stroke-width="1"/><circle cx="${(x - 1.2).toFixed(1)}" cy="${(y - 1.3).toFixed(1)}" r="1.1" fill="#fff" opacity=".8"/>`;
}).join('');
const starPath = (cx, cy, R, r) => 'M' + [...Array(10)].map((_, i) => {
  const a = Math.PI / 5 * i - Math.PI / 2, d = i % 2 ? r : R;
  return (cx + d * Math.cos(a)).toFixed(1) + ',' + (cy + d * Math.sin(a)).toFixed(1);
}).join(' L') + 'Z';
const HEART = 'M0,6 C-9,0 -8,-7 -3.5,-7 C-1.5,-7 0,-5.5 0,-4 C0,-5.5 1.5,-7 3.5,-7 C8,-7 9,0 0,6Z';
Art.neckAcc = {
  pearls: beadsAlong(['#fff6e6']),
  beads: beadsAlong(['#ff5fa2', '#ffb347', '#ffd54a', '#3ecf8e', '#4aa8ff', '#8e6bff']),
  locket: `<path d="${NECK_CURVE}" stroke="#e0a800" stroke-width="2.4" fill="none"/><path d="${HEART}" transform="translate(100,169) scale(1.5)" fill="#ff5fa2" stroke="#e0a800" stroke-width="1.2"/><circle cx="98" cy="166" r="1.6" fill="#fff" opacity=".8"/>`,
  starpendant: `<path d="${NECK_CURVE}" stroke="#e0a800" stroke-width="2.4" fill="none"/><path d="${starPath(100, 171, 10, 4.4)}" fill="#ffd54a" stroke="#e0a800" stroke-width="1.6" stroke-linejoin="round"/><circle cx="100" cy="171" r="2.2" fill="#fff" opacity=".8"/>`,
};
/* Bracelets are drawn flat around (0,0), then turned to sit across each wrist. */
Art.wristAcc = {
  bangles: `<rect x="-11" y="-6" width="22" height="4.5" rx="2.2" fill="#ffd54a" stroke="#e0a800" stroke-width="1.2"/><rect x="-11" y="0.5" width="22" height="4.5" rx="2.2" fill="#ffd54a" stroke="#e0a800" stroke-width="1.2"/>`,
  friendship: ['#ff5fa2', '#ffd54a', '#22c7b8', '#8e6bff'].map((c, i) => `<rect x="${-11 + i * 5.5}" y="-3.5" width="5.5" height="7" fill="${c}"/>`).join('') + `<rect x="-11" y="-3.5" width="22" height="7" rx="2" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`,
  pearlband: [-8.4, -2.8, 2.8, 8.4].map(x => `<circle cx="${x}" cy="0" r="3.4" fill="#fff6e6" stroke="rgba(0,0,0,.25)" stroke-width="1"/><circle cx="${x - 1}" cy="-1.1" r="1" fill="#fff"/>`).join(''),
  charm: `<rect x="-11" y="-2.2" width="22" height="4.4" rx="2.2" fill="#ffd54a" stroke="#e0a800" stroke-width="1.2"/><path d="${HEART}" transform="translate(0,7.5) scale(.75)" fill="#ff5fa2" stroke="#e0407f" stroke-width="1.2"/>`,
};
/* Earrings are drawn hanging down from (0,0), then put on both sides of the head. */
Art.earAcc = {
  studs: `<circle cx="0" cy="2" r="4.4" fill="#fff6e6" stroke="rgba(0,0,0,.25)" stroke-width="1"/><circle cx="-1.2" cy="0.8" r="1.3" fill="#fff"/>`,
  cherries: `<path d="M0,0 Q-1,6 -4,10 M0,0 Q2,6 4,11" stroke="#3a9a4a" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M0,0 Q5,-3 7,1 Q3,3 0,0Z" fill="#3ecf8e"/><circle cx="-4" cy="12.5" r="4" fill="#ef3b4f"/><circle cx="4" cy="13.5" r="4" fill="#ef3b4f"/><circle cx="-5.3" cy="11.2" r="1.2" fill="#fff" opacity=".8"/><circle cx="2.7" cy="12.2" r="1.2" fill="#fff" opacity=".8"/>`,
  hoops: `<circle cx="0" cy="8" r="7.5" fill="none" stroke="#e0a800" stroke-width="3.4"/><circle cx="0" cy="8" r="7.5" fill="none" stroke="#ffd54a" stroke-width="1.8"/>`,
  stardrop: `<line x1="0" y1="0" x2="0" y2="6" stroke="#e0a800" stroke-width="1.6"/><path d="${starPath(0, 11.5, 6.5, 2.8)}" fill="#ffd54a" stroke="#e0a800" stroke-width="1.2" stroke-linejoin="round"/>`,
};
/* Glasses sit over the eyes, which are at (78,104) and (122,104). */
const glassArms = c => `<path d="M63,100 L45,95 M137,100 L155,95" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
Art.faceAcc = {
  round: glassArms('#6c5ce7') + `<circle cx="78" cy="104" r="15" fill="#fff" fill-opacity=".2" stroke="#6c5ce7" stroke-width="3"/><circle cx="122" cy="104" r="15" fill="#fff" fill-opacity=".2" stroke="#6c5ce7" stroke-width="3"/><path d="M93,102 Q100,96 107,102" stroke="#6c5ce7" stroke-width="3" fill="none"/>`,
  hearts: glassArms('#e0407f') + [78, 122].map(x => `<path d="${HEART}" transform="translate(${x},107) scale(2)" fill="#ff5fa2" fill-opacity=".75" stroke="#e0407f" stroke-width="1.2"/>`).join('') + `<path d="M95,100 Q100,96 105,100" stroke="#e0407f" stroke-width="3" fill="none"/>`,
  stars: glassArms('#e0a800') + [78, 122].map(x => `<path d="${starPath(x, 105, 20, 10.5)}" fill="#fff6b0" fill-opacity=".35" stroke="#ffb300" stroke-width="3" stroke-linejoin="round"/>`).join(''),
  shades: glassArms('#2b2b3a') + `<rect x="60" y="92" width="36" height="24" rx="10" fill="#2b2b3a"/><rect x="104" y="92" width="36" height="24" rx="10" fill="#2b2b3a"/><path d="M96,100 L104,100" stroke="#2b2b3a" stroke-width="4"/><path d="M66,98 L74,98 M110,98 L118,98" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
};
/* Hair clips are drawn around (0,0), then pinned in the hair over the left eye. */
Art.clipAcc = {
  starclips: [-7, 7].map(x => `<path d="${starPath(x, 0, 6.5, 2.8)}" fill="#ffd54a" stroke="#e0a800" stroke-width="1.2" stroke-linejoin="round"/>`).join(''),
  heartclips: [-7, 7].map(x => `<path d="${HEART}" transform="translate(${x},1) scale(.75)" fill="#ff5fa2" stroke="#e0407f" stroke-width="1.4"/>`).join(''),
  butterfly: `<ellipse cx="-6" cy="-3" rx="6.5" ry="5" fill="#8fd3ff" stroke="#4aa8ff" stroke-width="1.2" transform="rotate(-20 -6 -3)"/><ellipse cx="6" cy="-3" rx="6.5" ry="5" fill="#8fd3ff" stroke="#4aa8ff" stroke-width="1.2" transform="rotate(20 6 -3)"/><ellipse cx="-4.5" cy="4" rx="4" ry="3.2" fill="#ff9fc8" stroke="#e57aa8" stroke-width="1.2"/><ellipse cx="4.5" cy="4" rx="4" ry="3.2" fill="#ff9fc8" stroke="#e57aa8" stroke-width="1.2"/><rect x="-1.3" y="-7" width="2.6" height="13" rx="1.3" fill="#3b2a4a"/>`,
  barrette: ['#ff5f6d', '#ffd54a', '#5fd38d', '#4aa8ff', '#8e6bff'].map((c, k) => `<rect x="${-12.5 + k * 5}" y="-3.5" width="5" height="7" fill="${c}"/>`).join('') + `<rect x="-12.5" y="-3.5" width="25" height="7" rx="2.5" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1"/>`,
};
/* Face paint and stickers on the cheeks (the blush is at (60,119) and (140,119)). */
Art.cheekAcc = {
  freckles: [60, 140].map(cx => [[-6, -3], [0, 0], [6, -3], [-3, 4], [4, 4]].map(([x, y]) => `<circle cx="${cx + x}" cy="${116 + y}" r="1.5" fill="#b8754a" opacity=".75"/>`).join('')).join(''),
  heartpaint: `<path d="${HEART}" transform="translate(58,121) scale(.95)" fill="#ff5fa2" opacity=".9"/>`,
  starsticker: `<path d="${starPath(142, 121, 8, 3.5)}" fill="#ffd54a" stroke="#e0a800" stroke-width="1.2" stroke-linejoin="round"/><circle cx="140" cy="118" r="1.3" fill="#fff"/>`,
  whiskers: `<path d="M50,114 L30,108 M50,119 L28,119 M50,124 L30,130 M150,114 L170,108 M150,119 L172,119 M150,124 L170,130" stroke="#3b2a4a" stroke-width="2.2" stroke-linecap="round"/><path d="M95,114 L105,114 L100,119 Z" fill="#ff7eb6"/>`,
};
/* Bags hang from a strap over the right shoulder, at the left hip. */
const strap = c => `<path d="M120,152 L66,206" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
Art.bagAcc = {
  heartpurse: strap('#e0407f') + `<path d="${HEART}" transform="translate(62,218) scale(1.9)" fill="#ff7eb6" stroke="#e0407f" stroke-width=".9"/><circle cx="62" cy="211" r="2.6" fill="#ffd54a" stroke="#e0a800" stroke-width="1"/>`,
  shellbag: strap('#c98a5a') + `<path d="M48,224 Q46,200 62,198 Q78,200 76,224 Q62,229 48,224Z" fill="#ffc6d9" stroke="#e57aa8" stroke-width="1.6" stroke-linejoin="round"/><path d="M62,200 L62,226 M55,201 L52,224 M69,201 L72,224" stroke="#e57aa8" stroke-width="1.3"/><circle cx="62" cy="214" r="2.6" fill="#fff6e6" stroke="rgba(0,0,0,.2)" stroke-width="1"/>`,
  bunnybag: strap('#c9b6f5') + `<ellipse cx="55" cy="198" rx="3.6" ry="9" fill="#fff" stroke="#c9b6f5" stroke-width="1.6"/><ellipse cx="69" cy="198" rx="3.6" ry="9" fill="#fff" stroke="#c9b6f5" stroke-width="1.6"/><circle cx="62" cy="215" r="13" fill="#fff" stroke="#c9b6f5" stroke-width="1.8"/><circle cx="57.5" cy="213" r="1.7" fill="#3b2a4a"/><circle cx="66.5" cy="213" r="1.7" fill="#3b2a4a"/><path d="M60,218 Q62,220 64,218" stroke="#ff7eb6" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="54" cy="218" rx="2.6" ry="1.6" fill="#ffb3c7"/><ellipse cx="70" cy="218" rx="2.6" ry="1.6" fill="#ffb3c7"/>`,
  starbag: strap('#e0a800') + `<path d="${starPath(62, 215, 15, 7)}" fill="#ffd54a" stroke="#e0a800" stroke-width="1.8" stroke-linejoin="round"/><circle cx="58" cy="213" r="1.6" fill="#3b2a4a"/><circle cx="66" cy="213" r="1.6" fill="#3b2a4a"/><path d="M59,218 Q62,221 65,218" stroke="#3b2a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
};

/* Shoe styles. x = middle of the shoe, lx = middle of the leg. */
const SHOE = {
  flats: (c, x) => '',
  sneakers: (c, x) => `<rect x="${x - 14}" y="252" width="28" height="5" rx="2.5" fill="#fff" stroke="rgba(0,0,0,.18)" stroke-width="1"/><path d="M${x - 4},246 h8 M${x - 4},249.5 h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`,
  boots: (c, x, lx) => `<rect x="${lx - 9}" y="228" width="18" height="24" rx="4" fill="${c}" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/><rect x="${lx - 10}" y="227" width="20" height="6" rx="3" fill="#fff" opacity=".75"/>`,
  ballet: (c, x, lx) => `<path d="M${lx - 6},248 L${lx + 6},236 M${lx + 6},248 L${lx - 6},236" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x}" cy="246" r="2.6" fill="#fff" opacity=".9"/>`,
  sparkle: (c, x) => [[-7, -1, '#fff'], [0, 2, '#ffd54a'], [7, -1, '#fff'], [-3, -4, '#ffd54a'], [4, 4, '#fff']].map(([dx, dy, f]) => `<circle cx="${x + dx}" cy="${251 + dy}" r="1.5" fill="${f}"/>`).join('') + `<path d="${starPath(x + 9, 245, 4, 1.6)}" fill="#fff"/>`,
};
/* Dress patterns: drawn in white on top of any dress color */
let patN = 0;
const PATTERN = {
  dots: ['14', `<circle cx="4" cy="4" r="2.6"/><circle cx="11" cy="11" r="2.6"/>`],
  stars: ['22', `<path d="${starPath(6, 6, 4.5, 2)}"/><path d="${starPath(17, 17, 4.5, 2)}"/>`],
  stripes: ['10', `<rect x="0" y="0" width="10" height="4"/>`],
  hearts: ['20', `<path d="${HEART}" transform="translate(5,6) scale(.55)"/><path d="${HEART}" transform="translate(15,16) scale(.55)"/>`],
};

/* a small picture of an accessory, for the shop */
Art.accIcon = (slot, id) => {
  const svg = (vb, inner) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner || ''}</svg>`;
  if (slot === 'neck') return svg('70 144 60 34', Art.neckAcc[id]);
  if (slot === 'wrist') return svg('-15 -10 30 24', Art.wristAcc[id]);
  if (slot === 'ears') return svg('-17 -4 34 24', `<g transform="translate(-8,0)">${Art.earAcc[id]}</g><g transform="translate(8,0)">${Art.earAcc[id]}</g>`);
  if (slot === 'face') return svg('42 84 116 40', Art.faceAcc[id]);
  if (slot === 'clip') return svg('-16 -10 32 20', Art.clipAcc[id]);
  if (slot === 'cheek') {           // zoom in on the cheek where it is, on a bit of skin
    const [x, y, w, hh] = { freckles: [42, 106, 36, 22], heartpaint: [42, 108, 32, 24], starsticker: [126, 108, 32, 24], whiskers: [26, 102, 82, 34] }[id] || [26, 100, 148, 34];
    return svg(`${x} ${y} ${w} ${hh}`, `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${hh / 2}" fill="#ffe0c8"/>${Art.cheekAcc[id]}`);
  }
  if (slot === 'bag') return svg('40 194 44 36', Art.bagAcc[id]);
  return '';
};

/* A cute girl character. Options change hair, dress, shoes and extras. */
Art.chibi = function (o) {
  o = Object.assign({ skin: '#ffe0c8', hair: '#5b3a29', style: 'long', dress: '#ff7eb6', trim: '#ffffff', shoes: '#7a4b8c', shoeStyle: 'flats', pattern: 'plain', head: null, back: null, hand: null, neck: null, wrist: null, ears: null, face: null, clip: null, cheek: null, bag: null, mood: 'happy', extra: '' }, o);
  const H = o.hair, K = o.skin;
  const base = `<path d="M38,98 Q34,28 100,26 Q166,28 162,98 Q160,126 150,136 L50,136 Q40,126 38,98Z" fill="${H}"/>`;
  const backHair = {
    long: `<path d="M38,95 Q34,28 100,26 Q166,28 162,95 L170,192 Q152,208 136,188 L132,120 L68,120 L64,188 Q48,208 30,192 Z" fill="${H}"/>`,
    bob: `<path d="M34,98 Q30,26 100,26 Q170,26 166,98 Q168,142 146,152 L54,152 Q32,142 34,98 Z" fill="${H}"/>`,
    buns: base + `<circle cx="46" cy="40" r="23" fill="${H}"/><circle cx="154" cy="40" r="23" fill="${H}"/>`,
    twin: base + `<path d="M42,78 Q6,110 20,184 Q30,200 46,184 Q36,132 58,100 Z" fill="${H}"/><path d="M158,78 Q194,110 180,184 Q170,200 154,184 Q164,132 142,100 Z" fill="${H}"/>`,
    pony: base + `<path d="M148,48 Q200,36 190,122 Q186,154 166,152 Q178,100 144,76 Z" fill="${H}"/>`,
  }[o.style] || base;

  const backAcc = {
    wings: `<ellipse cx="42" cy="168" rx="36" ry="20" fill="#fff" stroke="#ffc6e6" stroke-width="3" opacity=".92" transform="rotate(-32 42 168)"/><ellipse cx="158" cy="168" rx="36" ry="20" fill="#fff" stroke="#ffc6e6" stroke-width="3" opacity=".92" transform="rotate(32 158 168)"/>`,
    cape: `<path d="M68,148 L132,148 L170,236 Q100,254 30,236 Z" fill="#9b6bff"/><path d="M68,148 L132,148 L140,160 L60,160 Z" fill="#ffd54a"/>`,
  }[o.back] || '';

  const mouth = {
    happy: `<path d="M87,123 Q100,137 113,123" stroke="#c0506a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    wow: `<ellipse cx="100" cy="128" rx="7" ry="9" fill="#c0506a"/>`,
    sad: `<path d="M88,132 Q100,121 112,132" stroke="#c0506a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  }[o.mood] || '';

  const headAcc = {
    crown: `<path d="M70,36 L76,6 L90,24 L100,0 L110,24 L124,6 L130,36 Z" fill="#ffd54a" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="24" r="5" fill="#ff5fa2"/><circle cx="82" cy="28" r="3.5" fill="#6ecbf5"/><circle cx="118" cy="28" r="3.5" fill="#6ecbf5"/>`,
    tiara: `<path d="M72,40 L86,20 L92,30 L100,4 L108,30 L114,20 L128,40 Q100,30 72,40Z" fill="#d9f6ff" stroke="#6ecbf5" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="24" r="4" fill="#6ecbf5"/>`,
    bow: `<path d="M138,40 L112,24 L114,58 Z M138,40 L164,24 L162,58 Z" fill="#ff5fa2" stroke="#e0407f" stroke-width="2" stroke-linejoin="round"/><circle cx="138" cy="41" r="8" fill="#ff8cc0" stroke="#e0407f" stroke-width="2"/>`,
    catears: `<path d="M50,52 L54,6 L88,36 Z" fill="${H}"/><path d="M150,52 L146,6 L112,36 Z" fill="${H}"/><path d="M58,42 L60,20 L76,36 Z" fill="#ffb3c7"/><path d="M142,42 L140,20 L124,36 Z" fill="#ffb3c7"/>`,
    headphones: `<path d="M38,96 Q36,18 100,18 Q164,18 162,96" stroke="#6c5ce7" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="26" y="80" width="20" height="38" rx="9" fill="#ff4d9d"/><rect x="154" y="80" width="20" height="38" rx="9" fill="#ff4d9d"/>`,
    helmet: `<path d="M42,66 Q42,16 100,16 Q158,16 158,66 L168,72 L32,72 Z" fill="#ffd54a" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/><rect x="90" y="16" width="20" height="50" rx="6" fill="#ffe58a"/>`,
    flower: `<text x="124" y="58" font-size="34">🌸</text>`,
    snowpin: `<text x="126" y="60" font-size="28">❄️</text>`,
    starpin: `<text x="126" y="58" font-size="28">⭐</text>`,
  }[o.head] || '';

  const handAcc = {
    wand: `<line x1="152" y1="194" x2="174" y2="150" stroke="#b07a3c" stroke-width="5" stroke-linecap="round"/><text x="158" y="152" font-size="30">⭐</text>`,
    mic: `<line x1="152" y1="194" x2="166" y2="160" stroke="#555" stroke-width="6" stroke-linecap="round"/><circle cx="169" cy="152" r="12" fill="#3a3a55" stroke="#ff4d9d" stroke-width="3"/>`,
    starmic: `<line x1="152" y1="194" x2="166" y2="160" stroke="#ffd54a" stroke-width="6" stroke-linecap="round"/><circle cx="169" cy="152" r="12" fill="#ffd54a" stroke="#ff4d9d" stroke-width="3"/><text x="174" y="140" font-size="22">✨</text>`,
    snow: `<text x="140" y="186" font-size="30">❄️</text>`,
    lightstick: `<line x1="152" y1="194" x2="168" y2="158" stroke="#fff" stroke-width="6" stroke-linecap="round"/><text x="154" y="156" font-size="30">💖</text>`,
  }[o.hand] || '';

  const neckAcc = Art.neckAcc[o.neck] || '';
  const e = Art.earAcc[o.ears];
  const earAcc = e ? `<g transform="translate(45,113)">${e}</g><g transform="translate(155,113)">${e}</g>` : '';
  const faceAcc = Art.faceAcc[o.face] || '';
  const cl = Art.clipAcc[o.clip];
  const clipAcc = cl ? `<g transform="translate(62,60) rotate(-35)">${cl}</g>` : '';
  const cheekAcc = Art.cheekAcc[o.cheek] || '';
  const bagAcc = Art.bagAcc[o.bag] || '';
  const shoe = SHOE[o.shoeStyle] || SHOE.flats;
  const DRESS = 'M74,148 Q100,138 126,148 L152,222 Q100,238 48,222 Z';
  const P = PATTERN[o.pattern], pid = 'dp' + (++patN);
  const pattern = P ? `<defs><pattern id="${pid}" width="${P[0]}" height="${P[0]}" patternUnits="userSpaceOnUse"><g fill="#fff">${P[1]}</g></pattern></defs><path d="${DRESS}" fill="url(#${pid})" opacity=".6"/>` : '';
  const w = Art.wristAcc[o.wrist];
  const wristAcc = w ? `<g transform="translate(56,183) rotate(38)">${w}</g><g transform="translate(144,183) rotate(-38)">${w}</g>` : '';

  return svgWrap(`
    ${backAcc}${backHair}
    <rect x="80" y="224" width="14" height="24" rx="6" fill="${K}"/><rect x="106" y="224" width="14" height="24" rx="6" fill="${K}"/>
    ${[[85, 87], [115, 113]].map(([x, lx]) => `<ellipse cx="${x}" cy="251" rx="14" ry="7.5" fill="${o.shoes}" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/>${shoe(o.shoes, x, lx)}<ellipse cx="${x - 5}" cy="248" rx="4.5" ry="2" fill="#fff" opacity=".45"/>`).join('')}
    <path d="M76,156 L50,190" stroke="${o.dress}" stroke-width="17" stroke-linecap="round"/><path d="M124,156 L150,190" stroke="${o.dress}" stroke-width="17" stroke-linecap="round"/>
    <circle cx="48" cy="194" r="9.5" fill="${K}"/><circle cx="152" cy="194" r="9.5" fill="${K}"/>
    ${wristAcc}
    <path d="${DRESS}" fill="${o.dress}"/>${pattern}
    <path d="M48,222 Q100,238 152,222 L155,231 Q100,248 45,231 Z" fill="${o.trim}"/>
    <path d="M84,146 Q100,160 116,146" stroke="${o.trim}" stroke-width="6" fill="none" stroke-linecap="round"/>
    ${bagAcc}${neckAcc}
    <circle cx="100" cy="95" r="58" fill="${K}"/>
    <ellipse cx="60" cy="119" rx="11" ry="6.5" fill="#ff9bb0" opacity=".55"/><ellipse cx="140" cy="119" rx="11" ry="6.5" fill="#ff9bb0" opacity=".55"/>${cheekAcc}
    ${eyesG(`<ellipse cx="78" cy="104" rx="8.5" ry="11.5" fill="#3b2a4a"/><ellipse cx="122" cy="104" rx="8.5" ry="11.5" fill="#3b2a4a"/>
    <circle cx="81" cy="99" r="3.6" fill="#fff"/><circle cx="125" cy="99" r="3.6" fill="#fff"/>`)}
    ${mouth}${faceAcc}
    <path d="M42,97 Q36,34 100,30 Q164,34 158,97 Q150,66 126,60 Q116,80 98,62 Q72,62 42,97 Z" fill="${H}"/>
    ${clipAcc}${earAcc}${headAcc}${handAcc}${o.extra}
  `);
};

/* Lumi: a shy snow princess */
Art.lumi = (stage = 1, mood = 'happy') => Art.chibi({
  skin: '#fff0e6', hair: '#cdbfff', style: 'bob', dress: '#6fd0f7', trim: '#ffffff', mood,
  head: stage > 1 ? 'tiara' : 'snowpin', back: stage > 1 ? 'cape' : null, hand: 'snow',
});
/* Nova: a pop singer who chases Glooms with songs */
Art.nova = (stage = 1, mood = 'happy') => Art.chibi({
  skin: '#f6d2b8', hair: '#22c7b8', style: 'twin', dress: '#3a2f5b', trim: '#ff4d9d', mood,
  head: 'headphones', hand: stage > 1 ? 'starmic' : 'mic',
});

/* Pix: a blocky builder kid */
Art.pix = function (stage = 1, mood = 'happy') {
  const mouth = mood === 'sad' ? `<rect x="88" y="102" width="24" height="6" fill="#a8563a"/><rect x="84" y="106" width="6" height="6" fill="#a8563a"/><rect x="110" y="106" width="6" height="6" fill="#a8563a"/>`
    : `<rect x="86" y="98" width="28" height="6" fill="#a8563a"/><rect x="82" y="94" width="6" height="6" fill="#a8563a"/><rect x="112" y="94" width="6" height="6" fill="#a8563a"/>`;
  const tool = stage > 1
    ? `<rect x="160" y="96" width="8" height="74" fill="#b07a3c"/><rect x="144" y="84" width="40" height="22" fill="#ffd54a" stroke="#e0a800" stroke-width="3"/><text x="170" y="80" font-size="20">✨</text>`
    : `<rect x="160" y="110" width="8" height="60" fill="#b07a3c"/><rect x="148" y="100" width="32" height="18" fill="#9aa0a6" stroke="#6b7076" stroke-width="3"/>`;
  return svgWrap(`
    <rect x="66" y="196" width="30" height="48" fill="#4a5fc1"/><rect x="104" y="196" width="30" height="48" fill="#4a5fc1"/>
    <rect x="62" y="240" width="36" height="14" fill="#5b3a29"/><rect x="102" y="240" width="36" height="14" fill="#5b3a29"/>
    <rect x="36" y="126" width="26" height="58" fill="#ff9f43"/><rect x="138" y="126" width="26" height="58" fill="#ff9f43"/>
    <rect x="36" y="172" width="26" height="16" fill="#f2c79b"/><rect x="138" y="172" width="26" height="16" fill="#f2c79b"/>
    <rect x="62" y="124" width="76" height="76" fill="#3ecf8e"/>
    <rect x="62" y="124" width="76" height="14" fill="#ff9f43"/>
    <rect x="86" y="154" width="28" height="22" fill="#2fb377"/><rect x="72" y="124" width="10" height="36" fill="#2fb377"/><rect x="118" y="124" width="10" height="36" fill="#2fb377"/>
    <rect x="52" y="30" width="96" height="92" fill="#f2c79b"/>
    <rect x="52" y="30" width="96" height="24" fill="#d9662b"/><rect x="52" y="54" width="14" height="22" fill="#d9662b"/><rect x="134" y="54" width="14" height="22" fill="#d9662b"/>
    ${eyesG(`<rect x="72" y="70" width="16" height="16" fill="#fff"/><rect x="112" y="70" width="16" height="16" fill="#fff"/>
    <rect x="78" y="72" width="10" height="14" fill="#2d3a8c"/><rect x="118" y="72" width="10" height="14" fill="#2d3a8c"/>`)}
    <rect x="66" y="92" width="6" height="6" fill="#e0a070"/><rect x="128" y="92" width="6" height="6" fill="#e0a070"/>
    ${mouth}
    <rect x="46" y="14" width="108" height="24" fill="#ffd54a"/><rect x="38" y="34" width="124" height="10" fill="#f0b90b"/><rect x="88" y="6" width="24" height="12" fill="#ffe58a"/>
    ${tool}
  `);
};

/* Mochi: a curious kitten */
Art.mochi = function (stage = 1, mood = 'happy') {
  const mouth = mood === 'sad' ? `<path d="M90,124 Q100,116 110,124" stroke="#b5654a" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M88,117 Q94,127 100,117 Q106,127 112,117" stroke="#b5654a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const item = stage > 1 ? `<text x="134" y="200" font-size="46">🔍</text><text x="20" y="46" font-size="24">✨</text>` : '';
  return svgWrap(`
    <path d="M140,214 Q186,214 176,170 Q172,158 162,166 Q168,196 136,198 Z" fill="#ffb26b"/>
    <ellipse cx="100" cy="204" rx="46" ry="44" fill="#fff6e8" stroke="#e8c9a0" stroke-width="3"/>
    <ellipse cx="78" cy="244" rx="17" ry="10" fill="#fff6e8" stroke="#e8c9a0" stroke-width="3"/><ellipse cx="122" cy="244" rx="17" ry="10" fill="#fff6e8" stroke="#e8c9a0" stroke-width="3"/>
    <path d="M46,66 L48,10 L92,44 Z" fill="#fff6e8" stroke="#e8c9a0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M154,66 L152,10 L108,44 Z" fill="#ffb26b" stroke="#e39a52" stroke-width="3" stroke-linejoin="round"/>
    <path d="M56,50 L58,26 L76,42 Z" fill="#ffb3c7"/><path d="M144,50 L142,26 L124,42 Z" fill="#ffb3c7"/>
    <ellipse cx="100" cy="100" rx="68" ry="58" fill="#fff6e8" stroke="#e8c9a0" stroke-width="3"/>
    <path d="M118,46 Q150,50 164,84 Q150,70 128,72 Q120,60 118,46Z" fill="#ffb26b"/>
    <ellipse cx="56" cy="118" rx="11" ry="6.5" fill="#ff9bb0" opacity=".6"/><ellipse cx="144" cy="118" rx="11" ry="6.5" fill="#ff9bb0" opacity=".6"/>
    ${eyesG(`<ellipse cx="74" cy="100" rx="8" ry="10.5" fill="#3b2a4a"/><ellipse cx="126" cy="100" rx="8" ry="10.5" fill="#3b2a4a"/>
    <circle cx="77" cy="96" r="3.4" fill="#fff"/><circle cx="129" cy="96" r="3.4" fill="#fff"/>`)}
    <path d="M94,110 L106,110 L100,117 Z" fill="#ff8fab"/>
    ${mouth}
    <path d="M40,104 L14,98 M40,112 L14,116 M160,104 L186,98 M160,112 L186,116" stroke="#c9a57a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M58,152 Q100,172 142,152 L144,166 Q100,188 56,166 Z" fill="#5fd3bc"/>
    <path d="M120,168 L134,202 L116,198 Z" fill="#46bfa7"/>
    ${item}
  `);
};

/* Shelly: a little sea turtle who thinks she is too slow. When she grows, her shell turns to pearl. */
Art.shelly = function (stage = 1, mood = 'happy') {
  const K = '#9be3b0', KD = '#5fb985';
  const [shell, rim, plate] = stage > 1 ? ['#f7d3ec', '#d99ac6', '#fff0fa'] : ['#6fbf73', '#4d9a56', '#8fd394'];
  const mouth = mood === 'sad' ? `<path d="M90,134 Q100,126 110,134" stroke="#3f7a52" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M88,126 Q100,138 112,126" stroke="#3f7a52" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const hex = [[100, 186], [70, 200], [130, 200], [84, 226], [116, 226]].map(([x, y]) => `<path d="M${x - 12},${y} L${x - 6},${y - 10} L${x + 6},${y - 10} L${x + 12},${y} L${x + 6},${y + 10} L${x - 6},${y + 10} Z" fill="${plate}" stroke="${rim}" stroke-width="2.5" stroke-linejoin="round"/>`).join('');
  const pearl = stage > 1 ? `<path d="M80,52 Q100,30 120,52 Q100,46 80,52Z" fill="#ffc6d9" stroke="#e57aa8" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="42" r="8" fill="#fff6e6" stroke="#d9c6b0" stroke-width="2"/><circle cx="97" cy="39" r="2.4" fill="#fff"/><text x="142" y="56" font-size="24">✨</text>` : '';
  return svgWrap(`
    <ellipse cx="46" cy="196" rx="26" ry="12" fill="${K}" stroke="${KD}" stroke-width="3" transform="rotate(-30 46 196)"/><ellipse cx="154" cy="196" rx="26" ry="12" fill="${K}" stroke="${KD}" stroke-width="3" transform="rotate(30 154 196)"/>
    <ellipse cx="74" cy="246" rx="18" ry="10" fill="${K}" stroke="${KD}" stroke-width="3"/><ellipse cx="126" cy="246" rx="18" ry="10" fill="${K}" stroke="${KD}" stroke-width="3"/>
    <ellipse cx="100" cy="206" rx="58" ry="46" fill="${shell}" stroke="${rim}" stroke-width="3.5"/>
    ${hex}
    ${stage > 1 ? '<ellipse cx="78" cy="184" rx="10" ry="5" fill="#fff" opacity=".7" transform="rotate(-25 78 184)"/>' : ''}
    <ellipse cx="100" cy="102" rx="64" ry="56" fill="${K}" stroke="${KD}" stroke-width="3"/>
    <ellipse cx="62" cy="64" rx="8" ry="5" fill="${KD}" opacity=".45"/><ellipse cx="136" cy="62" rx="6" ry="4" fill="${KD}" opacity=".45"/><ellipse cx="150" cy="80" rx="5" ry="3.5" fill="${KD}" opacity=".45"/>
    <ellipse cx="56" cy="118" rx="11" ry="6.5" fill="#ff9bb0" opacity=".6"/><ellipse cx="144" cy="118" rx="11" ry="6.5" fill="#ff9bb0" opacity=".6"/>
    ${eyesG(`<ellipse cx="74" cy="100" rx="9" ry="12" fill="#3b2a4a"/><ellipse cx="126" cy="100" rx="9" ry="12" fill="#3b2a4a"/>
    <circle cx="77" cy="95" r="3.8" fill="#fff"/><circle cx="129" cy="95" r="3.8" fill="#fff"/>`)}
    ${mouth}${pearl}
  `);
};

/* Sora: a little sky dragon who is learning to fly */
Art.sora = function (stage = 1, mood = 'happy') {
  const B = '#8fd3ff', D = '#4fa9e0';
  /* one wing, drawn for the left side; big rainbow wings when she has grown */
  const wingPath = 'M0,0 Q-40,-70 -86,-52 Q-70,-36 -74,-22 Q-58,-20 -56,-4 Q-34,-6 0,14 Z';
  const layers = stage > 1 ? [[0.8, '#ff9fc8'], [0.6, '#ffe58a'], [0.42, '#a6f0c6']] : [[0.5, '#cdeeff']];
  const wing = layers.map(([s, c]) => `<path d="${wingPath}" transform="scale(${s})" fill="${c}" stroke="${D}" stroke-width="${3 / s}" stroke-linejoin="round"/>`).join('');
  const wings = `<g transform="translate(70,176)">${wing}</g><g transform="translate(130,176) scale(-1,1)">${wing}</g>`;
  const mouth = mood === 'sad' ? `<path d="M90,142 Q100,134 110,142" stroke="#b5654a" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M90,136 Q100,146 110,136" stroke="#b5654a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const scarf = stage > 1 ? `<path d="M62,152 Q100,170 138,152 L140,164 Q100,184 60,164 Z" fill="#ff7eb6"/><path d="M61,158 Q100,177 139,158" stroke="#ffe58a" stroke-width="4" fill="none"/><text x="146" y="58" font-size="24">✨</text>` : '';
  return svgWrap(`
    ${wings}
    <path d="M136,222 Q182,232 184,192 L196,182 L182,178 Q170,206 134,204 Z" fill="${B}" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="100" cy="204" rx="44" ry="42" fill="${B}" stroke="${D}" stroke-width="3"/>
    <ellipse cx="100" cy="212" rx="27" ry="30" fill="#fff3c4"/>
    <path d="M82,198 h36 M78,212 h44 M82,226 h36" stroke="#f0d78a" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="78" cy="246" rx="17" ry="10" fill="${B}" stroke="${D}" stroke-width="3"/><ellipse cx="122" cy="246" rx="17" ry="10" fill="${B}" stroke="${D}" stroke-width="3"/>
    <ellipse cx="60" cy="196" rx="9" ry="14" fill="${B}" stroke="${D}" stroke-width="3" transform="rotate(20 60 196)"/><ellipse cx="140" cy="196" rx="9" ry="14" fill="${B}" stroke="${D}" stroke-width="3" transform="rotate(-20 140 196)"/>
    <path d="M68,60 L58,20 L88,50 Z M132,60 L142,20 L112,50 Z" fill="#ffe58a" stroke="#e0b84a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M86,52 L94,30 L102,48 L110,32 L116,54 Z" fill="#ff9fc8" stroke="#e57aa8" stroke-width="2.5" stroke-linejoin="round"/>
    <ellipse cx="100" cy="102" rx="66" ry="56" fill="${B}" stroke="${D}" stroke-width="3"/>
    <ellipse cx="100" cy="128" rx="30" ry="19" fill="#c4ecff"/>
    <circle cx="91" cy="122" r="2.6" fill="${D}"/><circle cx="109" cy="122" r="2.6" fill="${D}"/>
    <ellipse cx="52" cy="118" rx="11" ry="6.5" fill="#ff9bb0" opacity=".6"/><ellipse cx="148" cy="118" rx="11" ry="6.5" fill="#ff9bb0" opacity=".6"/>
    ${eyesG(`<ellipse cx="72" cy="96" rx="8.5" ry="11" fill="#3b2a4a"/><ellipse cx="128" cy="96" rx="8.5" ry="11" fill="#3b2a4a"/>
    <circle cx="75" cy="91" r="3.6" fill="#fff"/><circle cx="131" cy="91" r="3.6" fill="#fff"/>`)}
    ${mouth}
    ${scarf}
  `);
};

/* Twinkle: a little piece of the Rainbow Star */
Art.twinkle = (mood = 'happy') => svgWrap(`
  <circle cx="100" cy="130" r="92" fill="#fff6b0" opacity=".45"/>
  <path d="M100,36 L124,100 L192,104 L138,146 L158,212 L100,174 L42,212 L62,146 L8,104 L76,100 Z" fill="#ffd54a" stroke="#f0a800" stroke-width="5" stroke-linejoin="round"/>
  ${eyesG(`<ellipse cx="80" cy="128" rx="7" ry="10" fill="#3b2a4a"/><ellipse cx="120" cy="128" rx="7" ry="10" fill="#3b2a4a"/>
  <circle cx="83" cy="124" r="3" fill="#fff"/><circle cx="123" cy="124" r="3" fill="#fff"/>`)}
  <ellipse cx="66" cy="144" rx="9" ry="5" fill="#ff9bb0" opacity=".7"/><ellipse cx="134" cy="144" rx="9" ry="5" fill="#ff9bb0" opacity=".7"/>
  ${mood === 'sad' ? '<path d="M90,154 Q100,146 110,154" stroke="#b5654a" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '<path d="M88,146 Q100,160 112,146" stroke="#b5654a" stroke-width="3.5" fill="none" stroke-linecap="round"/>'}
`);

/* Gloom: a grumpy shadow puff. mood 0 = grumpy and grey, 1 = happy and bright.
   king: wears a crown. storm: a storm cloud with lightning, that makes a rainbow when happy.
   puffer: a round pufferfish with spikes that go down when it cheers up. */
/* the pufferfish: tail, fins and spikes (long when grumpy, short when happy), then the round body */
function pufferBody(m, body, dark) {
  const L = 6 + (1 - m) * 16;
  const spikes = [...Array(18)].map((_, k) => {
    const a = k / 18 * Math.PI * 2, b = 0.12, R = 70;
    const p = (ang, r) => `${(100 + r * Math.cos(ang)).toFixed(1)},${(140 + r * Math.sin(ang)).toFixed(1)}`;
    return `M${p(a - b, R)} L${p(a, R + L)} L${p(a + b, R)}Z`;
  }).join(' ');
  const bubbles = m > 0.6 ? `<circle cx="34" cy="60" r="8" fill="none" stroke="#bfe9ff" stroke-width="3"/><circle cx="20" cy="36" r="5" fill="none" stroke="#bfe9ff" stroke-width="3"/>` : '';
  return `${bubbles}<path d="M160,140 L198,108 Q190,140 198,172 Z" fill="${body}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>
    <path d="${spikes}" fill="${dark}" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="100" cy="140" r="72" fill="${body}" stroke="${dark}" stroke-width="5"/>
    <ellipse cx="100" cy="186" rx="44" ry="20" fill="#fff" opacity=".35"/>
    <path d="M40,150 Q22,140 30,124 Q44,132 48,146Z" fill="${dark}" opacity=".8"/>`;
}
Art.gloom = function (o) {
  o = Object.assign({ mood: 0, king: false, storm: false, puffer: false }, o);
  const m = clamp(o.mood, 0, 1);
  const body = o.storm ? lerpColor('#5a6688', '#eef6ff', m) : o.puffer ? lerpColor('#6b7f8c', '#ffd27a', m) : lerpColor('#5d4f73', '#ffc94d', m);
  const dark = o.storm ? lerpColor('#3e4866', '#9cc6ec', m) : o.puffer ? lerpColor('#4b5c68', '#f0a93b', m) : lerpColor('#463a59', '#f59e0b', m);
  const my = 176 + (m - 0.5) * 30;            // mouth curve: frown -> smile
  const brow = (1 - m) * 12;
  const crown = o.king ? `<path d="M62,60 L68,22 L86,44 L100,14 L114,44 L132,22 L138,60 Z" fill="#ffd54a" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="46" r="6" fill="#b388ff"/>` : '';
  const cheeks = m > 0.6 ? `<ellipse cx="58" cy="150" rx="11" ry="6" fill="#ff9bb0" opacity=".7"/><ellipse cx="142" cy="150" rx="11" ry="6" fill="#ff9bb0" opacity=".7"/>` : '';
  const glow = m > 0.6 ? `<circle cx="100" cy="140" r="96" fill="#fff3a8" opacity=".5"/>` : '';
  const happyBow = o.storm && m > 0.6 ? ['#ff7eb6', '#ffd54a', '#5fd38d', '#4aa8ff'].map((c, k) => `<path d="M${30 + k * 9},72 A${70 - k * 9},${64 - k * 9} 0 0 1 ${170 - k * 9},72" stroke="${c}" stroke-width="9" fill="none"/>`).join('') : '';
  const puffs = o.storm ? `<circle cx="62" cy="80" r="30" fill="${body}" stroke="${dark}" stroke-width="5"/><circle cx="100" cy="60" r="36" fill="${body}" stroke="${dark}" stroke-width="5"/><circle cx="140" cy="80" r="30" fill="${body}" stroke="${dark}" stroke-width="5"/>` : '';
  const antennas = o.storm || o.puffer ? '' : `<path d="M56,74 Q44,50 60,40 M144,74 Q156,50 140,40" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="38" r="6" fill="${m > 0.6 ? '#ff7eb6' : dark}"/><circle cx="140" cy="38" r="6" fill="${m > 0.6 ? '#7fd4f5' : dark}"/>`;
  const thunder = o.storm && m < 0.6 ? `<g opacity="${(1 - m).toFixed(2)}"><path d="M150,14 L178,14 L164,42 L184,42 L146,92 L156,56 L138,56 Z" fill="#ffd54a" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/>
    ${[56, 86, 116, 146].map((x, k) => `<path d="M${x},${240 + (k % 2) * 8} l-6,14" stroke="#7cc8f2" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>` : '';
  return svgWrap(`
    ${glow}${happyBow}${puffs}
    ${o.puffer ? pufferBody(m, body, dark) : `<path d="M32,160 Q22,60 100,52 Q178,60 168,160 Q174,214 146,204 Q132,232 114,208 Q100,236 86,208 Q68,232 54,204 Q26,214 32,160Z" fill="${body}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>`}
    ${antennas}
    ${eyesG(`<ellipse cx="76" cy="124" rx="16" ry="18" fill="#fff"/><ellipse cx="124" cy="124" rx="16" ry="18" fill="#fff"/>
    <circle cx="79" cy="128" r="8" fill="#2b2140"/><circle cx="121" cy="128" r="8" fill="#2b2140"/>
    <circle cx="82" cy="124" r="3" fill="#fff"/><circle cx="124" cy="124" r="3" fill="#fff"/>`)}
    <path d="M54,${100 - brow} L94,${100 + brow}" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M146,${100 - brow} L106,${100 + brow}" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M78,170 Q100,${my} 122,170" stroke="#2b2140" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${cheeks}${crown}${thunder}
  `);
};

Art.narr = () => `<div class="char emoji-char">📖</div>`;

/* ---------- Star shards and the Rainbow Star ---------- */
const SHARD_COLORS = ['#6fd0f7', '#5fd38d', '#ff6fb1', '#ffd54a', '#b388ff'];
/* one crystal shard; k = world number (0 to 4) */
Art.shard = function (k) {
  const c = SHARD_COLORS[k % 5], li = lerpColor(c, '#ffffff', 0.55), dk = lerpColor(c, '#000000', 0.25);
  return `<svg class="shardsvg" viewBox="0 0 100 124" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,4 90,42 50,120 10,42" fill="${c}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="50,6 88,42 50,54" fill="${li}" opacity=".9"/><polygon points="50,6 12,42 50,54" fill="${li}" opacity=".5"/>
    <polygon points="12,42 50,54 50,117" fill="${dk}" opacity=".35"/>
    <path d="M28,32 L37,23" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`;
};
/* the Rainbow Star, made of 5 pieces. filled = which pieces are found. */
Art.star5 = function (filled, face) {
  const C = [100, 108], pt = (r, deg) => [C[0] + r * Math.cos(deg * Math.PI / 180), C[1] + r * Math.sin(deg * Math.PI / 180)];
  let segs = '';
  for (let k = 0; k < 5; k++) {
    const a = -90 + 72 * k, on = filled[k];
    const p = [C, pt(42, a - 36), pt(96, a), pt(42, a + 36)].map(q => q.map(v => v.toFixed(1)).join(',')).join(' ');
    segs += `<polygon class="seg${on ? ' on' : ''}" points="${p}" fill="${on ? SHARD_COLORS[k] : 'rgba(255,255,255,.3)'}" stroke="#fff" stroke-width="${on ? 4 : 3}" ${on ? '' : 'stroke-dasharray="7 6"'} stroke-linejoin="round"/>`;
  }
  const f = face && filled.every(Boolean) ? `<g class="starface">${eyesG('<ellipse cx="86" cy="100" rx="6" ry="9" fill="#3b2a4a"/><ellipse cx="114" cy="100" rx="6" ry="9" fill="#3b2a4a"/><circle cx="88" cy="96" r="2.5" fill="#fff"/><circle cx="116" cy="96" r="2.5" fill="#fff"/>')}<path d="M90,116 Q100,127 110,116" stroke="#3b2a4a" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>` : '';
  return `<svg class="star5" viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg">${segs}${f}</svg>`;
};
/* a rainbow with a cloud at each end */
Art.rainbow = function () {
  const arcs = ['#ff5f6d', '#ff9f43', '#ffd54a', '#5fd38d', '#4aa8ff', '#8e6bff'].map((c, k) => {
    const r = 92 - k * 9;
    return `<path d="M${100 - r},100 A${r},${r} 0 0 1 ${100 + r},100" stroke="${c}" stroke-width="9.5" fill="none"/>`;
  }).join('');
  const cloud = x => `<g fill="#fff"><circle cx="${x - 10}" cy="100" r="13"/><circle cx="${x + 6}" cy="94" r="16"/><circle cx="${x + 17}" cy="103" r="11"/><rect x="${x - 22}" y="100" width="50" height="14" rx="7"/></g>`;
  return `<svg class="rainbowsvg" viewBox="0 0 200 116" xmlns="http://www.w3.org/2000/svg">${arcs}${cloud(16)}${cloud(178)}</svg>`;
};

/* ---------- Scenery for each world (drawn at the bottom of a scene) ---------- */
Art.scenery = function (id) {
  let s = '';
  const R = (x, y, w, hh, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${f}" ${extra}/>`;
  if (id === 'frost') {
    s += `<path d="M0,420 L0,310 L130,130 L250,280 L390,90 L540,290 L660,160 L800,300 L900,210 L1000,300 L1000,420Z" fill="#c6e0fa"/>`;
    s += `<path d="M130,130 L168,187 L142,176 L124,196 L96,177Z M390,90 L436,152 L404,140 L384,164 L352,142Z M660,160 L700,212 L672,202 L650,222 L626,206Z" fill="#fff"/>`;
    s += `<path d="M0,420 L0,345 Q250,290 520,350 T1000,335 L1000,420Z" fill="#fff"/>`;
    s += R(760, 250, 90, 100, '#bfe9ff') + R(740, 280, 30, 70, '#a9dcf7') + R(850, 270, 30, 80, '#a9dcf7');
    s += `<path d="M760,250 L805,190 L850,250Z M740,280 L755,250 L770,280Z M850,270 L865,240 L880,270Z" fill="#7cc8f2"/>` + R(795, 310, 22, 40, '#7cc8f2', 'rx="11"');
    for (const [x, y, k] of [[90, 352, 1], [180, 364, 0.8], [560, 358, 0.9], [940, 352, 1.1]])
      s += `<path d="M${x},${y} l${-26 * k},0 l${26 * k},${-70 * k} l${26 * k},${70 * k}Z" fill="#6fbfa8"/><path d="M${x},${y - 70 * k} l${-10 * k},${26 * k} l${20 * k},0Z" fill="#fff"/>`;
  } else if (id === 'block') {
    [3, 4, 4, 5, 6, 6, 5, 4, 3, 3, 4, 5, 5, 4, 6, 7, 7, 6, 4, 3].forEach((v, i) => { const x = i * 50, y = 360 - v * 26; s += R(x, y, 50, 420 - y, '#8ad66a') + R(x, y, 50, 10, '#6cc24a'); });
    s += R(0, 356, 1000, 64, '#6cc24a') + R(0, 376, 1000, 44, '#9b6b43');
    for (let i = 0; i < 20; i++) s += R(i * 50 + (i % 2 ? 10 : 28), 386 + (i % 3) * 8, 10, 10, '#855a36');
    s += R(140, 280, 26, 76, '#8a5a34') + R(98, 248, 110, 34, '#2f8f44') + R(108, 214, 90, 40, '#3fa34d') + R(124, 186, 58, 30, '#4db85c');
    s += R(620, 60, 120, 28, '#fff', 'opacity=".9"') + R(650, 38, 60, 24, '#fff', 'opacity=".9"') + R(240, 90, 90, 24, '#fff', 'opacity=".8"') + R(860, 40, 64, 64, '#ffd54a');
  } else if (id === 'star') {
    [150, 210, 120, 260, 180, 230, 140, 200, 280, 160, 220, 130, 190, 250, 170].forEach((v, i) => {
      const x = i * 68 - 10; s += R(x, 360 - v, 62, v, '#1d1440');
      for (let r = 0; r < Math.floor(v / 34) - 1; r++) for (let c = 0; c < 3; c++) if ((i * 7 + r * 3 + c * 5) % 4) s += R(x + 10 + c * 16, 360 - v + 14 + r * 34, 9, 13, (i + r + c) % 5 ? '#ffd98a' : '#ff8ccf', 'opacity=".85"');
    });
    s += `<path d="M180,0 L60,360 L330,360Z" fill="#fff" opacity=".10"/><path d="M820,0 L670,360 L940,360Z" fill="#ff8ccf" opacity=".13"/><path d="M500,0 L380,360 L620,360Z" fill="#7ff0e2" opacity=".10"/>`;
    s += R(0, 352, 1000, 68, '#3a2466') + R(0, 352, 1000, 8, '#ff4d9d');
    for (let i = 0; i < 12; i++) s += `<circle cx="${40 + i * 84}" cy="356" r="6" fill="#ffe58a"/>`;
  } else if (id === 'meadow') {
    s += `<ellipse cx="220" cy="430" rx="420" ry="150" fill="#b9eaa0"/><ellipse cx="800" cy="440" rx="460" ry="170" fill="#a4e089"/><path d="M0,420 L0,372 Q500,330 1000,372 L1000,420Z" fill="#8fd672"/>`;
    s += `<path d="M430,420 Q470,360 560,340 T700,292" stroke="#ffb3d5" stroke-width="26" fill="none" stroke-linecap="round"/>`;
    s += R(690, 232, 84, 60, '#fff3e0') + `<path d="M678,236 L732,188 L786,236Z" fill="#ff8fb8"/>` + R(722, 258, 20, 34, '#c98a5a');
    const cols = ['#ff7eb6', '#ffd54a', '#ffffff', '#b388ff'];
    for (let i = 0; i < 22; i++) { const x = (i * 47 + 20) % 1000, y = 374 + (i * 29) % 42; s += `<path d="M${x},${y} v-14" stroke="#4fae52" stroke-width="3"/><circle cx="${x}" cy="${y - 16}" r="6.5" fill="${cols[i % 4]}"/><circle cx="${x}" cy="${y - 16}" r="2.5" fill="#f5a623"/>`; }
  } else if (id === 'castle') {
    s += `<circle cx="810" cy="92" r="74" fill="#fff3b0" opacity=".18"/><circle cx="810" cy="92" r="48" fill="#fff3b0"/>`;
    s += `<path d="M0,420 L0,330 Q160,260 330,330 T680,320 T1000,310 L1000,420Z" fill="#241a4a"/>`;
    s += R(380, 190, 240, 170, '#130e2b') + R(350, 150, 56, 210, '#17113a') + R(594, 150, 56, 210, '#17113a') + R(470, 110, 60, 250, '#17113a');
    s += `<path d="M344,150 L378,96 L412,150Z M588,150 L622,96 L656,150Z M462,110 L500,46 L538,110Z" fill="#3b2a7a"/>`;
    for (let i = 0; i < 6; i++) s += R(384 + i * 40, 178, 22, 14, '#130e2b');
    s += [[370, 190], [614, 190], [491, 150], [430, 250], [550, 250]].map(([x, y]) => R(x, y, 16, 24, '#ffd54a', 'rx="8"')).join('');
    s += `<path d="M476,360 v-50 a24,24 0 0 1 48,0 v50Z" fill="#0b0820"/><path d="M0,420 L0,372 Q500,345 1000,372 L1000,420Z" fill="#1a1338"/>`;
  } else if (id === 'sea') {
    s += `<defs><linearGradient id="searay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
    for (const [x, w] of [[120, 70], [380, 90], [640, 60], [860, 80]]) s += `<path d="M${x},0 L${x + w},0 L${x + w * 2.2},420 L${x + w * 0.6},420Z" fill="url(#searay)"/>`;
    for (const [x, y, r] of [[90, 120, 8], [110, 80, 5], [520, 60, 7], [540, 30, 4], [940, 140, 9], [960, 100, 5]]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    s += `<path d="M0,420 L0,330 Q200,300 420,330 T1000,320 L1000,420Z" fill="#f1dc9c"/><path d="M0,420 L0,370 Q300,350 600,372 T1000,365 L1000,420Z" fill="#e8cd84"/>`;
    const weed = (x, hh, c) => `<path d="M${x},${336} q-16,-${hh / 4} 0,-${hh / 2} t0,-${hh / 2}" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    s += weed(60, 160, '#3fa34d') + weed(84, 110, '#5fc27a') + weed(470, 130, '#3fa34d') + weed(900, 180, '#3fa34d') + weed(930, 120, '#5fc27a');
    const coral = (x, c) => `<path d="M${x},334 L${x},300 M${x},312 L${x - 18},288 M${x},306 L${x + 16},280 M${x - 18},288 L${x - 26},272 M${x + 16},280 L${x + 26},266" stroke="${c}" stroke-width="11" stroke-linecap="round" fill="none"/>`;
    s += coral(200, '#ff7eb6') + coral(260, '#ff9f43') + coral(700, '#ff7eb6') + coral(770, '#b388ff');
    s += `<ellipse cx="560" cy="336" rx="56" ry="26" fill="#8a94a6"/><ellipse cx="610" cy="342" rx="34" ry="18" fill="#a3adbd"/>`;
    s += `<path d="M352,350 Q350,330 364,328 Q378,330 376,350Z" fill="#ffc6d9"/><path d="M820,352 Q818,334 830,332 Q842,334 840,352Z" fill="#fff3e0"/><circle cx="420" cy="352" r="6" fill="#fff6e6"/>`;
    s += `<path d="M300,180 q20,-14 40,0 q-20,14 -40,0Z M340,180 l12,-9 v18Z" fill="#ffb347"/><path d="M700,140 q16,-11 32,0 q-16,11 -32,0Z M732,140 l10,-7 v14Z" fill="#ffd54a"/>`;
  } else if (id === 'sky') {
    ['#ff8fa3', '#ffc078', '#ffe58a', '#a6e3a1', '#8fd3ff', '#c3a6ff'].forEach((c, k) => { const r = 330 - k * 16; s += `<path d="M${180 - r},420 A${r},${r} 0 0 1 ${180 + r},420" stroke="${c}" stroke-width="16" fill="none" opacity=".7"/>`; });
    for (const [x, y, k] of [[300, 70, 1], [560, 46, 0.7], [930, 60, 0.9]]) s += `<ellipse cx="${x}" cy="${y}" rx="${70 * k}" ry="${22 * k}" fill="#fff" opacity=".85"/><ellipse cx="${x - 16 * k}" cy="${y - 14 * k}" rx="${34 * k}" ry="${22 * k}" fill="#fff" opacity=".85"/>`;
    const isle = (x, y, w) => `<path d="M${x - w / 2},${y} Q${x - w / 4},${y + w * 0.5} ${x},${y + w * 0.8} Q${x + w / 4},${y + w * 0.5} ${x + w / 2},${y} Z" fill="#b08968"/><ellipse cx="${x}" cy="${y}" rx="${w / 2 + 6}" ry="${w * 0.12}" fill="#7ed37a"/>`;
    s += isle(640, 220, 160) + isle(870, 150, 110) + isle(440, 150, 80);
    s += R(612, 172, 52, 40, '#fff3e0') + `<path d="M604,176 L638,142 L672,176Z" fill="#8fd3ff"/>` + R(630, 190, 14, 22, '#c98a5a');
    s += R(866, 112, 8, 30, '#8a5a34') + `<circle cx="870" cy="104" r="20" fill="#5fc27a"/>` + `<circle cx="440" cy="132" r="9" fill="#ff7eb6"/><circle cx="426" cy="138" r="7" fill="#ffd54a"/>`;
    for (let i = 0; i < 9; i++) s += `<circle cx="${i * 125 + 30}" cy="${380 - (i % 2) * 12}" r="${70 + (i % 3) * 12}" fill="#e6f3ff"/>`;
    for (let i = 0; i < 13; i++) s += `<circle cx="${i * 85}" cy="${402 + (i % 3) * 8}" r="${52 + (i % 2) * 14}" fill="#fff"/>`;
  } else {
    s += `<ellipse cx="200" cy="440" rx="430" ry="160" fill="#a9e2c0"/><ellipse cx="780" cy="450" rx="480" ry="180" fill="#bfe6a8"/><path d="M0,420 L0,376 Q500,340 1000,376 L1000,420Z" fill="#9bd98a"/>`;
    for (const [x, c] of [[300, '#ff8fb8'], [372, '#7cc8f2'], [650, '#ffd54a']]) s += R(x, 322, 52, 42, '#fff3e0') + `<path d="M${x - 8},326 L${x + 26},292 L${x + 60},326Z" fill="${c}"/>` + R(x + 20, 342, 12, 22, '#c98a5a');
    for (const [x, y] of [[120, 352], [470, 350], [560, 356], [860, 350], [930, 358]]) s += R(x - 4, y - 26, 8, 30, '#8a5a34') + `<circle cx="${x}" cy="${y - 40}" r="24" fill="#5fc27a"/>`;
  }
  return `<svg class="scenery" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
};
