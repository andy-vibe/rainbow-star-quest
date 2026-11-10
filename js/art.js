/* All characters are drawn here with SVG. They are original characters. */
'use strict';

const Art = {};
const svgWrap = (inner, vb = '0 -14 200 280') => `<svg class="char" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

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
    <ellipse cx="78" cy="104" rx="8.5" ry="11.5" fill="#3b2a4a"/><ellipse cx="122" cy="104" rx="8.5" ry="11.5" fill="#3b2a4a"/>
    <circle cx="81" cy="99" r="3.6" fill="#fff"/><circle cx="125" cy="99" r="3.6" fill="#fff"/>
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
    <rect x="72" y="70" width="16" height="16" fill="#fff"/><rect x="112" y="70" width="16" height="16" fill="#fff"/>
    <rect x="78" y="72" width="10" height="14" fill="#2d3a8c"/><rect x="118" y="72" width="10" height="14" fill="#2d3a8c"/>
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
    <ellipse cx="74" cy="100" rx="8" ry="10.5" fill="#3b2a4a"/><ellipse cx="126" cy="100" rx="8" ry="10.5" fill="#3b2a4a"/>
    <circle cx="77" cy="96" r="3.4" fill="#fff"/><circle cx="129" cy="96" r="3.4" fill="#fff"/>
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
  <ellipse cx="80" cy="128" rx="7" ry="10" fill="#3b2a4a"/><ellipse cx="120" cy="128" rx="7" ry="10" fill="#3b2a4a"/>
  <circle cx="83" cy="124" r="3" fill="#fff"/><circle cx="123" cy="124" r="3" fill="#fff"/>
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
    <ellipse cx="76" cy="124" rx="16" ry="18" fill="#fff"/><ellipse cx="124" cy="124" rx="16" ry="18" fill="#fff"/>
    <circle cx="79" cy="128" r="8" fill="#2b2140"/><circle cx="121" cy="128" r="8" fill="#2b2140"/>
    <circle cx="82" cy="124" r="3" fill="#fff"/><circle cx="124" cy="124" r="3" fill="#fff"/>
    <path d="M54,${100 - brow} L94,${100 + brow}" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M146,${100 - brow} L106,${100 + brow}" stroke="${dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M78,170 Q100,${my} 122,170" stroke="#2b2140" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${cheeks}${crown}
  `);
};

Art.narr = () => `<div class="char emoji-char">📖</div>`;
