/* The Axie pet and the Chimera enemies:
   - the Axie waits on the title, map and world screens
   - it stands beside the hero in the story scenes and reacts to the action
   - it runs behind the hero on the level path
   - it cheers, flinches and attacks in the levels, and flips on the results screen
   - Chimeras take the place of the Glooms as the enemies
   It listens to the small events the game sends (screen, level, right, wrong, win, scene, line, fx). */
'use strict';

(function () {
  const style = document.createElement('style');
  style.textContent = `
    .axiepet { position: fixed; left: env(safe-area-inset-left, 0px); bottom: 0; width: clamp(150px, 24vw, 300px); height: clamp(130px, 21vw, 260px); pointer-events: none; z-index: 40; }
    .axiepet.side { width: clamp(120px, 18vw, 230px); height: clamp(104px, 16vw, 200px); }
    .axiepet.win { left: 50%; transform: translateX(-50%); width: min(96vw, 620px); height: clamp(150px, 26vh, 260px); }
    /* boss fight: the Axie stands in the top bar, on the same line as the Chimera, facing it */
    .axiepet.bar { position: static; flex: none; width: clamp(120px, 20vw, 190px); height: clamp(104px, 17vw, 160px); }
    /* shard scene: the Chimera stands on the ground like the other characters, not in the air */
    .fxi.bossgloom { top: auto !important; bottom: 2%; transform: translateX(-50%); }
    @media (max-width: 700px) {
      .axiepet:not(.bar):not(.win) { width: 112px; height: 98px; }
      .bossbar.hasaxie { flex-wrap: wrap; justify-content: space-between; }
      .bossbar.hasaxie .team .mini:nth-child(n+2) { display: none; }   /* only the hero stays beside the Axie: the magic shots start from her */
      .bossbar.hasaxie .meterbox { order: 3; flex-basis: 100%; }
    }
    .axierun { position: absolute; right: 62%; bottom: -5px; width: 64px; height: 58px; pointer-events: none; }
    .actor.axieactor { width: min(24vw, 210px); height: 46%; transform: none; filter: none; transition: translate .5s ease; }
    .actor.axieactor canvas { width: 100%; height: 100%; display: block; }
    .bossbar .bossface { width: clamp(120px, 20vw, 190px); height: clamp(104px, 17vw, 160px); }
    .axiepick { position: fixed; right: 10px; bottom: 10px; z-index: 60; background: #fff; border-radius: 999px; padding: 6px 12px; font-weight: 800; box-shadow: 0 4px 0 rgba(0,0,0,.15); font-size: 14px; }
  `;
  document.head.append(style);

  const NAMES = Object.keys(Axie.LIST);
  const current = () => { const n = localStorage.getItem('axie-pet'); return NAMES.includes(n) ? n : 'buba'; };
  const one = list => list[Math.floor(Math.random() * list.length)];
  const IDLES = ['action/idle/random-01', 'action/idle/random-02', 'action/idle/random-03', 'action/idle/random-04', 'action/idle/random-05'];

  let pet = null;        // the big pet at the bottom of a screen
  let petCanvas = null, petMode = '';
  let runner = null;     // the small Axie on the level path
  let actor = null;      // the Axie in a story scene
  let actorEl = null;
  let sceneTimers = [];

  const clear = () => { document.querySelectorAll('.axiepet').forEach(c => c.remove()); pet = petCanvas = null; petMode = ''; };
  /* show the big pet. mode: '' (level), 'bar' (boss fight), 'side' (waiting), 'win' (results) */
  const show = (mode, start, loop) => {
    clear();
    const bar = mode === 'bar' && document.querySelector('.bossbar');
    if (mode === 'bar' && !bar) mode = '';
    petCanvas = document.createElement('canvas'); petCanvas.className = 'axiepet ' + mode;
    if (bar) { bar.classList.add('hasaxie'); (bar.querySelector('.team') || bar.firstChild).after(petCanvas); }
    else document.body.append(petCanvas);
    petMode = mode;
    pet = Axie.mount(current(), petCanvas, { start, loop, flip: true, zoom: mode === 'win' ? 0.8 : 1 });
  };
  const play = (...names) => { if (pet) pet.play(one(names)); };

  /* ---------- a small button on the map to switch the pet ---------- */
  const btn = document.createElement('button'); btn.className = 'axiepick';
  const label = () => { btn.textContent = '🐾 Pet: ' + current(); };
  btn.onclick = () => {
    localStorage.setItem('axie-pet', NAMES[(NAMES.indexOf(current()) + 1) % NAMES.length]); label();
    if (pet) show(petMode, 'activity/appear');
  };
  label(); btn.style.display = 'none'; document.body.append(btn);


  /* ---------- waiting on the title, map and world screens ---------- */
  const wait = kind => {
    if (kind === 'title') show('side', 'activity/sleep', true);
    else if ((kind === 'map' || kind === 'world') && window.innerWidth >= 700) show('side', 'activity/appear');   // on a phone it would cover the cards
  };
  let kind = '';
  App.on('screen', ({ cls }) => {
    kind = cls.split(' ')[0];
    btn.style.display = kind === 'map' ? '' : 'none';     // the pet can be changed on the map
    clear(); runner = null; actor = null; actorEl = null;
    sceneTimers.forEach(clearTimeout); sceneTimers = [];
    wait(kind);
  });
  /* turning a tablet or phone: show or hide the waiting pet on the map and world screens */
  window.addEventListener('resize', () => {
    if (kind !== 'map' && kind !== 'world' || (window.innerWidth >= 700) === !!pet) return;
    if (pet) clear(); else wait(kind);
  });
  setInterval(() => { if (pet && petMode === 'side' && !document.querySelector('#app.title')) pet.play(one(IDLES)); }, 5000);   // small fidgets

  /* ---------- levels ---------- */
  App.on('level', ({ boss }) => {
    show(boss ? 'bar' : '', 'activity/appear');
    const r = !boss && document.querySelector('.runner');
    if (r) {            // a small Axie runs behind the hero on the path
      const cv = document.createElement('canvas'); cv.className = 'axierun'; r.append(cv);
      runner = Axie.mount(current(), cv, { flip: true });
    }
  });
  App.on('right', e => {
    if (e.boss) {
      play('attack/ranged/cast-fly', 'attack/ranged/cast-high', 'attack/melee/normal-attack');
      const face = document.querySelector('.bossface');
      if (face && petCanvas) setTimeout(() => { if (petCanvas && face.isConnected) shoot(petCanvas, face, '💥'); }, 350);
    } else {
      play('battle/get-buff', 'activity/eat-bite', ...IDLES.slice(0, 2));
      if (runner) runner.play('action/run');
    }
  });
  App.on('wrong', () => { play('defense/hit-by-normal', 'battle/get-debuff'); if (runner) runner.play('defense/hit-by-normal'); });
  App.on('win', () => show('win', 'activity/victory-pose-back-flip'));

  /* ---------- story scenes: the Axie stands beside the hero and reacts ---------- */
  const joinScene = c => {
    if (actor) return;
    const cv = document.createElement('canvas');
    const el = document.createElement('div'); el.className = 'actor axieactor'; el.append(cv);
    c.scene.querySelector('.actors').prepend(el);
    actorEl = el;
    try { el.animate([{ translate: '-70vw 0' }, { translate: '0 0' }], { duration: 700, easing: 'ease-out' }); } catch (e) {}
    actor = Axie.mount(current(), cv, { flip: true, start: 'action/run' });
  };
  /* only moves that stay in place: the back flip, the dodge and the big hit travel too far for the small story frame */
  const REACT = {
    gloomsfly: 'battle/get-debuff', crack: 'defense/hit-by-normal-crit', towerdown: 'defense/hit-by-normal', magicoops: 'defense/hit-by-ranged-attack',
    snowburst: 'battle/get-buff', notes: 'activity/prepare', notesdrop: 'battle/get-debuff', questions: 'action/idle/random-02',
    towerup: 'action/idle/random-03', powerup: 'battle/get-buff', starjoin: 'activity/evolve', glows: 'activity/prepare', party: 'activity/evolve',
  };
  App.on('scene', ({ id, c }) => { if (id !== 'intro') joinScene(c); });        // in the intro it arrives with the hero
  App.on('line', ({ who, c }) => { if (who === 'hero') joinScene(c); });
  App.on('fx', ({ name }) => {
    if (!actor) return;
    if (name === 'shard') {          // step to the side, watch the Gloom, flip when the shard pops out, cheer when the star is filled
      if (actorEl) { actorEl.style.translate = '-32vw 0'; sceneTimers.push(setTimeout(() => { if (actorEl) actorEl.style.translate = ''; }, 6300)); }
      actor.play('battle/get-debuff');
      sceneTimers.push(setTimeout(() => actor && actor.play('battle/get-buff'), 1900));
      sceneTimers.push(setTimeout(() => actor && actor.play('activity/evolve'), 4700));
    } else if (REACT[name]) actor.play(REACT[name]);
  });

  /* ---------- Chimeras are the enemies ----------
     The game draws every Gloom with Art.gloom(). Here that function is swapped for one
     that returns an animated Chimera instead. Each world has its own Chimera. */
  const ENEMY = ['wolf-gray', 'treant', 'wolf-aquatic', 'treant-flowering'], KING = 'bear-mom', MINI = 'slime';
  const HAPPY = 'battle/get-buff', HIT = 'defense/hit-by-normal', ATTACK = 'attack/melee/normal-attack';
  let world = -1, lastRight = 0;
  const svgGloom = Art.gloom;
  Art.gloom = function (o) {
    o = o || {};
    const name = o.king ? KING : (world >= 0 && world < 4 ? ENEMY[world] : MINI);
    const happy = (o.mood || 0) >= 0.6, justHit = Date.now() - lastRight < 1200;
    return `<canvas class="char" data-spine="${name}" data-zoom="1.25" data-anim="${justHit ? HIT : happy ? HAPPY : ''}" data-loop="${!justHit && happy ? 1 : 0}" data-idle="${happy ? HAPPY : ''}" data-mood="${o.mood || 0}" data-king="${o.king ? 1 : 0}"></canvas>`;
  };
  /* the Chimera files could not be loaded (offline before they were saved): draw the old Gloom so the enemy is not missing */
  document.addEventListener('spinefail', e => {
    const cv = e.target;
    if (cv.dataset.mood != null && cv.parentNode) cv.outerHTML = svgGloom({ mood: +cv.dataset.mood, king: cv.dataset.king === '1' });
  });
  App.on('scene', ({ id }) => { world = WORLDS.findIndex(w => id.startsWith(w.id)); });
  App.on('level', ({ w, boss }) => {
    world = w;
    const face = boss && document.querySelector('.bossface');
    if (face) face.innerHTML = Art.gloom({ mood: 0, king: w === 4 });       // the first face was drawn before we knew the world
  });
  App.on('right', e => { if (e.boss) lastRight = Date.now(); });             // the next face the game draws starts with a "hit" move
  App.on('wrong', e => {
    if (!e.boss) return;
    setTimeout(() => { const cv = document.querySelector('.bossface canvas'); if (cv && cv._ctl) cv._ctl.play(ATTACK); });   // after the new face is set up
  });
  Axie.watch();

  /* the title screen was drawn before this file loaded */
  wait((document.getElementById('app').className.split(' ')[1]) || '');
})();
