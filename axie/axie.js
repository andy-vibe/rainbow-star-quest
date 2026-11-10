/* Animated Axies and Chimeras (Spine 3.8 files), drawn on a canvas with the Spine canvas player in axie/spine/.
   The art is in axie/art/. See axie/README.md for where it comes from. */
'use strict';

const Axie = {
  /* name: [folder, file name without ending] */
  LIST: {
    buba: ['art/buba/', 'buba'],
    puffy: ['art/puffy/', '03-puffy-aquatic'],
    xia: ['art/xia/', 'xia'],
    bing: ['art/bing/', 'bing'],
  },
  /* Chimeras, used as the enemies */
  ENEMIES: {
    'wolf-gray': ['art/wolf-gray/', 'wolf-gray'],
    'treant': ['art/treant/', 'treant'],
    'wolf-aquatic': ['art/wolf-aquatic/', 'wolf-aquatic'],
    'treant-flowering': ['art/treant-flowering/', 'treant-flowering'],
    'bear-mom': ['art/bear-mom/', 'bear-mom'],
    'slime': ['art/slime/', 'slime'],
  },
  IDLE: 'action/idle/normal',
  base: (document.currentScript && document.currentScript.src.replace(/[^/]*$/, '')) || 'axie/',
  cache: {},

  /* load the 3 files of one Axie (json, atlas, png). Returns a promise. */
  load(name) {
    if (this.cache[name]) return this.cache[name];
    const [dir, file] = this.LIST[name] || this.ENEMIES[name], p = this.base + dir + file;
    const image = new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => bad(new Error('no image ' + p)); i.src = p + '.png'; });
    return this.cache[name] = Promise.all([fetch(p + '.json').then(r => r.text()), fetch(p + '.atlas.txt').then(r => r.text()), image]).then(([json, atlasText, img]) => {
      const atlas = new spine.TextureAtlas(atlasText, () => new spine.canvas.CanvasTexture(img));
      const data = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(json);
      return { data, mesh: /"type"\s*:\s*"mesh"/.test(json) };   // mesh parts need the slower triangle drawing
    });
  },

  /* draw an Axie on a canvas and keep it moving. Returns a small remote control:
     ctl.play(animation, loop) and ctl.anims (the list of animation names). */
  mount(name, canvas, opts = {}) {
    const idle = opts.idle || this.IDLE;       // the move it goes back to
    let pending = null;                         // a move asked for before the files were loaded
    const ctl = { anims: [], ready: false, play(anim, loop) { pending = [anim, loop]; }, name };
    this.load(name).then(({ data, mesh }) => {
      const sk = new spine.Skeleton(data);
      sk.scaleY = -1;                         // the canvas has y pointing down
      if (opts.flip) sk.scaleX = -1;          // look to the left
      const sd = new spine.AnimationStateData(data); sd.defaultMix = 0.15;
      const st = new spine.AnimationState(sd);
      st.setAnimation(0, data.findAnimation(idle) ? idle : this.IDLE, true);
      const ctx = canvas.getContext('2d');
      const r = new spine.canvas.SkeletonRenderer(ctx); r.triangleRendering = mesh;
      sk.setToSetupPose(); sk.updateWorldTransform();
      const off = new spine.Vector2(), size = new spine.Vector2(); sk.getBounds(off, size, []);

      ctl.anims = data.animations.map(a => a.name);
      ctl.ready = true;
      ctl.play = (anim, loop) => {
        if (!data.findAnimation(anim)) return false;
        st.setAnimation(0, anim, !!loop);
        if (!loop) st.addAnimation(0, data.findAnimation(idle) ? idle : this.IDLE, true, 0);   // go back to idle after
        return true;
      };
      if (opts.start) ctl.play(opts.start, opts.loop);
      if (pending) ctl.play(pending[0], pending[1]);
      if (opts.onReady) opts.onReady(ctl);

      let last = performance.now(), seen = false, waited = 0;
      const frame = now => {
        if (canvas.isConnected) seen = true;
        else if (seen || ++waited > 600) return;              // the canvas left the page: stop
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.round(canvas.clientWidth * dpr), hh = Math.round(canvas.clientHeight * dpr);
        if (w && hh) {
          if (canvas.width !== w || canvas.height !== hh) { canvas.width = w; canvas.height = hh; }
          st.update(dt); st.apply(sk); sk.updateWorldTransform();
          ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, hh);
          const s = Math.min(w * 0.78 / size.x, hh * 0.6 / size.y) * (opts.zoom || 1);  // leave room for jumps
          ctx.translate(w / 2, hh * 0.93); ctx.scale(s, s);
          ctx.translate(-(off.x + size.x / 2), -(off.y + size.y));
          r.draw(sk);
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }).catch(e => { console.error('Axie could not load:', name, e); });
    return ctl;
  },

  /* Any <canvas data-spine="name"> that appears on the page is drawn by itself.
     Extra settings: data-anim (first move), data-loop, data-idle, data-flip, data-zoom. */
  watch() {
    const start = cv => {
      if (cv._ctl) return;
      const d = cv.dataset;
      cv._ctl = this.mount(d.spine, cv, { start: d.anim || null, loop: d.loop === '1', idle: d.idle || null, flip: d.flip === '1', zoom: +d.zoom || 1 });
    };
    const scan = node => { if (node.nodeType !== 1) return; if (node.matches('canvas[data-spine]')) start(node); node.querySelectorAll('canvas[data-spine]').forEach(start); };
    new MutationObserver(list => list.forEach(m => m.addedNodes.forEach(scan))).observe(document.body, { childList: true, subtree: true });
    scan(document.body);
  },
};
