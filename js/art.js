/* All characters are drawn here with SVG. They are original characters. */
'use strict';

const Art = {};
const svgWrap = (inner, vb = '0 -14 200 280') => `<svg class="char" viewBox="${vb}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
/* eyes that blink (each character blinks at its own time) */
const eyesG = inner => `<g class="eyes" style="animation-delay:-${(Math.random() * 4.5).toFixed(2)}s">${inner}</g>`;

/* A cute girl character. Options change hair, dress and extras. */
Art.chibi = function (o) {
  o = Object.assign({ skin: '#ffe0c8', hair: '#5b3a29', style: 'long', dress: '#ff7eb6', trim: '#ffffff', head: null, back: null, hand: null, mood: 'happy', extra: '' }, o);
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

  return svgWrap(`
    ${backAcc}${backHair}
    <rect x="80" y="224" width="14" height="24" rx="6" fill="${K}"/><rect x="106" y="224" width="14" height="24" rx="6" fill="${K}"/>
    <ellipse cx="85" cy="251" rx="14" ry="7.5" fill="#7a4b8c"/><ellipse cx="115" cy="251" rx="14" ry="7.5" fill="#7a4b8c"/>
    <path d="M76,156 L50,190" stroke="${o.dress}" stroke-width="17" stroke-linecap="round"/><path d="M124,156 L150,190" stroke="${o.dress}" stroke-width="17" stroke-linecap="round"/>
    <circle cx="48" cy="194" r="9.5" fill="${K}"/><circle cx="152" cy="194" r="9.5" fill="${K}"/>
    <path d="M74,148 Q100,138 126,148 L152,222 Q100,238 48,222 Z" fill="${o.dress}"/>
    <path d="M48,222 Q100,238 152,222 L155,231 Q100,248 45,231 Z" fill="${o.trim}"/>
    <path d="M84,146 Q100,160 116,146" stroke="${o.trim}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="95" r="58" fill="${K}"/>
    <ellipse cx="60" cy="119" rx="11" ry="6.5" fill="#ff9bb0" opacity=".55"/><ellipse cx="140" cy="119" rx="11" ry="6.5" fill="#ff9bb0" opacity=".55"/>
    ${eyesG(`<ellipse cx="78" cy="104" rx="8.5" ry="11.5" fill="#3b2a4a"/><ellipse cx="122" cy="104" rx="8.5" ry="11.5" fill="#3b2a4a"/>
    <circle cx="81" cy="99" r="3.6" fill="#fff"/><circle cx="125" cy="99" r="3.6" fill="#fff"/>`)}
    ${mouth}
    <path d="M42,97 Q36,34 100,30 Q164,34 158,97 Q150,66 126,60 Q116,80 98,62 Q72,62 42,97 Z" fill="${H}"/>
    ${headAcc}${handAcc}${o.extra}
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

/* Twinkle: a little piece of the Rainbow Star */
Art.twinkle = (mood = 'happy') => svgWrap(`
  <circle cx="100" cy="130" r="92" fill="#fff6b0" opacity=".45"/>
  <path d="M100,36 L124,100 L192,104 L138,146 L158,212 L100,174 L42,212 L62,146 L8,104 L76,100 Z" fill="#ffd54a" stroke="#f0a800" stroke-width="5" stroke-linejoin="round"/>
  ${eyesG(`<ellipse cx="80" cy="128" rx="7" ry="10" fill="#3b2a4a"/><ellipse cx="120" cy="128" rx="7" ry="10" fill="#3b2a4a"/>
  <circle cx="83" cy="124" r="3" fill="#fff"/><circle cx="123" cy="124" r="3" fill="#fff"/>`)}
  <ellipse cx="66" cy="144" rx="9" ry="5" fill="#ff9bb0" opacity=".7"/><ellipse cx="134" cy="144" rx="9" ry="5" fill="#ff9bb0" opacity=".7"/>
  ${mood === 'sad' ? '<path d="M90,154 Q100,146 110,154" stroke="#b5654a" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '<path d="M88,146 Q100,160 112,146" stroke="#b5654a" stroke-width="3.5" fill="none" stroke-linecap="round"/>'}
`);

/* Gloom: a grumpy shadow puff. mood 0 = grumpy and grey, 1 = happy and bright. */
Art.gloom = function (o) {
  o = Object.assign({ mood: 0, king: false }, o);
  const m = clamp(o.mood, 0, 1);
  const body = lerpColor('#5d4f73', '#ffc94d', m), dark = lerpColor('#463a59', '#f59e0b', m);
  const my = 176 + (m - 0.5) * 30;            // mouth curve: frown -> smile
  const brow = (1 - m) * 12;
  const crown = o.king ? `<path d="M62,60 L68,22 L86,44 L100,14 L114,44 L132,22 L138,60 Z" fill="#ffd54a" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="46" r="6" fill="#b388ff"/>` : '';
  const cheeks = m > 0.6 ? `<ellipse cx="58" cy="150" rx="11" ry="6" fill="#ff9bb0" opacity=".7"/><ellipse cx="142" cy="150" rx="11" ry="6" fill="#ff9bb0" opacity=".7"/>` : '';
  const glow = m > 0.6 ? `<circle cx="100" cy="140" r="96" fill="#fff3a8" opacity=".5"/>` : '';
  return svgWrap(`
    ${glow}
    <path d="M32,160 Q22,60 100,52 Q178,60 168,160 Q174,214 146,204 Q132,232 114,208 Q100,236 86,208 Q68,232 54,204 Q26,214 32,160Z" fill="${body}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M56,74 Q44,50 60,40 M144,74 Q156,50 140,40" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="38" r="6" fill="${m > 0.6 ? '#ff7eb6' : dark}"/><circle cx="140" cy="38" r="6" fill="${m > 0.6 ? '#7fd4f5' : dark}"/>
    ${eyesG(`<ellipse cx="76" cy="124" rx="16" ry="18" fill="#fff"/><ellipse cx="124" cy="124" rx="16" ry="18" fill="#fff"/>
    <circle cx="79" cy="128" r="8" fill="#2b2140"/><circle cx="121" cy="128" r="8" fill="#2b2140"/>
    <circle cx="82" cy="124" r="3" fill="#fff"/><circle cx="124" cy="124" r="3" fill="#fff"/>`)}
    <path d="M54,${100 - brow} L94,${100 + brow}" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M146,${100 - brow} L106,${100 + brow}" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M78,170 Q100,${my} 122,170" stroke="#2b2140" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${cheeks}${crown}
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
  } else {
    s += `<ellipse cx="200" cy="440" rx="430" ry="160" fill="#a9e2c0"/><ellipse cx="780" cy="450" rx="480" ry="180" fill="#bfe6a8"/><path d="M0,420 L0,376 Q500,340 1000,376 L1000,420Z" fill="#9bd98a"/>`;
    for (const [x, c] of [[300, '#ff8fb8'], [372, '#7cc8f2'], [650, '#ffd54a']]) s += R(x, 322, 52, 42, '#fff3e0') + `<path d="M${x - 8},326 L${x + 26},292 L${x + 60},326Z" fill="${c}"/>` + R(x + 20, 342, 12, 22, '#c98a5a');
    for (const [x, y] of [[120, 352], [470, 350], [560, 356], [860, 350], [930, 358]]) s += R(x - 4, y - 26, 8, 30, '#8a5a34') + `<circle cx="${x}" cy="${y - 40}" r="24" fill="#5fc27a"/>`;
  }
  return `<svg class="scenery" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
};
