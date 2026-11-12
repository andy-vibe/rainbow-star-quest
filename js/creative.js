/* Creative tools: there are no wrong answers here.
   builder (blocks), pet (invent an animal), song, scene (stickers), story. */
'use strict';

const Creative = {
  TOOLS: {
    builder: { name: 'Block Builder', icon: '🧱', prompt: 'Build anything you like!' },
    pet: { name: 'Pet Inventor', icon: '🐾', prompt: 'Invent a new animal friend!' },
    song: { name: 'Song Maker', icon: '🎵', prompt: 'Make your own song!' },
    scene: { name: 'Sticker Picture', icon: '🖼️', prompt: 'Make a picture with stickers!' },
    story: { name: 'Story Maker', icon: '📚', prompt: 'Make your own story!' },
  },

  /* opts: prompt, onDone(), onBack() */
  open(tool, opts) {
    const T = this.TOOLS[tool];
    const prompt = opts.prompt || T.prompt;
    let leave = () => {};
    const doneBtn = h('button', { class: 'btn done', text: 'Done ✔', disabled: true });
    const start = JSON.stringify(App.S.creations[tool] || null);
    let changed = false;             // Done needs something new: replaying a level must not finish it in one tap
    const api = {
      data: App.S.creations[tool] || null,
      save(d) { App.S.creations[tool] = d; App.save(); if (!changed) changed = JSON.stringify(d) !== start; },
      ready(ok) { doneBtn.disabled = !(ok && changed); },
      onLeave(fn) { leave = fn; },
    };
    const body = h('div', { class: 'cbody ' + tool });
    doneBtn.onclick = () => { leave(); Voice.stop(); Snd.win(); confetti(24); opts.onDone(); };
    App.screen('creative',
      h('div', { class: 'topbar' },
        h('button', { class: 'iconbtn', text: '←', 'aria-label': 'Back', onclick: () => { leave(); Voice.stop(); opts.onBack(); } }),
        h('div', { class: 'cprompt' }, h('span', { text: T.icon + ' ' + prompt }),
          h('button', { class: 'iconbtn small', text: '🔊', 'aria-label': 'Read it to me', onclick: () => Voice.say(prompt, 'twinkle') })),
        doneBtn),
      body);
    this[tool](body, api);
    Voice.say(prompt, 'twinkle');
  },

  /* ---------- 1. Block builder ---------- */
  builder(body, api) {
    const COLS = 16, ROWS = 11;
    const BLOCKS = ['#6cc24a', '#9b6b43', '#9aa0a6', '#c68f53', '#3fa34d', '#a8e6ff', '#ffffff', '#4aa8ff', '#f1dc9c', '#ffd54a', '#ff8fc7', '#b388ff', '#ef5350', '#3a3a55'];
    let cells = api.data && api.data.length === COLS * ROWS ? api.data.slice() : new Array(COLS * ROWS).fill(-1);
    let cur = 5;
    let pen = null, last = -1;       // the one finger (pointerId) that draws, and the last cell it painted
    const grid = h('div', { class: 'bgrid', style: { gridTemplateColumns: `repeat(${COLS}, 1fr)` } });
    const els = cells.map((v, i) => { const c = h('i', { 'data-i': i }); grid.append(c); return c; });
    const paintEl = (el, v) => { el.style.background = v < 0 ? '' : BLOCKS[v]; el.className = v < 0 ? '' : 'on'; };
    const sync = () => { api.save(cells); api.ready(cells.filter(v => v >= 0).length >= 8); };
    const paint = i => {
      if (cells[i] === cur) return;
      cells[i] = cur; paintEl(els[i], cur); Snd.tap();
    };
    const cellAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.parentNode === grid ? +el.dataset.i : -1; };
    /* a fast swipe skips cells between two move events: fill the straight line of cells from the last one */
    const paintTo = i => {
      if (last < 0) { paint(i); last = i; return; }
      let c = last % COLS, r = Math.floor(last / COLS);
      const c1 = i % COLS, r1 = Math.floor(i / COLS), dc = Math.abs(c1 - c), dr = Math.abs(r1 - r), sc = c < c1 ? 1 : -1, sr = r < r1 ? 1 : -1;
      let err = dc - dr;
      for (;;) {
        paint(r * COLS + c);
        if (c === c1 && r === r1) break;
        const e2 = 2 * err;
        if (e2 > -dr) { err -= dr; c += sc; }
        if (e2 < dc) { err += dc; r += sr; }
      }
      last = i;
    };
    /* only the first finger draws: a second finger or a resting palm must not paint or stop the drawing */
    grid.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (pen !== null) return;
      pen = e.pointerId; last = -1;
      const i = cellAt(e.clientX, e.clientY);
      if (i >= 0) paintTo(i);
    });
    grid.addEventListener('pointermove', e => {
      if (e.pointerId !== pen) return;
      const i = cellAt(e.clientX, e.clientY);
      if (i < 0) last = -1;           // off the board: coming back starts a new line, not one across the gap
      else paintTo(i);
    });
    const stop = e => { if (e.pointerId === pen) { pen = null; sync(); } };
    window.addEventListener('pointerup', stop); window.addEventListener('pointercancel', stop);   // cancel: the system took over the touch
    api.onLeave(() => { window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', stop); });
    els.forEach((el, i) => paintEl(el, cells[i]));

    const pal = h('div', { class: 'palette' });
    const pick1 = (v, btn) => { cur = v; [...pal.children].forEach(c => c.classList.remove('sel')); btn.classList.add('sel'); };
    BLOCKS.forEach((col, v) => { const b = h('button', { class: 'swatch' + (v === cur ? ' sel' : ''), style: { background: col } }); b.onclick = () => pick1(v, b); pal.append(b); });
    const er = h('button', { class: 'swatch eraser', text: '🧽' }); er.onclick = () => pick1(-1, er); pal.append(er);
    pal.append(h('button', { class: 'swatch eraser', text: '🗑️', onclick: () => { cells = cells.map(() => -1); els.forEach(el => paintEl(el, -1)); sync(); } }));
    body.append(grid, pal, h('div', { class: 'ctip', text: 'Pick a color. Then tap or drag on the board. Use 8 blocks or more.' }));
    sync();
  },

  /* ---------- 2. Pet inventor ---------- */
  pet(body, api) {
    const ANIMALS = [['cat', '🐱'], ['dog', '🐶'], ['bunny', '🐰'], ['fox', '🦊'], ['owl', '🦉'], ['fish', '🐟'], ['dragon', '🐉'], ['unicorn', '🦄'], ['panda', '🐼'], ['bee', '🐝'], ['turtle', '🐢'], ['penguin', '🐧']];
    const POWERS = [['fly in the sky', '🕊️'], ['glow in the dark', '✨'], ['sing lovely songs', '🎵'], ['make ice', '❄️'], ['build very fast', '🧱'], ['turn invisible', '👻'], ['run super fast', '⚡'], ['talk to plants', '🌱']];
    const FOODS = [['pizza', '🍕'], ['ice cream', '🍦'], ['star cookies', '🍪'], ['rainbow candy', '🍭'], ['apples', '🍎'], ['noodles', '🍜']];
    const d = api.data || { a: null, b: null, p: null, f: null, name: '' };
    const face = h('div', { class: 'petface' }), textEl = h('div', { class: 'pettext' });
    const nameIn = h('input', { class: 'nameinput', maxlength: 16, placeholder: 'Name', value: d.name || '' });
    const readBtn = h('button', { class: 'btn', text: '🔊 Read it to me', onclick: () => Voice.say(text(), 'pix') });
    const card = h('div', { class: 'petcard' }, face, nameIn, textEl, readBtn);
    nameIn.oninput = () => { d.name = nameIn.value; d.custom = true; update(); };
    const text = () => `This is ${d.name || 'my pet'}! It is part ${ANIMALS[d.a][0]} and part ${ANIMALS[d.b][0]}. It can ${POWERS[d.p][0]}. It loves to eat ${FOODS[d.f][0]}.`;
    function update() {
      const ok = [d.a, d.b, d.p, d.f].every(v => v != null);
      if (d.a != null && d.b != null && !d.custom) { d.name = cap(ANIMALS[d.a][0]) + ANIMALS[d.b][0]; nameIn.value = d.name; }
      face.innerHTML = `${d.a != null ? ANIMALS[d.a][1] : '❔'}<small>+</small>${d.b != null ? ANIMALS[d.b][1] : '❔'}${d.p != null ? `<sup>${POWERS[d.p][1]}</sup>` : ''}`;
      textEl.textContent = ok ? text() : 'Pick one thing in each row.';
      readBtn.style.visibility = ok ? 'visible' : 'hidden';
      api.save(d); api.ready(ok && d.name.trim().length > 0);
    }
    const row = (title, list, key) => {
      const chips = h('div', { class: 'chips' });
      list.forEach(([name, e], i) => {
        const c = h('button', { class: 'chip' + (d[key] === i ? ' sel' : ''), html: `<span>${e}</span>${esc(name)}` });
        c.onclick = () => { d[key] = i; [...chips.children].forEach(x => x.classList.remove('sel')); c.classList.add('sel'); Snd.pop(); update(); };
        chips.append(c);
      });
      return h('div', { class: 'pickrow' }, h('h4', { text: title }), chips);
    };
    body.append(
      h('div', { class: 'picks' }, row('1. First animal', ANIMALS, 'a'), row('2. Second animal', ANIMALS, 'b'), row('3. What can it do?', POWERS, 'p'), row('4. What does it eat?', FOODS, 'f')),
      card);
    update();
  },

  /* ---------- 3. Song maker ---------- */
  song(body, api) {
    const NOTES = [523.25, 440, 392, 329.63, 293.66, 261.63], COLS = 8;
    const COLORS = ['#ff6b9d', '#ff9f43', '#ffd54a', '#5fd38d', '#4aa8ff', '#b388ff'];
    const d = api.data || { on: [], wave: 'triangle', fast: false, title: '' };
    const has = (r, c) => d.on.includes(r * COLS + c);
    const grid = h('div', { class: 'sgrid', style: { gridTemplateColumns: `repeat(${COLS}, 1fr)` } });
    const cellEls = [];
    for (let r = 0; r < NOTES.length; r++) for (let c = 0; c < COLS; c++) {
      const el = h('button', { class: 'scell' + (has(r, c) ? ' on' : ''), style: { '--col': COLORS[r] } });
      el.style.setProperty('--col', COLORS[r]);
      el.onclick = () => {
        const k = r * COLS + c, i = d.on.indexOf(k);
        if (i >= 0) d.on.splice(i, 1); else { d.on.push(k); Snd.tone(NOTES[r], 0.3, d.wave, 0.2); }
        el.classList.toggle('on'); sync();
      };
      cellEls.push(el); grid.append(el);
    }
    let timer = null, step = 0;
    const playBtn = h('button', { class: 'btn big', text: '▶ Play' });
    const tick = () => {
      cellEls.forEach((el, i) => el.classList.toggle('now', i % COLS === step));
      for (let r = 0; r < NOTES.length; r++) if (has(r, step)) Snd.tone(NOTES[r], 0.32, d.wave, 0.2);
      step = (step + 1) % COLS;
    };
    const stop = () => { clearInterval(timer); timer = null; playBtn.textContent = '▶ Play'; cellEls.forEach(el => el.classList.remove('now')); };
    const play = () => { stop(); step = 0; tick(); timer = setInterval(tick, d.fast ? 220 : 380); playBtn.textContent = '⏹ Stop'; };
    playBtn.onclick = () => timer ? stop() : play();
    api.onLeave(stop);
    const title = h('div', { class: 'songtitle', text: d.title ? '🎶 ' + d.title : '' });
    const sync = () => { api.save(d); api.ready(d.on.length >= 4); };
    const waveBtn = (label, w) => h('button', { class: 'chip' + (d.wave === w ? ' sel' : ''), text: label, onclick: e => { d.wave = w; [...e.currentTarget.parentNode.children].forEach(x => x.classList.remove('sel')); e.currentTarget.classList.add('sel'); Snd.tone(440, 0.3, w, 0.2); sync(); } });
    body.append(
      h('div', { class: 'ctip', text: 'Tap the boxes to add notes. High notes are at the top. Add 4 notes or more.' }),
      grid,
      h('div', { class: 'songbar' },
        playBtn,
        h('div', { class: 'chips' }, waveBtn('🔔 Bell', 'sine'), waveBtn('🎹 Piano', 'triangle'), waveBtn('🤖 Robot', 'square')),
        h('button', { class: 'chip', text: d.fast ? '🐇 Fast' : '🐢 Slow', onclick: e => { d.fast = !d.fast; e.currentTarget.textContent = d.fast ? '🐇 Fast' : '🐢 Slow'; if (timer) play(); sync(); } }),
        h('button', { class: 'chip', text: '🎲 Name my song', onclick: () => { d.title = pick(['Happy', 'Snowy', 'Shiny', 'Brave', 'Funny', 'Sleepy', 'Magic']) + ' ' + pick(['Star', 'Kitty', 'Dance', 'Dream', 'Blocks', 'Rainbow', 'Friends']); title.textContent = '🎶 ' + d.title; Voice.say(d.title, 'nova'); sync(); } }),
        h('button', { class: 'chip', text: '🗑️ Clear', onclick: () => { d.on = []; cellEls.forEach(el => el.classList.remove('on')); sync(); } })),
      title);
    sync();
  },

  /* ---------- 4. Sticker picture ---------- */
  scene(body, api) {
    const BGS = { meadow: 'linear-gradient(#aee4ff 55%, #8fd96b 55%)', snow: 'linear-gradient(#cfe9ff 60%, #ffffff 60%)', stage: 'linear-gradient(#2b1d52 70%, #6b3fa0 70%)', sea: 'linear-gradient(#aee4ff 35%, #2f8fd8 35%)', space: 'radial-gradient(circle at 70% 20%, #3b2a7a, #0d0b24)', valley: 'linear-gradient(#bfe8ff 60%, #6cc24a 60%, #6cc24a 72%, #9b6b43 72%)' };
    const STICKERS = '👸 🧒 🐱 🐶 🐰 🦊 🦄 🐉 🐧 🐼 👾 ⛄ 🌈 ⭐ 🌙 ☀️ ☁️ ❄️ 🌸 🌳 🌷 🏰 🏠 🎈 🎁 🎂 🍦 🍭 🎤 🎸 🎵 💖 🎀 🧱 🚀 👑 🦋 🐟 🪁 🎪'.split(' ');
    const d = api.data || { bg: 'meadow', items: [] };
    let sel = -1;
    const stage = h('div', { class: 'stage' });
    const sync = () => { api.save(d); api.ready(d.items.length >= 3); };
    function draw() {
      stage.style.background = BGS[d.bg];
      stage.innerHTML = '';
      d.items.forEach((it, i) => {
        const el = h('span', { class: 'sticker' + (i === sel ? ' sel' : ''), text: it.e, style: { left: it.x + '%', top: it.y + '%', fontSize: `calc(${it.s} * min(6vw, 7vh))` } });
        el.addEventListener('pointerdown', ev => {
          ev.preventDefault(); sel = i; el.setPointerCapture(ev.pointerId);
          [...stage.children].forEach(c => c.classList.remove('sel')); el.classList.add('sel');
          const move = e2 => {
            const r = stage.getBoundingClientRect();
            it.x = clamp((e2.clientX - r.left) / r.width * 100, 2, 98); it.y = clamp((e2.clientY - r.top) / r.height * 100, 4, 96);
            el.style.left = it.x + '%'; el.style.top = it.y + '%';
          };
          const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); sync(); };
          el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);   // cancel: the system took over the touch
        });
        stage.append(el);
      });
      sync();
    }
    const pal = h('div', { class: 'stickers' });
    STICKERS.forEach(e => pal.append(h('button', { text: e, onclick: () => { d.items.push({ e, x: rand(30, 70), y: rand(35, 70), s: 1 }); sel = d.items.length - 1; Snd.pop(); draw(); } })));
    const tool = (label, fn) => h('button', { class: 'chip', text: label, onclick: () => { if (sel < 0 || !d.items[sel]) return toast('Tap a sticker in your picture first.'); fn(d.items[sel]); draw(); } });
    const bgs = h('div', { class: 'chips' });
    Object.keys(BGS).forEach(k => bgs.append(h('button', { class: 'bgchip', style: { background: BGS[k] }, title: k, onclick: () => { d.bg = k; draw(); } })));
    body.append(
      h('div', { class: 'scenemain' }, stage,
        h('div', { class: 'scenetools' }, bgs,
          tool('➕ Bigger', it => { it.s = Math.min(3, it.s + 0.35); }),
          tool('➖ Smaller', it => { it.s = Math.max(0.5, it.s - 0.35); }),
          tool('🗑️ Remove', it => { d.items.splice(d.items.indexOf(it), 1); sel = -1; }))),
      pal,
      h('div', { class: 'ctip', text: 'Tap a sticker to add it. Drag it to move it. Use 3 stickers or more.' }));
    draw();
  },

  /* ---------- 5. Story maker ---------- */
  story(body, api) {
    const WHO = [['a brave princess', '👸'], ['a tiny kitten', '🐱'], ['a blocky builder', '👷'], ['a pop star', '🎤'], ['a friendly dragon', '🐉'], ['a little Gloom', '👾']];
    const WHERE = [['an ice castle', '🏰'], ['a candy forest', '🍭'], ['the moon', '🌙'], ['the deep blue sea', '🌊'], ['a block village', '🏘️'], ['a big stage', '🎪']];
    const PROBLEM = [['all the colors were gone', '🎨'], ['a big storm was coming', '⛈️'], ['everyone forgot how to smile', '😶'], ['the music had stopped', '🔇'], ['a giant was asleep on the road', '😴']];
    const FIX = [['sang a silly song', '🎵'], ['built a rainbow bridge', '🌈'], ['baked a huge cake to share', '🎂'], ['asked everyone to help', '🤝'], ['told a very funny joke', '😂']];
    const d = api.data || { w: null, p: null, q: null, f: null };
    const book = h('div', { class: 'storybook' });
    const ok = () => [d.w, d.p, d.q, d.f].every(v => v != null);
    const text = () => {
      const who = WHO[d.w][0], the = who.replace(/^a /, 'the ');
      return `Once upon a time, ${who} went to ${WHERE[d.p][0]}. But oh no! ${cap(PROBLEM[d.q][0])}. So ${the} ${FIX[d.f][0]}. It worked! Everyone was happy again. The end.`;
    };
    const rows = h('div', { class: 'picks' });
    function update() {
      book.innerHTML = '';
      if (ok()) {
        book.append(
          h('div', { class: 'storypics', text: `${WHO[d.w][1]} ➜ ${WHERE[d.p][1]} ➜ ${PROBLEM[d.q][1]} ➜ ${FIX[d.f][1]} ➜ 🎉` }),
          h('p', { text: text() }),
          h('button', { class: 'btn', text: '🔊 Read my story', onclick: () => Voice.say(text(), 'narr') }),
          h('div', { class: 'ctip', text: 'What happens next? Tell someone your idea!' }));
      } else book.append(h('p', { class: 'dim', text: 'Pick one thing in each row to make your story.' }));
      api.save(d); api.ready(ok());
    }
    const row = (title, list, key) => {
      const chips = h('div', { class: 'chips' });
      list.forEach(([name, e], i) => {
        const c = h('button', { class: 'chip' + (d[key] === i ? ' sel' : ''), html: `<span>${e}</span>${esc(name)}` });
        c.onclick = () => { d[key] = i; [...chips.children].forEach(x => x.classList.remove('sel')); c.classList.add('sel'); Snd.pop(); update(); };
        chips.append(c);
      });
      return h('div', { class: 'pickrow' }, h('h4', { text: title }), chips);
    };
    rows.append(row('1. Who is the hero?', WHO, 'w'), row('2. Where does the hero go?', WHERE, 'p'), row('3. What is the problem?', PROBLEM, 'q'), row('4. How does the hero fix it?', FIX, 'f'));
    body.append(rows, book);
    update();
  },
};
