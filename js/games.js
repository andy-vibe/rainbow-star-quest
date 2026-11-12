/* Question makers (Gen) and question screens (Render).
   Every question is one of 4 kinds: choice, arrange, sort, build. */
'use strict';

const Gen = {};
const Render = {};

/* ---------- Pictures made of blocks ---------- */
/* n blocks: full tens are shown as tall rods, the rest as single cubes.
   crossed = how many blocks (from the end) are crossed out. */
function cubes(n, cls = 'c1', crossed = 0) {
  const tens = Math.floor(n / 10), ones = n % 10;
  let i = 0, out = '<div class="blocks">';
  const cube = () => `<i class="cube ${cls}${i++ >= n - crossed ? ' x' : ''}"></i>`;
  for (let t = 0; t < tens; t++) { out += '<div class="rod">'; for (let k = 0; k < 10; k++) out += cube(); out += '</div>'; }
  if (ones) { out += '<div class="ones">'; for (let k = 0; k < ones; k++) out += cube(); out += '</div>'; }
  return out + '</div>';
}
/* a frame with `total` cells, the first `a` are filled */
function frame(a, total) {
  let out = '<div class="frame">';
  for (let i = 0; i < total; i++) out += `<i class="cube ${i < a ? 'c1' : 'ghost'}"></i>`;
  return out + '</div>';
}
function emojis(e, n, faded = 0) {
  let out = '<div class="emojigrid">';
  for (let i = 0; i < n; i++) out += `<span class="${i >= n - faded ? 'faded' : ''}">${e}</span>`;
  return out + '</div>';
}
const eq = s => `<div class="eq">${s.replace('?', '<span class="qm">?</span>')}</div>`;

/* number answers with close wrong answers */
function numChoices(ans, k = 4) {
  const sw = ans >= 10 && ans < 100 ? (ans % 10) * 10 + Math.floor(ans / 10) : -1;
  let c = ans <= 20 ? [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3] : [ans + 1, ans - 1, ans + 10, ans - 10, sw, ans + 2, ans - 2, ans + 9];
  c = [...new Set(c)].filter(v => v >= 0 && v <= 110 && v !== ans);
  const opts = sample(c, k - 1).concat(ans).sort((a, b) => a - b);
  return opts.map(v => ({ label: String(v), correct: v === ans }));
}
const wordChoices = (right, wrongs) => shuffle([{ label: right, correct: true }, ...wrongs.map(w => ({ label: w }))]);

/* ================= WORDS ================= */
const VOWELS = 'aeiou';
const W = {
  spell(len, extra = 0) {
    const [w, e] = pick(WORDS[len]);
    const letters = w.split('');
    const others = sample('abcdeghiklmnoprstuw'.split('').filter(c => !letters.includes(c)), extra);
    return { key: w, subj: 'words', kind: 'arrange', mode: 'letters', prompt: 'Spell the word.', say: 'Spell the word: ' + w, hear: w,
      visual: `<div class="bigpic">${e}</div>`, answer: letters, tiles: scramble(letters.concat(others)).map(t => ({ t })), after: w };
  },
  missing(len) {
    const [w, e] = pick(WORDS[len]);
    const i = rand(0, w.length - 1), c = w[i];
    const pool = (VOWELS.includes(c) ? VOWELS : 'bcdfghklmnprstw').split('').filter(x => x !== c);
    const shown = w.split('').map((ch, k) => k === i ? '<span class="gap">_</span>' : ch).join('');
    return { key: w, subj: 'words', kind: 'choice', optClass: 'letters', prompt: 'Which letter is missing?',
      visual: `<div class="bigpic">${e}</div><div class="bigword">${shown}</div>`, options: wordChoices(c, sample(pool, 2)), after: w };
  },
  match(lens) {
    const pool = lens.flatMap(l => WORDS[l]);
    const seen = new Set(), opts = [];
    for (const p of shuffle(pool)) { if (!seen.has(p[1])) { seen.add(p[1]); opts.push(p); } if (opts.length === 4) break; }
    const [w] = opts[0];
    return { key: w, subj: 'words', kind: 'choice', optClass: 'pics', prompt: 'Read the word. Find the picture.',
      visual: `<div class="bigword">${w}</div>`, options: shuffle(opts.map((p, i) => ({ label: p[1], correct: i === 0 }))), after: w };
  },
  rhyme() {
    const fams = sample(RHYMES, 3);
    const [target, ans] = sample(fams[0], 2);
    return { key: 'r' + target, subj: 'words', kind: 'choice', prompt: `Which word rhymes with "${target}"?`,
      visual: `<div class="bigword">${target}</div><div class="hintline">Rhyming words end with the same sound.</div>`,
      options: wordChoices(ans, [pick(fams[1]), pick(fams[2])]), after: target + ', ' + ans };
  },
  opposite() {
    const [pair, ...rest] = shuffle(OPPOSITES);
    const near = new Set(SIMILAR.filter(g => g.some(w => pair.includes(w))).flat());   // "light" can not be a wrong answer for "night"
    const three = [pair, ...sample(rest.filter(p => !p.some(w => near.has(w))), 2)];
    const flip = Math.random() < 0.5;
    const a = three[0][flip ? 1 : 0], b = three[0][flip ? 0 : 1];
    return { key: 'o' + a, subj: 'words', kind: 'choice', prompt: `What is the opposite of "${a}"?`,
      visual: `<div class="bigword">${a}</div>`, options: wordChoices(b, [pick(three[1]), pick(three[2])]), after: `${a}, ${b}` };
  },
  compound() {
    const [a, b, e, w1, w2] = pick(COMPOUNDS);
    return { key: 'w' + a + b, subj: 'words', kind: 'choice', prompt: `Put two words together. "${a}" and what make this picture?`,
      visual: `<div class="bigpic">${e}</div><div class="bigword">${a} + <span class="gap">?</span></div><div class="hintline">Two small words can make one big word.</div>`,
      options: wordChoices(b, [w1, w2]), after: `${a} + ${b} = ${a}${b}` };
  },
};
Gen.words = tier => fill([
  [() => W.spell(3), () => W.match([3]), () => W.spell(3), () => W.missing(3), () => W.spell(3), () => W.match([3, 4]), () => W.spell(3), () => W.missing(3)],
  [() => W.spell(4), () => W.rhyme(), () => W.missing(4), () => W.spell(4, 1), () => W.match([4, 5]), () => W.rhyme(), () => W.spell(4, 1), () => W.spell(4, 1)],
  [() => W.spell(5), () => W.rhyme(), () => W.opposite(), () => W.spell(5, 1), () => W.missing(5), () => W.match([5, 6]), () => W.spell(5, 2), () => W.opposite()],
  [() => W.spell(6), () => W.opposite(), () => W.missing(6), () => W.spell(6, 1), () => W.rhyme(), () => W.spell(5, 2), () => W.spell(6, 2), () => W.match([6, 7])],
  [() => W.spell(7), () => W.opposite(), () => W.spell(6, 2), () => W.missing(7), () => W.spell(7, 1), () => W.rhyme(), () => W.spell(7, 2), () => W.spell(6, 2)],
  [() => W.spell(8), () => W.compound(), () => W.missing(8), () => W.spell(7, 2), () => W.opposite(), () => W.compound(), () => W.spell(8, 1), () => W.match([7, 8])],
][tier - 1]);

/* run each maker; try again if we already have the same question */
function fill(makers) {
  const used = new Set(), out = [];
  for (const mk of makers) {
    let q;
    for (let i = 0; i < 12; i++) { q = mk(); if (!q.key || !used.has(q.key)) break; }
    if (q.key) used.add(q.key);
    out.push(q);
  }
  return out;
}

/* ================= SENTENCES ================= */
const S_ = {
  order(tier) {
    const [s, e] = pick(SENT_ORDER[tier]);
    const words = s.split(' ');
    return { key: s, subj: 'sentences', kind: 'arrange', mode: 'words', prompt: 'Put the words in order.', hear: s,
      visual: `<div class="bigpic small">${e}</div><div class="hintline">A sentence starts with a BIG letter and ends with a mark like . or ?</div>`,
      answer: words, tiles: scramble(words).map(t => ({ t })), after: s };
  },
  blank(group) {
    const [s, right, w1, w2] = pick(SENT_BLANK[group]);
    return { key: s, subj: 'sentences', kind: 'choice', prompt: 'Pick the word that fits.',
      visual: `<div class="sentence">${esc(s).replace('___', '<span class="gap">____</span>')}</div>`,
      options: wordChoices(right, [w1, w2]), after: s.replace('___', right) };
  },
  punct() {
    const [s, mark] = pick(SENT_PUNCT);
    const fact = { '?': 'We ask something, so we use a question mark.', '.': 'We tell something, so we use a full stop.', '!': 'We feel something strong, so we use an exclamation mark.' }[mark];
    return { key: s, subj: 'sentences', kind: 'choice', optClass: 'letters', prompt: 'Which mark goes at the end?',
      visual: `<div class="sentence">${esc(s)}<span class="gap">_</span></div>`,
      options: ['.', '?', '!'].map(m => ({ label: m, correct: m === mark })), fact, after: s + mark };
  },
  picture() {
    const three = sample(SENT_PICTURE, 3);
    return { key: three[0][1], subj: 'sentences', kind: 'choice', optClass: 'long', prompt: 'Which sentence matches the picture?',
      visual: `<div class="bigpic">${three[0][0]}</div>`, options: shuffle(three.map((p, i) => ({ label: p[1], correct: i === 0 }))), after: three[0][1] };
  },
};
Gen.sentences = tier => fill([
  [() => S_.picture(), () => S_.order(1), () => S_.blank('easy'), () => S_.order(1), () => S_.picture(), () => S_.order(1), () => S_.blank('easy')],
  [() => S_.order(2), () => S_.blank('easy'), () => S_.picture(), () => S_.order(2), () => S_.blank('mid'), () => S_.order(2), () => S_.order(2)],
  [() => S_.order(3), () => S_.blank('mid'), () => S_.punct(), () => S_.order(3), () => S_.blank('mid'), () => S_.punct(), () => S_.order(3)],
  [() => S_.order(4), () => S_.blank('hard'), () => S_.punct(), () => S_.order(4), () => S_.blank('mid'), () => S_.order(4), () => S_.blank('hard')],
  [() => S_.order(5), () => S_.blank('hard'), () => S_.order(5), () => S_.punct(), () => S_.blank('hard'), () => S_.order(5), () => S_.order(5)],
  [() => S_.order(6), () => S_.blank('top'), () => S_.punct(), () => S_.order(6), () => S_.blank('top'), () => S_.order(6), () => S_.blank('hard')],
][tier - 1]);

/* ================= MATH ================= */
const THINGS = [['🍪', 'cookies'], ['⭐', 'stars'], ['🧊', 'ice blocks'], ['🎈', 'balloons'], ['🐟', 'fish'], ['💎', 'gems'], ['🌸', 'flowers'], ['🧱', 'bricks']];
const NAMES = ['Lumi', 'Pix', 'Nova', 'Mochi', 'Sora'];
const M = {
  count(max) {
    const n = rand(Math.max(3, max - 9), max), e = pick(THINGS)[0];
    return { key: 'c' + n, subj: 'math', kind: 'choice', optClass: 'nums', prompt: 'How many? Count them.', visual: emojis(e, n), options: numChoices(n, 3) };
  },
  add(a, b) {
    return { key: `${a}+${b}`, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `What is ${a} plus ${b}?`,
      visual: `<div class="eqvis">${cubes(a, 'c1')}<b>+</b>${cubes(b, 'c2')}</div>${eq(`${a} + ${b} = ?`)}`, options: numChoices(a + b) };
  },
  sub(a, b) {
    return { key: `${a}-${b}`, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `What is ${a} take away ${b}?`,
      visual: `<div class="eqvis">${cubes(a, 'c1', b)}</div>${eq(`${a} − ${b} = ?`)}<div class="hintline">The crossed blocks are taken away.</div>`, options: numChoices(a - b) };
  },
  compare(max) {
    const a = rand(1, max); let b = rand(1, max); while (b === a) b = rand(1, max);
    return { key: `m${a}${b}`, subj: 'math', kind: 'choice', optClass: 'piles', prompt: 'Which one has more?', visual: '',
      options: [{ html: cubes(a, 'c1'), correct: a > b }, { html: cubes(b, 'c2'), correct: b > a }] };
  },
  cmpSym() {
    const a = rand(11, 99); let b = Math.random() < 0.15 ? a : rand(11, 99);
    const right = a < b ? '<' : a > b ? '>' : '=';
    const opt = (s, word) => ({ html: `<b>${esc(s)}</b><small>${word}</small>`, correct: s === right });
    return { key: `s${a}${b}`, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `Which sign goes between ${a} and ${b}?`, say: `Is ${a} smaller than ${b}, the same as ${b}, or bigger than ${b}?`,
      visual: `<div class="eqvis"><div class="col">${cubes(a, 'c1')}<div class="eq">${a}</div></div><b class="qm">?</b><div class="col">${cubes(b, 'c2')}<div class="eq">${b}</div></div></div>`,
      options: [opt('<', 'smaller'), opt('=', 'the same'), opt('>', 'bigger')] };
  },
  pattern() {
    const set = sample(['🔴', '🔵', '🟡', '🟢', '⭐', '❄️', '🌸', '🟪', '🎵', '🐱'], 3);
    const unit = pick([[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 1, 0, 2]]);
    const len = unit.length * 2 + rand(1, unit.length);
    const seq = Array.from({ length: len + 1 }, (_, i) => set[unit[i % unit.length]]);
    const ans = seq.pop();
    const used = [...new Set(unit)].map(i => set[i]);
    const opts = used.length < 3 ? used.concat(set.find(s => !used.includes(s))) : used;
    return { key: 'p' + seq.join(''), subj: 'math', kind: 'choice', optClass: 'pics', prompt: 'Look at the pattern. What comes next?',
      visual: `<div class="pattern">${seq.map(s => `<span>${s}</span>`).join('')}<span class="qm">?</span></div>`,
      options: shuffle(opts.map(o => ({ label: o, correct: o === ans }))) };
  },
  bond() {
    const a = rand(1, 9);
    return { key: 'b' + a, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `${a} plus what makes 10?`,
      visual: `${frame(a, 10)}${eq(`${a} + ? = 10`)}<div class="hintline">Count the empty boxes.</div>`, options: numChoices(10 - a) };
  },
  skip(step, max = 100) {
    const down = step < 0, s = Math.abs(step);
    const start = down ? s * rand(6, Math.floor(max / s)) : s * rand(1, Math.max(1, Math.floor((max - 5 * s) / s)));
    const seq = [0, 1, 2, 3].map(i => start + i * step), ans = start + 4 * step;
    return { key: 'k' + seq.join(), subj: 'math', kind: 'choice', optClass: 'nums', prompt: down ? `Count back by ${s}s. What comes next?` : `Count by ${s}s. What comes next?`,
      visual: `<div class="seq">${seq.map(v => `<span>${v}</span>`).join('')}<span class="qm">?</span></div>`, options: numChoices(ans) };
  },
  word(max, forceOp) {
    const [e, thing] = pick(THINGS), who = pick(NAMES), isAdd = forceOp ? forceOp === '+' : Math.random() < 0.5;
    let a, b, text, vis;
    if (isAdd) {
      a = rand(2, max - 2); b = rand(1, Math.min(max - a, max / 2));
      text = `${who} has ${a} ${thing}. Then ${who} gets ${b} more. How many ${thing} now?`;
      vis = max <= 20 ? `<div class="eqvis">${emojis(e, a)}<b>+</b>${emojis(e, b)}</div>` : `<div class="eqvis">${cubes(a, 'c1')}<b>+</b>${cubes(b, 'c2')}</div>`;
    } else {
      a = rand(4, max); b = rand(1, a - 1);
      text = `${who} has ${a} ${thing}. ${who} gives away ${b}. How many ${thing} are left?`;
      vis = max <= 20 ? `<div class="eqvis">${emojis(e, a, b)}</div>` : `<div class="eqvis">${cubes(a, 'c1', b)}</div>`;
    }
    const ans = isAdd ? a + b : a - b;
    return { key: text, subj: 'math', kind: 'choice', optClass: 'nums', prompt: text, visual: `<div class="bigpic small">${e}</div>${vis}`, options: numChoices(ans) };
  },
  readNum() {
    const n = rand(11, 99);
    return { key: 'n' + n, subj: 'math', kind: 'choice', optClass: 'nums', prompt: 'What number is this?',
      visual: `<div class="eqvis">${cubes(n, 'c1')}</div><div class="hintline">A tall stick is 10. A small cube is 1.</div>`, options: numChoices(n) };
  },
  build(n) {
    return { key: 'B' + n, subj: 'math', kind: 'build', prompt: `Build the number ${n} with blocks.`, visual: eq(String(n)), answer: n };
  },
  buildSum(a, b) {
    return { key: `B${a}+${b}`, subj: 'math', kind: 'build', prompt: `What is ${a} plus ${b}? Build the answer.`,
      visual: `<div class="eqvis small">${cubes(a, 'c1')}<b>+</b>${cubes(b, 'c2')}</div>${eq(`${a} + ${b} = ?`)}`, answer: a + b };
  },
  missing() {
    const a = rand(10, 60), c = a + rand(3, Math.min(30, 100 - a));
    return { key: `${a}?${c}`, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `${a} plus what makes ${c}?`,
      visual: `<div class="eqvis">${cubes(a, 'c1')}<b>+</b><b class="qm">?</b><b>=</b>${cubes(c, 'c3')}</div>${eq(`${a} + ? = ${c}`)}`, options: numChoices(c - a) };
  },
  /* equal groups: the first step to times tables */
  groups() {
    const g = rand(2, 5), n = rand(2, 5), [e, thing] = pick(THINGS);
    return { key: `g${g}x${n}`, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `${g} groups of ${n} ${thing}. How many in all?`,
      visual: `<div class="groups">${Array.from({ length: g }, () => emojis(e, n)).join('')}</div>${eq(Array(g).fill(n).join(' + ') + ' = ?')}`,
      options: numChoices(g * n), after: `${g} groups of ${n} make ${g * n}.` };
  },
  double() {
    const a = rand(6, 25);
    return Object.assign(M.add(a, a), { key: 'd' + a, prompt: `What is double ${a}? Double means two times the same number.` });
  },
  half() {
    const n = rand(2, 10) * 2, [e, thing] = pick(THINGS);
    return { key: 'h' + n, subj: 'math', kind: 'choice', optClass: 'nums', prompt: `Share ${n} ${thing} fairly between 2 friends. How many does each friend get?`,
      visual: emojis(e, n) + '<div class="hintline">Fair means both friends get the same.</div>', options: numChoices(n / 2), after: `Half of ${n} is ${n / 2}.` };
  },
  /* number makers */
  add10: () => { const a = rand(1, 8); return M.add(a, rand(1, 10 - a)); },
  sub10: () => { const a = rand(3, 10); return M.sub(a, rand(1, a - 1)); },
  add20: () => { const a = rand(4, 14); return M.add(a, rand(2, Math.min(9, 20 - a))); },
  sub20: () => { const a = rand(8, 20); return M.sub(a, rand(2, Math.min(9, a - 1))); },
  addTens: () => { const a = rand(1, 8) * 10; return M.add(a, rand(1, 9 - a / 10) * 10); },
  subTens: () => { const a = rand(3, 10) * 10; return M.sub(a, rand(1, a / 10 - 1) * 10); },
  add2d1d: () => { const o = rand(0, 7), a = rand(1, 8) * 10 + o; return M.add(a, rand(1, 9 - o)); },
  sub2d1d: () => { const o = rand(2, 9), a = rand(1, 9) * 10 + o; return M.sub(a, rand(1, o)); },
  add2d2d: () => { const t1 = rand(1, 7), o1 = rand(1, 8), t2 = rand(1, 8 - t1), o2 = rand(1, 9 - o1); return M.add(t1 * 10 + o1, t2 * 10 + o2); },
  add2d1dR: () => { const o = rand(3, 9), a = rand(1, 8) * 10 + o; return M.add(a, rand(11 - o, 9)); },
  sub2d1dR: () => { const o = rand(0, 7), a = rand(2, 9) * 10 + o; return M.sub(a, rand(o + 1, 9)); },
  add2d2dR: () => { const o1 = rand(3, 9), o2 = rand(10 - o1, 9), t1 = rand(1, 6), t2 = rand(1, 8 - t1); return M.add(t1 * 10 + o1, t2 * 10 + o2); },
  sub2d2d: () => { const a = rand(35, 99); return M.sub(a, rand(11, a - 10)); },
  sub2d2dR: () => { const o1 = rand(0, 7), o2 = rand(o1 + 1, 9), t1 = rand(3, 9), t2 = rand(1, t1 - 1); return M.sub(t1 * 10 + o1, t2 * 10 + o2); },
};
Gen.math = tier => fill([
  [() => M.count(10), () => M.add10(), () => M.count(20), () => M.add10(), () => M.pattern(), () => M.sub10(), () => M.compare(9), () => M.sub10()],   // compare: 10 would be drawn as a ten-stick, taught later
  [() => M.add20(), () => M.bond(), () => M.sub20(), () => M.skip(pick([2, 5, 10]), 50), () => M.word(20, '+'), () => M.pattern(), () => M.word(20, '-'), () => M.add20()],
  [() => M.readNum(), () => M.build(rand(12, 79)), () => M.addTens(), () => M.add2d1d(), () => M.sub2d1d(), () => M.cmpSym(), () => M.skip(pick([5, 10])), () => M.word(50)],
  [() => M.add2d2d(), () => M.add2d1dR(), () => M.sub2d1dR(), () => M.subTens(), () => { const o = rand(0, 6), a = rand(2, 7) * 10 + o; return M.buildSum(a, rand(1, 9 - o)); }, () => M.word(50), () => M.add2d2d(), () => M.cmpSym()],
  [() => M.add2d2dR(), () => M.sub2d2d(), () => M.missing(), () => M.word(100), () => { const t1 = rand(1, 5), o1 = rand(1, 7); return M.buildSum(t1 * 10 + o1, rand(1, 8 - t1) * 10 + rand(1, 9 - o1)); }, () => M.add2d2dR(), () => M.sub2d2d(), () => M.skip(pick([-10, -5, -2]))],
  [() => M.groups(), () => M.add2d2dR(), () => M.double(), () => M.sub2d2dR(), () => M.half(), () => M.groups(), () => M.skip(pick([3, 4]), 40), () => M.word(100)],
][tier - 1]);

/* ================= SCIENCE ================= */
const Sci = {
  sort(set) {
    let items;
    for (let i = 0; i < 20; i++) { items = sample(set.items, 6); if (new Set(items.map(x => x[2])).size === set.bins.length) break; }
    return { key: set.q, subj: 'science', kind: 'sort', prompt: set.q, bins: set.bins, items };
  },
  order(set) {
    const tiles = set.steps.map(([e, name]) => ({ t: name, html: `<span class="em">${e}</span><small>${esc(name)}</small>` }));
    return { key: set.q, subj: 'science', kind: 'arrange', mode: 'cards', prompt: set.q, visual: '', answer: set.steps.map(s => s[1]), tiles: scramble(tiles) };
  },
  quiz(row) {
    const [q, right, w1, w2, fact] = row;
    return { key: q, subj: 'science', kind: 'choice', optClass: 'mid', prompt: q, visual: '<div class="bigpic small">🔬</div>', options: wordChoices(right, [w1, w2]), fact };
  },
};
Gen.science = tier => {
  const sorts = sample(SCI_SORT.filter(s => s.tier === tier), 2).map(Sci.sort);
  const order = Sci.order(pick(SCI_ORDER.filter(s => s.tier === tier)));
  const quiz = sample(SCI_QUIZ[tier], 4).map(Sci.quiz);
  return [quiz[0], sorts[0], quiz[1], order, quiz[2], sorts[1], quiz[3]];
};

/* ================= BOSS: a mix of everything ================= */
Gen.boss = tier => {
  const w = shuffle(Gen.words(tier)), m = shuffle(Gen.math(tier)), s = shuffle(Gen.sentences(tier));
  const q = sample(SCI_QUIZ[tier], 2).map(Sci.quiz);
  return [w[0], m[0], s[0], q[0], m[1], w[1], s[1], m[2], q[1], m[3]];
};

/* ================================================================
   Question screens. Each one draws into `host` and calls
   done(numberOfWrongTries) when the child gets it right.
   ================================================================ */
Render.choice = (q, host, done, miss) => {
  let wrong = 0, locked = false;
  const grid = h('div', { class: 'opts ' + (q.optClass || '') });
  q.options.forEach(o => {
    const b = h('button', { class: 'opt', html: o.html || esc(o.label) });
    b.onclick = () => {
      if (locked || b.disabled) return;
      if (o.correct) { locked = true; b.classList.add('right'); Snd.ok(); burst(b); done(wrong); }
      else { wrong++; miss(); b.classList.add('wrong'); b.disabled = true; Snd.bad(); }
    };
    grid.append(b);
  });
  host.append(grid);
};

Render.arrange = (q, host, done, miss) => {
  const n = q.answer.length;
  let wrong = 0, locked = false;
  const slots = new Array(n).fill(null), fixed = new Array(n).fill(false), used = q.tiles.map(() => false);
  const slotsEl = h('div', { class: 'slots ' + q.mode }), poolEl = h('div', { class: 'pool ' + q.mode });
  const face = t => t.html || esc(t.t);
  function draw() {
    slotsEl.innerHTML = ''; poolEl.innerHTML = '';
    slots.forEach((ti, i) => {
      const s = h('button', { class: 'slot' + (ti != null ? ' filled' : '') + (fixed[i] ? ' good' : ''), html: ti != null ? face(q.tiles[ti]) : '' });
      s.onclick = () => { if (locked || ti == null || fixed[i]) return; used[ti] = false; slots[i] = null; Snd.tap(); draw(); };
      slotsEl.append(s);
    });
    q.tiles.forEach((t, ti) => {
      const b = h('button', { class: 'tile' + (used[ti] ? ' used' : ''), html: face(t) });
      b.onclick = () => {
        if (locked || used[ti]) return;
        const i = slots.indexOf(null); if (i < 0) return;
        slots[i] = ti; used[ti] = true; Snd.tap(); draw();
        if (!slots.includes(null)) check();
      };
      poolEl.append(b);
    });
  }
  function check() {
    const bad = [];
    slots.forEach((ti, i) => { if (q.tiles[ti].t !== q.answer[i]) bad.push(i); });
    if (!bad.length) { locked = true; slotsEl.classList.add('right'); Snd.ok(); burst(slotsEl); done(wrong); return; }
    wrong++; miss(); locked = true; Snd.bad();
    [...slotsEl.children].forEach((el, i) => el.classList.add(bad.includes(i) ? 'wrong' : 'good'));
    setTimeout(() => {
      bad.forEach(i => { used[slots[i]] = false; slots[i] = null; });
      slots.forEach((ti, i) => { if (ti != null) fixed[i] = true; });
      if (wrong >= 2) {            // after two tries, help with the next piece
        const i = slots.indexOf(null);
        const ti = q.tiles.findIndex((t, k) => !used[k] && t.t === q.answer[i]);
        if (ti >= 0) { slots[i] = ti; used[ti] = true; fixed[i] = true; }
      }
      locked = false; draw();
      if (!slots.includes(null)) check();
    }, 850);
  }
  draw();
  host.append(slotsEl, poolEl);
};

Render.sort = (q, host, done, miss) => {
  let wrong = 0, i = 0, locked = false;
  const card = h('div', { class: 'sortcard' });
  const left = h('div', { class: 'sortleft' });
  const bins = h('div', { class: 'bins n' + q.bins.length });
  const binEls = q.bins.map((label, bi) => {
    const got = h('div', { class: 'got' });
    const b = h('button', { class: 'bin' }, h('div', { class: 'binlabel', text: label }), got);
    b.onclick = () => {
      if (locked) return;
      const it = q.items[i];
      if (it[2] === bi) {
        Snd.pop(); got.append(h('span', { text: it[0], title: it[1] }));
        if (it[3]) { toast('💡 ' + esc(it[3]), 4200); Voice.say(it[3], 'mochi'); }
        i++;
        if (i >= q.items.length) { locked = true; card.innerHTML = '<div class="em">🎉</div>'; Snd.ok(); burst(card); done(wrong); }
        else show(!it[3]);
      } else { wrong++; miss(); Snd.bad(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
    };
    bins.append(b);
    return b;
  });
  function show(sayIt = true) {
    const it = q.items[i];
    card.innerHTML = `<div class="em">${it[0]}</div><div class="nm">${esc(it[1])}</div>`;
    card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
    left.textContent = `${i + 1} of ${q.items.length}`;
    if (sayIt) Voice.say(it[1], 'mochi');
  }
  host.append(card, left, bins);  card.innerHTML = `<div class="em">${q.items[0][0]}</div><div class="nm">${esc(q.items[0][1])}</div>`;
  left.textContent = `1 of ${q.items.length}`;
};

Render.build = (q, host, done, miss) => {
  let v = 0, wrong = 0, fin = false;
  const vis = h('div', { class: 'buildvis' }), num = h('div', { class: 'buildnum' }), msg = h('div', { class: 'buildmsg' });
  const draw = () => {
    vis.innerHTML = v ? cubes(v, 'c3') : '<span class="empty">Tap the buttons to add blocks.</span>';
    num.textContent = v;
  };
  const btn = (label, d, cls) => h('button', { class: 'bbtn ' + cls, html: label, onclick: () => { if (fin) return; v = clamp(v + d, 0, 100); Snd.tap(); msg.textContent = ''; draw(); } });
  const check = h('button', { class: 'btn big', text: 'Check ✔', onclick: () => {
    if (fin) return;
    if (v === q.answer) { fin = true; Snd.ok(); burst(num); done(wrong); }
    else {
      wrong++; miss(); Snd.bad();
      msg.textContent = v < q.answer ? 'Not enough blocks. Add more!' : 'Too many blocks. Take some away!';
      Voice.say(msg.textContent, 'pix');
      num.classList.remove('shake'); void num.offsetWidth; num.classList.add('shake');
    }
  } });
  draw();
  host.append(
    h('div', { class: 'buildrow' }, vis, num),
    h('div', { class: 'buildbtns' }, btn('−10', -10, 'minus'), btn('−1', -1, 'minus'), btn('+1', 1, 'plus'), btn('+10', 10, 'plus')),
    msg, check);
};
