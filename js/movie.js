/* Movie scenes: the story plays on a stage with scenery.
   Characters walk in, the speaker steps forward, and special effects (FX) play between lines.
   A story line is [who, text, mood, fx]. A line ['fx', name, arg] plays an effect by itself. */
'use strict';

const anim = (el, frames, opts) => { try { return el.animate(frames, opts); } catch (e) { return null; } };
const popIn = (el, ms = 450) => anim(el, [{ transform: 'scale(0)' }, { transform: 'scale(1.15)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: ms, easing: 'ease-out' });

function playScene(id, bg, done) {
  const lines = STORY[id];
  if (!lines) return done();
  S().seen[id] = true; App.save();
  const wi = WORLDS.findIndex(w => id.startsWith(w.id));

  const bgEl = h('div', { class: 'mbg ' + bg, html: Art.scenery(wi >= 0 ? WORLDS[wi].id : 'map') });
  const actorsEl = h('div', { class: 'actors' });
  const fxEl = h('div', { class: 'mfx' });
  const sceneEl = h('div', { class: 'mscene' }, bgEl, actorsEl, fxEl);
  const nameEl = h('div', { class: 'scenename' }), textEl = h('div', { class: 'scenetext' });
  const subEl = h('div', { class: 'msub' + (lines[0][0] === 'fx' ? ' quiet' : '') });

  let i = -1, busy = false, ended = false, clock = 0, typing = null, entered = 0;
  const timers = [];
  const actors = {};
  /* c = the tools every effect can use */
  const c = {
    id, wi, scene: sceneEl, bg: bgEl, props: {}, stage: {},
    after(ms, fn) { timers.push(setTimeout(() => { if (!ended) fn(); }, ms)); },
    /* add a thing to the scene, centered at left/top (in %) */
    add(html, style, cls) {
      const inner = h('div', { class: 'in', html });
      const el = h('div', { class: 'fxi ' + (cls || ''), style }, inner);
      el.in = inner; fxEl.append(el); return el;
    },
    shake(ms = 600) { anim(sceneEl, [0, -10, 9, -8, 7, -5, 4, -2, 0].map(x => ({ transform: `translate(${x}px, ${x / 2}px)` })), { duration: ms }); },
    flash() { const f = h('div', { class: 'mflash' }); fxEl.append(f); anim(f, [{ opacity: 0.95 }, { opacity: 0 }], { duration: 500 }); setTimeout(() => f.remove(), 480); },
    text(str) {
      const t = h('div', { class: 'mtext', text: str }); fxEl.append(t);
      anim(t, [{ transform: 'translate(-50%,-50%) rotate(-6deg) scale(.2)', opacity: 0 }, { transform: 'translate(-50%,-50%) rotate(-6deg) scale(1.15)', opacity: 1, offset: 0.25 }, { transform: 'translate(-50%,-50%) rotate(-6deg) scale(1)', opacity: 1, offset: 0.8 }, { transform: 'translate(-50%,-50%) rotate(-6deg) scale(1.3)', opacity: 0 }], { duration: 1300 });
      setTimeout(() => t.remove(), 1250);
    },
    banner(str, ms = 3000) {
      const b = h('div', { class: 'mbanner', text: str }); fxEl.append(b);
      anim(b, [{ transform: 'translateX(-50%) scale(0)' }, { transform: 'translateX(-50%) scale(1.1)', offset: 0.7 }, { transform: 'translateX(-50%) scale(1)' }], { duration: 400 });
      setTimeout(() => b.remove(), ms);
    },
    /* where an actor stands, in % of the scene (or the middle if not on stage) */
    pos(who) {
      const a = actors[who]; if (!a) return { x: 50, y: 60 };
      const r = a.el.getBoundingClientRect(), s = sceneEl.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - s.left) / s.width * 100, y: (r.top + r.height * 0.45 - s.top) / s.height * 100 };
    },
    /* little emojis that fly out from a point */
    spray(list, from, n, opt = {}) {
      for (let k = 0; k < n; k++) {
        const e = c.add(pick(list), { left: from.x + '%', top: from.y + '%' }, 'emo');
        const ang = (opt.up ? -Math.PI / 2 + (Math.random() - 0.5) * 1.6 : Math.random() * Math.PI * 2), d = (opt.dist || 160) * (0.5 + Math.random());
        anim(e.in, [{ transform: 'translate(0,0) scale(.3)', opacity: 0 }, { transform: `translate(${Math.cos(ang) * d * 0.5}px, ${Math.sin(ang) * d * 0.5}px) scale(1.2)`, opacity: 1, offset: 0.4 }, { transform: `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d + (opt.fall || 0)}px) scale(.8) rotate(${opt.spin || 0}deg)`, opacity: 0 }], { duration: opt.ms || 1300, delay: k * (opt.gap || 50), easing: 'ease-out', fill: 'both' });
        setTimeout(() => e.remove(), (opt.ms || 1300) + k * (opt.gap || 50));
      }
    },
    enter: (who, how) => enter(who, how),
    actor: who => actors[who],
  };
  if (id.endsWith('-out')) { const f = FRIENDS.find(x => x.world === wi); if (f) c.stage[f.id] = 1; }   // the friend powers up during the scene

  /* ---- actors ---- */
  function enter(who, how) {
    let a = actors[who];
    if (a) return a;
    const on = Object.values(actors), nl = on.filter(x => x.left).length;
    const left = who === 'hero' || who === 'twinkle' ? true : who === 'gloom' || who === 'grumble' || who === 'glow' ? false : nl < on.length - nl;
    entered++;
    const bob = h('div', { class: 'bob' });
    a = { who, left, el: h('div', { class: 'actor ' + who }, bob), last: 0, redraw(mood) { bob.innerHTML = CAST[who].draw(mood || 'happy', c.stage[who]); } };
    actors[who] = a;
    left ? actorsEl.prepend(a.el) : actorsEl.append(a.el);
    const all = Object.values(actors);
    if (all.length > 3) leave(all.filter(x => x !== a).sort((x, y) => x.last - y.last)[0]);
    how = how || (who === 'gloom' || who === 'grumble' ? 'stomp' : 'walk');
    if (how === 'walk') { anim(a.el, [{ translate: (left ? '-70vw' : '70vw') + ' 0' }, { translate: '0 -6%', offset: 0.8 }, { translate: '0 0' }], { duration: 550, easing: 'ease-out' }); Snd.whoosh(); }
    else {
      anim(a.el, [{ translate: '0 -90vh' }, { translate: '0 0', offset: 0.6 }, { translate: '0 -9%', offset: 0.8 }, { translate: '0 0' }], { duration: how === 'stomp' ? 650 : 900, easing: 'ease-in' });
      if (how === 'stomp') c.after(380, () => { c.shake(400); Snd.thud(); Snd.grr(); }); else Snd.sparkle();
    }
    return a;
  }
  function leave(a) {
    delete actors[a.who];
    anim(a.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    setTimeout(() => a.el.remove(), 280);
  }
  function talk(a) {
    Object.values(actors).forEach(x => x.el.classList.toggle('talk', x === a));
    if (a) { a.last = ++clock; anim(a.el.firstChild, [{ translate: '0 0' }, { translate: '0 -7%' }, { translate: '0 0' }], { duration: 320 }); }
  }

  /* ---- words appear one by one, so she can read along ---- */
  function type(str) {
    clearInterval(typing);
    textEl.replaceChildren(...str.split(' ').flatMap(w => [h('span', { class: 'w', text: w }), ' ']));
    const ws = [...textEl.querySelectorAll('.w')];
    let k = 0;
    const step = () => { if (k < ws.length) ws[k++].classList.add('on'); else { clearInterval(typing); typing = null; } };
    step(); typing = setInterval(step, 230);
  }
  const finishTyping = () => { clearInterval(typing); typing = null; textEl.querySelectorAll('.w').forEach(w => w.classList.add('on')); };

  function runFx(name, arg, blocking) {
    const fn = FX[name];
    const ms = fn ? (fn(c, arg) || 0) : 0;
    if (blocking) {
      busy = true; subEl.classList.add('quiet'); talk(null);
      c.after(ms, () => { busy = false; subEl.classList.remove('quiet'); advance(); });
    }
  }
  function show() {
    const L = lines[i];
    if (L[0] === 'fx') return runFx(L[1], L[2], true);
    const [who, text, mood, fx] = L, str = say(text);
    subEl.classList.toggle('narr', who === 'narr');
    if (who === 'narr') { talk(null); nameEl.style.display = 'none'; }
    else { const a = enter(who); a.redraw(mood); talk(a); nameEl.textContent = CAST[who].name(); nameEl.style.display = ''; }
    type(str); Voice.say(str, who);
    if (fx) runFx(fx, null, false);
  }
  function advance() { i++; if (i >= lines.length) finish(); else show(); }
  function next() {
    if (busy || ended) return;
    Snd.tap();
    if (typing) finishTyping(); else advance();
  }
  function finish() {
    if (ended) return;
    ended = true; clearInterval(typing); timers.forEach(clearTimeout); Voice.stop();
    done();
  }

  subEl.append(h('div', { class: 'bubble', onclick: next }, nameEl, textEl,
    h('div', { class: 'bubblebtns' },
      h('button', { class: 'iconbtn small', text: '🔊', onclick: e => { e.stopPropagation(); const L = lines[i]; if (L && L[0] !== 'fx') Voice.say(say(L[1]), L[0]); } }),
      h('button', { class: 'btn', text: 'Next ▶' }))));
  sceneEl.onclick = next;
  App.screen('movie',
    h('div', { class: 'mtop' }, h('button', { class: 'linkbtn', text: 'Skip ⏭', onclick: finish })),
    sceneEl, subEl);
  advance();
}

/* ================= SPECIAL EFFECTS =================
   Each one gets the scene tools (c) and returns how long it takes, in milliseconds. */
const FX = {
  /* the whole Rainbow Star shines in the sky */
  starshine(c) {
    c.props.rays = c.add('', { left: '50%', top: '27%' }, 'rays');
    c.props.star = c.add(Art.star5([1, 1, 1, 1, 1], true), { left: '50%', top: '27%' }, 'bigstar');
    popIn(c.props.star.in, 700); Snd.sparkle();
    return 1200;
  },
  /* grumpy Glooms fly in around the star */
  gloomsfly(c) {
    c.props.glooms = [[24, 26, -1], [76, 22, 1], [50, 52, 1]].map(([x, y, dir], k) => {
      const g = c.add(Art.gloom({ mood: 0 }), { left: x + '%', top: y + '%' }, 'minigloom');
      anim(g.in, [{ transform: `translate(${dir * 70}vw, -30vh) rotate(${dir * 40}deg)` }, { transform: 'translate(0,0) rotate(0)' }], { duration: 900, delay: k * 200, easing: 'ease-out', fill: 'backwards' });
      anim(g.in, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10%)' }, { transform: 'translateY(0)' }], { duration: 900, delay: 1100 + k * 200, iterations: Infinity });
      return g;
    });
    Snd.grr(); c.after(400, () => Snd.grr());
    return 1500;
  },
  /* the star breaks: its 5 pieces fly away */
  crack(c) {
    Snd.crash(); c.flash(); c.shake(800); c.text('CRACK!');
    const star = c.props.star;
    if (star) {
      const f = star.querySelector('.starface'); if (f) f.remove();
      star.querySelectorAll('.seg').forEach((seg, k) => {
        const a = (-90 + 72 * k) * Math.PI / 180;
        seg.style.transformBox = 'fill-box'; seg.style.transformOrigin = 'center';
        anim(seg, [{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * 320}px, ${Math.sin(a) * 320}px) rotate(${240 + k * 50}deg)`, opacity: 0 }], { duration: 1300, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'forwards' });
      });
    }
    if (c.props.rays) c.props.rays.remove();
    (c.props.glooms || []).forEach((g, k) => anim(g, [{ translate: '0 0' }, { translate: (k % 2 ? '80vw' : '-80vw') + ' -40vh' }], { duration: 900, delay: 500, easing: 'ease-in', fill: 'forwards' }));
    c.after(1400, () => { if (star) star.remove(); (c.props.glooms || []).forEach(g => g.remove()); });
    return 1700;
  },
  /* the colors of the land fade */
  fade(c) { c.bg.classList.add('grey'); return 1500; },
  twinkledrop(c) { c.enter('twinkle', 'drop').redraw('happy'); return 1000; },

  /* Pix builds a tower very fast... */
  towerup(c) {
    if (c.props.tower) c.props.tower.remove();
    const t = c.props.tower = h('div', { class: 'tower' }); c.scene.querySelector('.mfx').append(t);
    ['#9aa0a6', '#c68f53', '#6cc24a', '#4aa8ff', '#ffd54a', '#ff8fc7', '#b388ff'].forEach((col, k) => c.after(k * 150, () => {
      const b = h('i', { class: 'blk', style: { background: col } }); t.append(b); popIn(b, 200); Snd.tone(300 + k * 70, 0.08, 'square', 0.07);
    }));
    return 1300;
  },
  /* ...and it falls down */
  towerdown(c) {
    Snd.crash(); c.shake(700); c.text('CRASH!');
    const t = c.props.tower; if (!t) return 900;
    [...t.children].forEach((b, k) => anim(b, [{ transform: 'translate(0,0) rotate(0)' }, { transform: `translate(${(k % 2 ? 1 : -1) * (40 + k * 30)}px, ${k * 40}px) rotate(${(k % 2 ? 1 : -1) * (90 + k * 40)}deg)`, opacity: 1, offset: 0.7 }, { transform: `translate(${(k % 2 ? 1 : -1) * (60 + k * 34)}px, ${k * 46}px) rotate(${(k % 2 ? 1 : -1) * (120 + k * 40)}deg)`, opacity: 0 }], { duration: 1000, easing: 'ease-in', fill: 'forwards' }));
    c.after(1000, () => { t.remove(); c.props.tower = null; });
    return 1100;
  },
  /* Lumi's magic goes wrong: an ice block lands with a bump */
  magicoops(c) {
    const p = c.pos('lumi');
    c.spray(['❄️'], p, 10, { dist: 170, spin: 180 }); Snd.sparkle();
    c.after(600, () => {
      const ice = c.add('🧊', { left: Math.min(88, p.x + 4) + '%', top: (p.y - 22) + '%' }, 'emo big');
      anim(ice.in, [{ transform: 'translateY(-60vh)' }, { transform: 'translateY(0)', offset: 0.7 }, { transform: 'translateY(-18%)', offset: 0.85 }, { transform: 'translateY(0)' }], { duration: 600, easing: 'ease-in' });
      c.after(400, () => { Snd.thud(); c.shake(300); c.text('BONK!'); });
      c.after(2000, () => ice.remove());
    });
    return 1600;
  },
  snowburst(c) { c.spray(['❄️', '✨', '❄️'], c.pos('lumi'), 18, { dist: 260, spin: 360, ms: 1500 }); Snd.sparkle(); return 1200; },
  notes(c) { c.spray(['🎵', '🎶', '💖', '⭐'], c.pos('nova'), 14, { up: true, dist: 260, ms: 1700, gap: 90 }); [523, 659, 784, 1047, 784, 1047].forEach((f, k) => Snd.tone(f, 0.2, 'triangle', 0.14, k * 0.14)); return 1500; },
  /* the notes go up, then fall down grey */
  notesdrop(c) {
    const p = c.pos('nova');
    for (let k = 0; k < 7; k++) {
      const e = c.add(pick(['🎵', '🎶']), { left: p.x + (k - 3) * 5 + '%', top: p.y + '%' }, 'emo');
      anim(e.in, [{ transform: 'translateY(0) scale(.4)', opacity: 0, filter: 'none' }, { transform: 'translateY(-160px) scale(1.2)', opacity: 1, filter: 'none', offset: 0.45 }, { transform: 'translateY(-170px) scale(1.1)', opacity: 1, filter: 'grayscale(1)', offset: 0.6 }, { transform: 'translateY(120px) scale(.8) rotate(80deg)', opacity: 0, filter: 'grayscale(1)' }], { duration: 1800, delay: k * 90, fill: 'both' });
      setTimeout(() => e.remove(), 1800 + k * 90);
    }
    Snd.tone(523, 0.2, 'triangle', 0.12); Snd.tone(392, 0.25, 'triangle', 0.12, 0.25); Snd.sweep(330, 110, 0.6, 'sine', 0.12, 0.6);
    return 1700;
  },
  questions(c) { c.spray(['❓', '❔', '❓'], c.pos('mochi'), 8, { up: true, dist: 190, ms: 1500, gap: 110 }); [660, 880, 660, 990].forEach((f, k) => Snd.tone(f, 0.1, 'sine', 0.1, k * 0.13)); return 1200; },

  /* THE BIG ONE: the Gloom turns happy, the shard pops out and flies into the Rainbow Star */
  shard(c) {
    const k = Math.max(0, c.wi), king = k === 4;
    const g = c.add(Art.gloom({ mood: 0, king }), { left: '50%', top: '66%' }, 'bossgloom');
    popIn(g.in); Snd.grr();
    anim(g.in, [{ rotate: '0deg' }, { rotate: '-7deg' }, { rotate: '7deg' }, { rotate: '-5deg' }, { rotate: '5deg' }, { rotate: '0deg' }], { duration: 1100, delay: 500 });
    for (let s = 1; s <= 8; s++) c.after(500 + s * 130, () => { g.in.innerHTML = Art.gloom({ mood: s / 8, king }); Snd.tone(280 + s * 70, 0.12, 'triangle', 0.1); });
    let sh, rays, em;
    c.after(1800, () => {            // the shard pops out
      rays = c.add('', { left: '50%', top: '56%' }, 'rays small');
      sh = c.add(Art.shard(k), { left: '50%', top: '56%' }, 'shard');
      anim(sh, [{ top: '68%' }, { top: '56%' }], { duration: 800, easing: 'cubic-bezier(.2,1.5,.4,1)' });
      anim(sh.in, [{ transform: 'scale(.1) rotate(-200deg)' }, { transform: 'scale(1.2) rotate(10deg)', offset: 0.75 }, { transform: 'scale(1) rotate(0)' }], { duration: 800 });
      anim(g, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 500, fill: 'forwards' });
      Snd.sparkle(); c.flash(); c.spray(['✨', '⭐', '💖'], { x: 50, y: 56 }, 14, { dist: 240 });
      c.banner(`Star shard ${k + 1} of 5!`, 3800);
    });
    c.after(3300, () => {            // the star appears, with the shards found before
      g.remove();
      const filled = [0, 1, 2, 3, 4].map(j => j !== k && worldDone(j));
      em = c.add(Art.star5(filled), { left: '50%', top: '27%' }, 'bigstar'); popIn(em.in); Snd.whoosh();
      c.after(700, () => {           // the shard flies to its place
        const a = (-90 + 72 * k) * Math.PI / 180, er = em.getBoundingClientRect(), sr = c.scene.getBoundingClientRect();
        const tx = (er.left + er.width / 2 + Math.cos(a) * er.width * 0.29 - sr.left) / sr.width * 100;
        const ty = (er.top + er.height / 2 + Math.sin(a) * er.width * 0.29 - sr.top) / sr.height * 100;
        if (rays) rays.remove();
        anim(sh, [{ left: '50%', top: '56%' }, { left: tx + '%', top: ty + '%' }], { duration: 650, easing: 'ease-in', fill: 'forwards' });
        anim(sh.in, [{ transform: 'scale(1) rotate(0)' }, { transform: `scale(.45) rotate(${360 + 72 * k}deg)` }], { duration: 650, fill: 'forwards' });
        c.after(650, () => {
          sh.remove(); filled[k] = true;
          em.in.innerHTML = Art.star5(filled, true);
          anim(em.in, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 500 });
          Snd.win(); c.flash(); confetti(36);
          c.spray(['✨', '🌟'], { x: 50, y: 27 }, 12, { dist: 220 });
        });
      });
    });
    c.after(6000, () => { if (em) { anim(em, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }); c.after(400, () => em.remove()); } });
    return 6400;
  },
  /* a friend gets a new power and a new look */
  powerup(c, who) {
    const f = FRIENDS.find(x => x.id === who), a = c.enter(who), p = c.pos(who);
    const ring = c.add('', { left: p.x + '%', top: p.y + '%' }, 'ring');
    anim(ring.in, [{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(2.4)', opacity: 0 }], { duration: 900, fill: 'forwards' });
    setTimeout(() => ring.remove(), 900);
    Snd.sparkle();
    c.after(450, () => {
      c.stage[who] = 2; a.redraw('happy'); a.el.classList.add('talk');
      anim(a.el.firstChild, [{ scale: '1' }, { scale: '1.25' }, { scale: '1' }], { duration: 500 });
      c.flash(); Snd.win(); c.spray(['✨', '⭐', '💖'], c.pos(who), 16, { dist: 230 });
      c.banner(`✨ ${f.name} got the ${f.power}! ✨`, 2300);
    });
    return 2600;
  },
  /* the Rainbow Star is whole again and the colors come back */
  starjoin(c) {
    c.flash(); Snd.sparkle();
    const dawn = h('div', { class: 'mbg dawn bg-map', html: Art.scenery('map') });
    c.bg.after(dawn); requestAnimationFrame(() => requestAnimationFrame(() => dawn.classList.add('on')));
    c.props.rays = c.add('', { left: '50%', top: '27%' }, 'rays');
    const star = c.props.star = c.add(Art.star5([1, 1, 1, 1, 1], true), { left: '50%', top: '27%' }, 'bigstar');
    anim(star.in, [{ transform: 'scale(0) rotate(-360deg)' }, { transform: 'scale(1.2) rotate(0)', offset: 0.7 }, { transform: 'scale(1) rotate(0)' }], { duration: 1200, easing: 'ease-out' });
    [0, 500, 1000].forEach(d => c.after(600 + d, () => {
      const w = c.add('', { left: '50%', top: '27%' }, 'wave');
      anim(w.in, [{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(7)', opacity: 0 }], { duration: 1500, easing: 'ease-out', fill: 'forwards' });
      setTimeout(() => w.remove(), 1500);
    }));
    c.after(1200, () => { Snd.win(); confetti(50); });
    return 2800;
  },
  /* the Glooms turn into happy Glows and dance */
  glows(c) {
    [10, 26, 42, 58, 74, 90].forEach((x, k) => {
      const g = c.add(Art.gloom({ mood: 0 }), { left: x + '%', top: 'auto', bottom: '2%' }, 'minigloom ground');
      popIn(g.in, 300);
      c.after(500 + k * 220, () => { g.in.innerHTML = Art.gloom({ mood: 1 }); g.classList.add('dance'); Snd.tone(520 + k * 90, 0.14, 'triangle', 0.14); });
    });
    return 2000;
  },
  party(c) { confetti(70); Snd.win(); c.scene.querySelectorAll('.actor').forEach(a => a.classList.add('dance')); return 800; },
};
