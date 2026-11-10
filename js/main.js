/* The main game: saving, screens, map, story, levels and rewards. */
'use strict';

const SAVE_KEY = 'rainbow-star-quest-v1';
const root = document.getElementById('app');

const App = {
  S: null,
  fresh() {
    return { v: 1, hero: null, progress: {}, xp: 0, gems: 0, owned: [], seen: {}, creations: {},
      stats: { words: { c: 0, t: 0 }, math: { c: 0, t: 0 }, sentences: { c: 0, t: 0 }, science: { c: 0, t: 0 } },
      settings: { sfx: true, voice: true, boost: 0, unlockAll: false } };
  },
  load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) {}
    const f = this.fresh();
    this.S = s && s.v === 1 ? Object.assign(f, s, { settings: Object.assign(f.settings, s.settings), stats: Object.assign(f.stats, s.stats) }) : f;
    Snd.on = this.S.settings.sfx; Voice.on = this.S.settings.voice;
  },
  save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.S)); } catch (e) {} },
  screen(cls, ...kids) {
    Voice.stop();
    root.className = 'screen ' + cls;
    root.replaceChildren(...kids.flat().filter(Boolean));
    root.scrollTop = 0;
  },
};
App.load();
const S = () => App.S;

/* ---------- progress helpers ---------- */
const lid = (w, l) => w + '-' + l;
const starsOf = (w, l) => S().progress[lid(w, l)] || 0;
const worldDone = w => starsOf(w, WORLDS[w].levels.length - 1) > 0;
const worldOpen = w => S().settings.unlockAll || w === 0 || worldDone(w - 1);
const levelOpen = (w, l) => S().settings.unlockAll || (worldOpen(w) && (l === 0 || starsOf(w, l - 1) > 0));
const worldStars = w => WORLDS[w].levels.reduce((n, _, l) => n + starsOf(w, l), 0);
const totalStars = () => WORLDS.reduce((n, _, w) => n + worldStars(w), 0);
const heroLevel = () => Math.min(HERO_TITLES.length, Math.floor(S().xp / 90) + 1);
const friendStage = id => { const f = FRIENDS.find(x => x.id === id); return f && worldDone(f.world) ? 2 : 1; };
const say = t => t.replace(/\{name\}/g, S().hero ? S().hero.name : 'friend');

/* ---------- the cast ---------- */
const CAST = {
  hero: { name: () => S().hero.name, draw: m => Art.chibi(Object.assign({}, S().hero, { mood: m })) },
  twinkle: { name: () => 'Twinkle', draw: m => Art.twinkle(m) },
  lumi: { name: () => 'Lumi', draw: m => Art.lumi(friendStage('lumi'), m) },
  pix: { name: () => 'Pix', draw: m => Art.pix(friendStage('pix'), m) },
  nova: { name: () => 'Nova', draw: m => Art.nova(friendStage('nova'), m) },
  mochi: { name: () => 'Mochi', draw: m => Art.mochi(friendStage('mochi'), m) },
  gloom: { name: () => 'Gloom', draw: () => Art.gloom({ mood: 0 }) },
  glow: { name: () => 'Glow', draw: () => Art.gloom({ mood: 1 }) },
  grumble: { name: () => 'King Grumble', draw: () => Art.gloom({ mood: worldDone(4) ? 1 : 0.1, king: true }) },
  narr: { name: () => '', draw: () => Art.narr() },
};
const draw = (who, mood = 'happy') => CAST[who].draw(mood);

function floaters(list) {
  const box = h('div', { class: 'floaters' });
  for (let i = 0; i < 12; i++) {
    box.append(h('span', { text: list[i % list.length], style: { left: Math.random() * 96 + '%', animationDelay: -Math.random() * 14 + 's', animationDuration: 10 + Math.random() * 10 + 's', fontSize: 18 + Math.random() * 26 + 'px' } }));
  }
  return box;
}
const backBtn = fn => h('button', { class: 'iconbtn', text: '←', onclick: () => { Snd.tap(); fn(); } });

/* =============== TITLE =============== */
function titleScreen() {
  const hero = S().hero;
  App.screen('title bg-map',
    floaters(['⭐', '✨', '🌈', '❄️', '🎵', '🌸']),
    h('div', { class: 'logo' }, h('div', { class: 'logostar', text: '🌈⭐' }), h('h1', { text: 'Rainbow Star Quest' }),
      h('p', { text: hero ? `${hero.name}'s big adventure` : 'A learning adventure' })),
    h('div', { class: 'castrow' },
      h('div', { html: Art.lumi(1) }), h('div', { html: Art.pix(1) }),
      h('div', { class: 'mid', html: hero ? draw('hero') : Art.twinkle() }),
      h('div', { html: Art.nova(1) }), h('div', { html: Art.mochi(1) })),
    h('button', { class: 'btn huge', text: hero ? '▶ Play' : '▶ Start', onclick: () => { Snd.win(); hero ? mapScreen() : heroMaker(true); } }),
    h('button', { class: 'linkbtn', text: '⚙️ For parents', onclick: parentGate }));
}

/* =============== HERO MAKER =============== */
const LOOKS = {
  skin: ['#ffe0c8', '#f6cfa6', '#e0a878', '#a86b45'],
  hair: ['#2b2b3a', '#5b3a29', '#b5651d', '#f2c94c', '#ff7eb6', '#8e6bff', '#22c7b8'],
  style: ['long', 'bob', 'buns', 'twin', 'pony'],
  dress: ['#ff7eb6', '#8e6bff', '#4aa8ff', '#3ecf8e', '#ffb347', '#ef5350'],
};
function lookPickers(hero, redraw) {
  const rowOf = (title, key, isColor) => {
    const chips = h('div', { class: 'chips' });
    LOOKS[key].forEach(v => {
      const b = h('button', isColor ? { class: 'dot' + (hero[key] === v ? ' sel' : ''), style: { background: v } } : { class: 'chip' + (hero[key] === v ? ' sel' : ''), text: cap(v) });
      b.onclick = () => { hero[key] = v; [...chips.children].forEach(x => x.classList.remove('sel')); b.classList.add('sel'); Snd.pop(); redraw(); };
      chips.append(b);
    });
    return h('div', { class: 'pickrow' }, h('h4', { text: title }), chips);
  };
  return [rowOf('Hair style', 'style'), rowOf('Hair color', 'hair', true), rowOf('Dress color', 'dress', true), rowOf('Skin', 'skin', true)];
}
function heroMaker(first) {
  const hero = S().hero ? Object.assign({}, S().hero) : { name: '', skin: LOOKS.skin[0], hair: LOOKS.hair[1], style: 'long', dress: LOOKS.dress[0], trim: '#ffffff', head: null, back: null, hand: null };
  const prev = h('div', { class: 'heroprev' });
  const redraw = () => { prev.innerHTML = Art.chibi(hero); };
  const nameIn = h('input', { class: 'nameinput', maxlength: 12, placeholder: 'Your name', value: hero.name });
  const go = h('button', { class: 'btn big', text: first ? 'Start the adventure ▶' : 'Save ✔' });
  go.onclick = () => {
    hero.name = nameIn.value.trim();
    if (!hero.name) { toast('Type your name first 🙂'); nameIn.focus(); return; }
    S().hero = hero; App.save(); Snd.win();
    if (first) playScene('intro', 'bg-map', mapScreen); else mapScreen();
  };
  redraw();
  App.screen('maker bg-map',
    h('div', { class: 'topbar' }, first ? h('span') : backBtn(mapScreen), h('h2', { text: 'Make your hero' }), h('span')),
    h('div', { class: 'makerbody' },
      h('div', { class: 'makerleft' }, prev, nameIn),
      h('div', { class: 'picks' }, lookPickers(hero, redraw), go)));
}

/* =============== STORY SCENES =============== */
function playScene(id, bg, done) {
  const lines = STORY[id];
  if (!lines) return done();
  S().seen[id] = true; App.save();
  let i = 0;
  const face = h('div', { class: 'sceneface' }), nameEl = h('div', { class: 'scenename' }), textEl = h('div', { class: 'scenetext' });
  const show = () => {
    const [who, text, mood] = lines[i];
    face.innerHTML = draw(who, mood || 'happy');
    face.className = 'sceneface pop ' + who;
    nameEl.textContent = CAST[who].name(); nameEl.style.display = CAST[who].name() ? '' : 'none';
    textEl.textContent = say(text);
    Voice.say(say(text), who);
  };
  const next = () => { Snd.tap(); i++; if (i >= lines.length) { Voice.stop(); done(); } else show(); };
  App.screen('scene ' + bg,
    floaters(['✨', '⭐']),
    h('button', { class: 'linkbtn skip', text: 'Skip ⏭', onclick: () => { Voice.stop(); done(); } }),
    h('div', { class: 'scenebox' }, face,
      h('div', { class: 'bubble', onclick: next }, nameEl, textEl,
        h('div', { class: 'bubblebtns' },
          h('button', { class: 'iconbtn small', text: '🔊', onclick: e => { e.stopPropagation(); Voice.say(say(lines[i][1]), lines[i][0]); } }),
          h('button', { class: 'btn', text: 'Next ▶' })))));
  show();
}

/* =============== MAP (all worlds) =============== */
function heroChip() {
  const lv = heroLevel(), into = S().xp % 90;
  return h('button', { class: 'herochip', onclick: wardrobe },
    h('div', { class: 'mini', html: draw('hero') }),
    h('div', {}, h('b', { text: S().hero.name }), h('small', { text: `Level ${lv} · ${HERO_TITLES[lv - 1]}` }),
      h('div', { class: 'xpbar' }, h('i', { style: { width: (lv >= HERO_TITLES.length ? 100 : into / 90 * 100) + '%' } }))));
}
function mapScreen() {
  const cards = WORLDS.map((Wd, w) => {
    const open = worldOpen(w);
    return h('button', { class: 'worldcard bg-' + Wd.id + (open ? '' : ' locked') + (worldDone(w) ? ' done' : ''), onclick: () => { if (!open) { Snd.bad(); return toast(`🔒 Finish ${WORLDS[w - 1].name} first.`); } Snd.tap(); worldScreen(w); } },
      h('div', { class: 'wemoji', text: open ? Wd.emoji : '🔒' }),
      h('div', { class: 'whost', html: open ? draw(Wd.host) : '' }),
      h('b', { text: Wd.name }),
      h('small', { text: open ? `⭐ ${worldStars(w)} / ${Wd.levels.length * 3}` : 'Locked' }),
      worldDone(w) ? h('div', { class: 'shard', text: '💠' }) : null);
  });
  App.screen('map bg-map',
    floaters(['⭐', '✨', '☁️']),
    h('div', { class: 'topbar' }, heroChip(),
      h('div', { class: 'counts' }, h('span', { text: '⭐ ' + totalStars() }), h('span', { text: '💎 ' + S().gems }), h('span', { text: '💠 ' + WORLDS.filter((_, w) => worldDone(w)).length + '/5' })),
      h('div', { class: 'navbtns' },
        h('button', { class: 'navbtn', html: '👗<small>Dress up</small>', onclick: wardrobe }),
        h('button', { class: 'navbtn', html: '🎨<small>Studio</small>', onclick: studio }),
        h('button', { class: 'navbtn', html: '💖<small>Friends</small>', onclick: friendsScreen }),
        h('button', { class: 'navbtn', html: '🏠<small>Home</small>', onclick: titleScreen }))),
    h('h2', { class: 'maptitle', text: 'Where do you want to go?' }),
    h('div', { class: 'worlds' }, cards));
}

/* =============== ONE WORLD =============== */
function worldScreen(w) {
  const Wd = WORLDS[w];
  if (!S().seen[Wd.id + '-in']) return playScene(Wd.id + '-in', 'bg-' + Wd.id, () => worldScreen(w));
  const firstNew = Wd.levels.findIndex((_, l) => levelOpen(w, l) && !starsOf(w, l));
  const nodes = Wd.levels.map((L, l) => {
    const open = levelOpen(w, l), st = starsOf(w, l);
    return h('button', { class: 'node ' + L.t + (open ? '' : ' locked') + (l === firstNew ? ' now' : ''), onclick: () => { if (!open) { Snd.bad(); return toast('🔒 Finish the level before this one.'); } Snd.tap(); levelCard(w, l); } },
      h('div', { class: 'nodeicon', text: open ? L.icon : '🔒' }),
      h('b', { text: L.name }),
      h('div', { class: 'nstars', text: '⭐'.repeat(st) + '☆'.repeat(3 - st) }));
  });
  App.screen('world bg-' + Wd.id,
    floaters(Wd.float),
    h('div', { class: 'topbar' }, backBtn(mapScreen), h('h2', { text: `${Wd.emoji} ${Wd.name}` }), h('div', { class: 'counts' }, h('span', { text: `⭐ ${worldStars(w)} / ${Wd.levels.length * 3}` }))),
    h('div', { class: 'path' }, nodes),
    h('div', { class: 'worldhost', html: draw(Wd.host) }));
}
function levelCard(w, l) {
  const Wd = WORLDS[w], L = Wd.levels[l];
  const kind = { words: 'Words', math: 'Math', sentences: 'Sentences', science: 'Science', creative: 'Create', boss: 'Big challenge' }[L.t];
  const close = () => ov.remove();
  const ov = h('div', { class: 'overlay', onclick: e => { if (e.target === ov) close(); } },
    h('div', { class: 'card levelcard' },
      h('div', { class: 'cardhost', html: draw(Wd.host) }),
      h('div', {},
        h('small', { class: 'tag ' + L.t, text: kind }),
        h('h2', { text: `${L.icon} ${L.name}` }),
        h('p', { text: L.intro }),
        h('div', { class: 'row' },
          h('button', { class: 'btn ghost', text: 'Back', onclick: close }),
          h('button', { class: 'btn big', text: 'Go! ▶', onclick: () => { close(); startLevel(w, l); } })))));
  root.append(ov);
  Voice.say(L.intro, Wd.host);
}
function startLevel(w, l) {
  const Wd = WORLDS[w], L = Wd.levels[l];
  Snd.star();
  if (L.t === 'creative') return Creative.open(L.tool, { prompt: L.prompt, onDone: () => finishLevel(w, l, 0, true), onBack: () => worldScreen(w) });
  if (L.t === 'boss' && !S().seen[Wd.id + '-boss']) return playScene(Wd.id + '-boss', 'bg-' + Wd.id, () => runQuiz(w, l));
  runQuiz(w, l);
}

/* =============== PLAY A LEVEL =============== */
const PRAISE = ['Great job!', 'Super!', 'You did it!', 'Amazing!', 'Wow!', 'So smart!', 'Yes!', 'Brilliant!'];
function runQuiz(w, l) {
  const Wd = WORLDS[w], L = Wd.levels[l], boss = L.t === 'boss';
  const tier = clamp(Wd.tier + (S().settings.boost || 0), 1, 5);
  const qs = Gen[L.t](tier);
  let i = 0, mistakes = 0, hearts = 5, over = false;
  const dots = h('div', { class: 'dots' }, qs.map(() => h('i')));
  const heartsEl = h('div', { class: 'hearts' });
  const bossEl = boss ? h('div', { class: 'bossbar' }) : null;
  const ptext = h('div', { class: 'ptext' }), pbtns = h('div', { class: 'pbtns' });
  const visual = h('div', { class: 'visual' }), answer = h('div', { class: 'answer' }), fb = h('div', { class: 'feedback' });
  const drawBoss = () => {
    if (!boss) return;
    const mood = i / qs.length;
    bossEl.innerHTML = `<div class="bossface">${Art.gloom({ mood, king: w === 4 })}</div><div class="meterbox"><b>${esc(L.name)}</b><div class="meter"><i style="width:${mood * 100}%"></i></div><small>😠 Make the Gloom happy! 😊</small></div>`;
    heartsEl.textContent = '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
  };
  let missed = false;                // a question can cost only one heart
  const miss = () => {
    mistakes++;
    if (boss && !over && !missed) {
      missed = true; hearts--; drawBoss();
      if (hearts <= 0) { over = true; setTimeout(() => failScreen(w, l), 700); }
    }
  };
  function next() {
    if (over) return;
    if (i >= qs.length) return finishLevel(w, l, mistakes, false);
    const q = qs[i];
    App.q = q;                       // the question on screen (handy for testing)
    missed = false;
    [...dots.children].forEach((d, k) => d.classList.toggle('cur', k === i));
    ptext.textContent = q.prompt;
    pbtns.replaceChildren(h('button', { class: 'iconbtn small', text: '🔊', title: 'Read it to me', onclick: () => Voice.say(q.say || q.prompt, Wd.host) }));
    if (q.hear) pbtns.append(h('button', { class: 'iconbtn small', text: '👂', title: 'Hear the answer', onclick: () => Voice.say(q.hear, Wd.host) }));
    visual.innerHTML = q.visual || '';
    answer.replaceChildren(); fb.replaceChildren(); fb.className = 'feedback';
    Render[q.kind](q, answer, wrong => {
      if (over) return;
      const st = S().stats[q.subj]; st.t++; if (!wrong) st.c++;
      dots.children[i].className = wrong ? 'meh' : 'ok';
      i++; drawBoss();
      fb.className = 'feedback show';
      const go = () => { if (!over) next(); };
      if (q.fact) {
        fb.append(h('div', { class: 'fact', html: `<b>${pick(PRAISE)}</b> 💡 ${esc(q.fact)}` }), h('button', { class: 'btn', text: 'Next ▶', onclick: go }));
        Voice.say(q.fact, Wd.host);
      } else {
        fb.append(h('div', { class: 'fact', html: `<b>${pick(PRAISE)}</b>${q.after ? ' ' + esc(q.after) : ''}` }));
        if (q.after) Voice.say(q.after, Wd.host);
        setTimeout(go, 1100 + (q.after ? q.after.length * 55 : 0));
      }
    }, miss);
    Voice.say(q.say || q.prompt, Wd.host);
  }
  App.screen('play bg-' + Wd.id + (boss ? ' boss' : ''),
    h('div', { class: 'topbar' },
      h('button', { class: 'iconbtn', text: '✕', onclick: () => { over = true; worldScreen(w); } }), dots, heartsEl),
    bossEl,
    h('div', { class: 'qwrap' },
      h('div', { class: 'promptrow' }, h('div', { class: 'mini', html: draw(Wd.host) }), h('div', { class: 'pbubble' }, ptext, pbtns)),
      visual, answer),
    fb);
  drawBoss();
  next();
}
function failScreen(w, l) {
  Snd.lose();
  App.screen('result bg-' + WORLDS[w].id,
    h('div', { class: 'card resultcard' },
      h('div', { class: 'cardhost', html: Art.gloom({ mood: 0.2, king: w === 4 }) }),
      h('h2', { text: 'The Gloom ran away!' }),
      h('p', { text: 'That is OK. Mistakes help us learn. Try again!' }),
      h('div', { class: 'row' },
        h('button', { class: 'btn ghost', text: 'Back', onclick: () => worldScreen(w) }),
        h('button', { class: 'btn big', text: 'Try again ↻', onclick: () => runQuiz(w, l) }))));
  Voice.say('The Gloom ran away! That is OK. Mistakes help us learn. Try again!', 'twinkle');
}

/* =============== RESULTS AND REWARDS =============== */
function finishLevel(w, l, mistakes, creative) {
  const Wd = WORLDS[w], L = Wd.levels[l], boss = L.t === 'boss';
  const stars = creative ? 3 : mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
  const old = starsOf(w, l), first = old === 0, lvBefore = heroLevel();
  const xp = first ? 5 + 10 * stars : stars > old ? 10 * (stars - old) : 3;
  const gems = first ? 10 + 5 * stars : stars > old ? 5 * (stars - old) : 2;
  S().progress[lid(w, l)] = Math.max(old, stars);
  S().xp += xp; S().gems += gems; App.save();
  const lvAfter = heroLevel();
  Snd.win(); confetti(stars * 14);
  const after = () => {
    if (boss && first) {
      return playScene(Wd.id + '-out', 'bg-' + Wd.id, () => (w === WORLDS.length - 1 ? endingScreen() : mapScreen()));
    }
    worldScreen(w);
  };
  const msg = creative ? 'What a great idea! You made it yourself.' : stars === 3 ? 'Perfect! You are a star!' : stars === 2 ? 'Great job! So close to 3 stars.' : 'Good try! Play again to get more stars.';
  const starRow = h('div', { class: 'bigstars' }, [0, 1, 2].map(k => h('span', { class: k < stars ? 'on' : '', text: '⭐', style: { animationDelay: k * 0.25 + 's' } })));
  App.screen('result bg-' + Wd.id,
    floaters(Wd.float),
    h('div', { class: 'card resultcard' },
      h('div', { class: 'cardhost', html: boss ? Art.gloom({ mood: 1, king: w === 4 }) : draw(Wd.host) }),
      h('h2', { text: boss ? 'The Gloom is happy now!' : L.name + ' done!' }),
      starRow,
      h('p', { text: msg }),
      h('div', { class: 'rewards' }, h('span', { text: `+${xp} XP` }), h('span', { text: `+${gems} 💎` })),
      lvAfter > lvBefore ? h('div', { class: 'levelup', text: `🎉 Level ${lvAfter}! You are now a ${HERO_TITLES[lvAfter - 1]}!` }) : null,
      h('div', { class: 'row' },
        h('button', { class: 'btn ghost', text: '↻ Play again', onclick: () => startLevel(w, l) }),
        h('button', { class: 'btn big', text: 'Next ▶', onclick: after }))));
  Voice.say(lvAfter > lvBefore ? `${msg} Level up! You are now a ${HERO_TITLES[lvAfter - 1]}!` : msg, Wd.host);
}
function endingScreen() {
  confetti(80); Snd.win();
  App.screen('title bg-map ending',
    floaters(['⭐', '🌈', '💖', '✨']),
    h('div', { class: 'logo' }, h('div', { class: 'logostar', text: '🌈⭐' }), h('h1', { text: 'The Rainbow Star shines again!' }),
      h('p', { text: `Thank you, ${S().hero.name}. You are the Star Guardian!` })),
    h('div', { class: 'castrow' },
      h('div', { html: draw('lumi') }), h('div', { html: draw('pix') }), h('div', { class: 'mid', html: draw('hero') }),
      h('div', { html: draw('nova') }), h('div', { html: draw('mochi') }), h('div', { html: draw('grumble') })),
    h('p', { class: 'endnote', text: 'Keep playing! Get 3 stars in every level, dress up, and make new things in the Studio.' }),
    h('button', { class: 'btn huge', text: 'Back to the map ▶', onclick: mapScreen }));
}

/* =============== DRESS UP =============== */
const ITEM_ICON = { flower: '🌸', bow: '🎀', catears: '🐱', headphones: '🎧', helmet: '⛑️', tiara: '❄️', crown: '👑', wand: '⭐', mic: '🎤', lightstick: '💖', cape: '🦸', wings: '🧚' };
function wardrobe() {
  const hero = S().hero;
  const prev = h('div', { class: 'heroprev' }), gemsEl = h('span'), shop = h('div', { class: 'shop' });
  const redraw = () => {
    prev.innerHTML = Art.chibi(hero); gemsEl.textContent = '💎 ' + S().gems; App.save();
    shop.replaceChildren(...SHOP.map(it => {
      const own = S().owned.includes(it.id), on = hero[it.slot] === it.id;
      const b = h('button', { class: 'shopitem' + (on ? ' on' : '') + (own ? ' own' : '') },
        h('div', { class: 'em', text: ITEM_ICON[it.id] }), h('b', { text: it.name }),
        h('small', { text: on ? 'Wearing ✔' : own ? 'Tap to wear' : `💎 ${it.cost}` }));
      b.onclick = () => {
        if (!own) {
          if (S().gems < it.cost) { Snd.bad(); return toast(`You need ${it.cost - S().gems} more 💎. Play levels to get gems!`); }
          S().gems -= it.cost; S().owned.push(it.id); hero[it.slot] = it.id; Snd.win(); burst(b);
        } else { hero[it.slot] = on ? null : it.id; Snd.pop(); }
        redraw();
      };
      return b;
    }));
  };
  redraw();
  App.screen('maker bg-map',
    h('div', { class: 'topbar' }, backBtn(mapScreen), h('h2', { text: '👗 Dress up' }), h('div', { class: 'counts' }, gemsEl)),
    h('div', { class: 'makerbody' },
      h('div', { class: 'makerleft' }, prev, h('b', { class: 'heroname', text: hero.name }),
        h('button', { class: 'linkbtn', text: '✏️ Change name', onclick: () => heroMaker(false) })),
      h('div', { class: 'picks' }, h('h4', { text: 'Shop: use your gems' }), shop, lookPickers(hero, redraw))));
}

/* =============== STUDIO (free creative play) =============== */
function studio() {
  const order = ['builder', 'pet', 'song', 'scene', 'story'];
  const cards = order.map((tool, w) => {
    const T = Creative.TOOLS[tool], open = S().settings.unlockAll || starsOf(w, 4) > 0;
    return h('button', { class: 'toolcard' + (open ? '' : ' locked'), onclick: () => {
      if (!open) { Snd.bad(); return toast(`🔒 Find this in ${WORLDS[w].name}.`); }
      Creative.open(tool, { onDone: studio, onBack: studio });
    } }, h('div', { class: 'em', text: open ? T.icon : '🔒' }), h('b', { text: T.name }), h('small', { text: open ? 'Tap to create' : `Find it in ${WORLDS[w].name}` }));
  });
  App.screen('studio bg-map',
    h('div', { class: 'topbar' }, backBtn(mapScreen), h('h2', { text: '🎨 Studio' }), h('span')),
    h('p', { class: 'lead', text: 'Make anything you like. There are no wrong answers here!' }),
    h('div', { class: 'tools' }, cards));
}

/* =============== FRIENDS =============== */
function friendsScreen() {
  const cards = FRIENDS.map(f => {
    const met = S().seen[WORLDS[f.world].id + '-in'], grown = worldDone(f.world);
    return h('div', { class: 'friendcard' + (met ? '' : ' unknown') },
      h('div', { class: 'fface', html: met ? draw(f.id) : '<div class="char emoji-char">❔</div>' }),
      h('b', { text: met ? f.name : '???' }),
      h('p', { text: met ? f.about : `Meet this friend in ${WORLDS[f.world].name}.` }),
      met ? h('p', { class: grown ? 'grown' : 'dim', text: grown ? '🌟 ' + f.after : f.before }) : null,
      grown ? h('div', { class: 'tag boss', text: '✨ ' + f.power }) : met ? h('div', { class: 'hearts', text: '💖'.repeat(Math.ceil(worldStars(f.world) / 6)) + '🤍'.repeat(3 - Math.ceil(worldStars(f.world) / 6)) }) : null);
  });
  const glows = WORLDS.filter((_, w) => worldDone(w)).length;
  App.screen('friends bg-map',
    h('div', { class: 'topbar' }, backBtn(mapScreen), h('h2', { text: '💖 My friends' }), h('span')),
    h('p', { class: 'lead', text: `Glooms turned into happy Glows: ${glows} of 5` }),
    h('div', { class: 'friendrow' }, cards));
}

/* =============== PARENTS =============== */
function parentGate() {
  const a = rand(6, 9), b = rand(6, 9);
  const inp = h('input', { class: 'nameinput', inputmode: 'numeric', placeholder: '?' });
  const ov = h('div', { class: 'overlay', onclick: e => { if (e.target === ov) ov.remove(); } },
    h('div', { class: 'card' }, h('h2', { text: 'For parents' }), h('p', { text: `What is ${a} × ${b}?` }), inp,
      h('div', { class: 'row' }, h('button', { class: 'btn ghost', text: 'Back', onclick: () => ov.remove() }),
        h('button', { class: 'btn', text: 'OK', onclick: () => { if (+inp.value === a * b) { ov.remove(); parentScreen(); } else toast('Not quite.'); } }))));
  root.append(ov); inp.focus();
}
function parentScreen() {
  const st = S().settings;
  const toggle = (label, key, apply) => {
    const b = h('button', { class: 'chip' + (st[key] ? ' sel' : ''), text: `${label}: ${st[key] ? 'On' : 'Off'}` });
    b.onclick = () => { st[key] = !st[key]; apply && apply(); App.save(); parentScreen(); };
    return b;
  };
  const diff = h('div', { class: 'chips' }, [[-1, 'Easier'], [0, 'Normal'], [1, 'Harder']].map(([v, label]) =>
    h('button', { class: 'chip' + (st.boost === v ? ' sel' : ''), text: label, onclick: () => { st.boost = v; App.save(); parentScreen(); } })));
  const rows = Object.entries(S().stats).map(([k, v]) => h('tr', {}, h('td', { text: cap(k) }), h('td', { text: v.t }), h('td', { text: v.t ? Math.round(v.c / v.t * 100) + '%' : '–' })));
  App.screen('parent bg-map',
    h('div', { class: 'topbar' }, backBtn(titleScreen), h('h2', { text: '⚙️ For parents' }), h('span')),
    h('div', { class: 'card wide' },
      h('h4', { text: 'Settings' }),
      h('div', { class: 'chips' }, toggle('Sound', 'sfx', () => { Snd.on = st.sfx; }), toggle('Voice (reads text aloud)', 'voice', () => { Voice.on = st.voice; }), toggle('Unlock all levels', 'unlockAll')),
      h('h4', { text: 'Difficulty' }), diff,
      h('p', { class: 'dim', text: 'Each world is one step harder: math goes from numbers up to 10 (world 1) to adding and taking away up to 100 (world 5). "Easier" and "Harder" move every world by one step.' }),
      h('h4', { text: 'Progress' }),
      h('table', { class: 'stats' }, h('tr', {}, h('th', { text: 'Subject' }), h('th', { text: 'Questions done' }), h('th', { text: 'Right on first try' })), rows),
      h('p', { class: 'dim', text: `Stars: ${totalStars()} of ${WORLDS.length * 18}. Hero level: ${heroLevel()}.` }),
      h('button', { class: 'btn ghost danger', text: 'Reset all progress', onclick: () => {
        const ov = h('div', { class: 'overlay', onclick: e => { if (e.target === ov) ov.remove(); } },
          h('div', { class: 'card' }, h('h2', { text: 'Delete all progress?' }), h('p', { text: 'The hero, stars and gems will be gone. This can not be undone.' }),
            h('div', { class: 'row' }, h('button', { class: 'btn ghost', text: 'Keep it', onclick: () => ov.remove() }),
              h('button', { class: 'btn', text: 'Yes, delete', onclick: () => { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} App.load(); titleScreen(); } }))));
        root.append(ov);
      } })));
}

titleScreen();
