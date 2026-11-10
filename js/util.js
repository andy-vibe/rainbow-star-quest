/* Small helpers, sound and voice. No libraries. */
'use strict';

function h(tag, a, ...kids) {
  const e = document.createElement(tag);
  if (a) for (const k in a) {
    const v = a[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sample = (arr, n) => shuffle(arr).slice(0, n);
/* shuffle, but never return the same order as the input (when possible) */
function scramble(arr) {
  if (arr.length < 2) return arr.slice();
  for (let i = 0; i < 20; i++) {
    const s = shuffle(arr);
    if (s.some((v, k) => v !== arr[k])) return s;
  }
  return arr.slice().reverse();
}

/* ---------- Sound (made with code, no files) ---------- */
const Snd = {
  ctx: null, on: true,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; }
  },
  tone(freq, dur = 0.15, type = 'sine', vol = 0.18, delay = 0) {
    if (!this.on || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },
  tap() { this.tone(520, 0.06, 'triangle', 0.1); },
  pop() { this.tone(700, 0.08, 'sine', 0.14); },
  ok() { [660, 880, 1320].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.16, i * 0.08)); },
  bad() { this.tone(220, 0.18, 'sine', 0.16); this.tone(180, 0.22, 'sine', 0.14, 0.1); },
  win() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.18, i * 0.13)); },
  star() { [880, 1175, 1568].forEach((f, i) => this.tone(f, 0.2, 'sine', 0.16, i * 0.07)); },
  lose() { [392, 330, 262].forEach((f, i) => this.tone(f, 0.3, 'sine', 0.15, i * 0.2)); },
};
document.addEventListener('pointerdown', () => Snd.init(), { passive: true });

/* ---------- Voice (reads text aloud) ---------- */
const Voice = {
  on: true, voice: null,
  pitch: { hero: 1.2, twinkle: 1.6, lumi: 1.35, pix: 0.95, nova: 1.15, mochi: 1.7, gloom: 0.6, glow: 1.4, grumble: 0.5, narr: 1.0 },
  load() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    const want = ['Samantha', 'Karen', 'Google US English', 'Microsoft Aria', 'Microsoft Zira', 'Moira', 'Tessa'];
    this.voice = want.map(n => vs.find(v => v.name.includes(n))).find(Boolean) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  },
  say(text, who) {
    if (!this.on || !window.speechSynthesis || !text) return;
    try {
      speechSynthesis.cancel();
      const clean = String(text)
        .replace(/<[^>]+>/g, ' ')
        .replace(/_{2,}/g, ' blank ')
        .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
        .replace(/\s+/g, ' ').trim();
      if (!clean) return;
      const u = new SpeechSynthesisUtterance(clean);
      if (!this.voice) this.load();
      if (this.voice) u.voice = this.voice;
      u.lang = 'en-US'; u.rate = 0.88; u.pitch = this.pitch[who] || 1.15;
      speechSynthesis.speak(u);
    } catch (e) { /* voice not available: the game still works */ }
  },
  stop() { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} },
};
if (window.speechSynthesis) { Voice.load(); speechSynthesis.onvoiceschanged = () => Voice.load(); }

/* ---------- Little effects ---------- */
function toast(msg, ms = 2600) {
  const t = document.getElementById('toast');
  t.innerHTML = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
function burst(el, emojis = ['⭐', '✨', '💖', '🌟']) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 10; i++) {
    const s = h('span', { class: 'spark', text: pick(emojis) });
    const ang = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
    s.style.left = cx + 'px'; s.style.top = cy + 'px';
    s.style.setProperty('--dx', Math.cos(ang) * d + 'px');
    s.style.setProperty('--dy', Math.sin(ang) * d + 'px');
    document.body.append(s);
    setTimeout(() => s.remove(), 900);
  }
}
function confetti(n = 40) {
  const em = ['⭐', '🌈', '💖', '❄️', '🎵', '🟩', '🌸', '✨'];
  for (let i = 0; i < n; i++) {
    const s = h('span', { class: 'confetti', text: pick(em) });
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * 0.8 + 's';
    s.style.fontSize = 16 + Math.random() * 22 + 'px';
    document.body.append(s);
    setTimeout(() => s.remove(), 3600);
  }
}
function lerpColor(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
