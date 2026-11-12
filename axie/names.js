/* Wording for the Chimera enemies. The game text talks about "Glooms".
   Here they become Chimeras, and each boss gets its own name.
   The words are swapped when this file loads and when text is shown. To change a name, edit it here. */
'use strict';

(function () {
  /* name of the enemy in each world (0 to 3), and the last boss */
  const KIND = ['Wolf', 'Treant', 'Koi Wolf', 'Flower Treant'];
  const BOSS = 'Mama Grumble';

  /* 1. whole lines that need new words (old text -> new text) */
  const LINES = {
    'The Glooms were never grumpy again. Now they are called the Glows.': 'The Chimeras were never grumpy again. Now they are friends with everyone.',
    'See? He is not bad. He is lonely.': 'See? She is not bad. She is lonely.',
    'Let us show him what friends can do.': 'Let us show her what friends can do.',
    'Hmm. Why is this Gloom so sad? I want to know.': 'Hmm. Why is this treant so sad? I want to know.',
  };
  /* 2. small swaps used everywhere else (in this order) */
  const SWAPS = [
    [/King Grumble/g, BOSS], [/the Gloom King/g, BOSS], [/The Gloom King/g, BOSS],
    [/Glooms/g, 'Chimeras'], [/Gloom/g, 'Chimera'], [/Glows/g, 'friends'], [/\bGlow\b/g, 'friend'],
  ];
  const fix = text => {
    if (typeof text !== 'string' || !/Glo|Grumble/.test(text)) return text;
    if (LINES[text]) return LINES[text];
    return SWAPS.reduce((t, [re, to]) => t.replace(re, to), text);
  };

  /* ---- the story ---- */
  Object.values(STORY).forEach(lines => lines.forEach(L => { if (L[0] !== 'fx') L[1] = fix(L[1]); }));

  /* ---- world and level names ---- */
  const bossText = [
    ['Frosty Wolf', 'A grumpy wolf has the star shard! Answer well to cheer it up.'],
    ['Rocky Treant', 'This treant sits on the shard. Cheer it up!'],
    ['Noisy Koi Wolf', 'It is show time. Sing the koi wolf happy!'],
    ['Sneaky Flower Treant', 'This flower treant hides in the meadow. Cheer it up!'],
    [BOSS, BOSS + ' has the last shard. Show her what friends can do!'],
    ['Stormy', 'Stormy rumbles in the clouds. Cheer Stormy up!'],
  ];
  WORLDS.forEach((W, w) => {
    W.name = fix(W.name);
    W.levels.forEach(L => {
      if (L.t === 'boss') { L.name = bossText[w][0]; L.intro = bossText[w][1]; }
      else { L.name = fix(L.name); L.intro = fix(L.intro); if (L.prompt) L.prompt = fix(L.prompt); }
    });
  });

  /* ---- name tags in the story scenes ---- */
  let world = -1;
  App.on('scene', ({ id }) => { world = WORLDS.findIndex(w => id.startsWith(w.id)); });
  App.on('level', ({ w }) => { world = w; });
  const kind = () => KIND[world] || 'Chimera';
  CAST.gloom.name = () => 'Grumpy ' + kind();
  CAST.glow.name = () => 'Happy ' + kind();
  CAST.grumble.name = () => BOSS;

  /* ---- the voice ---- */
  const say = Voice.say.bind(Voice);
  Voice.say = (text, who) => say(fix(text), who);

  /* ---- words that are written inside the game code (buttons, results, and so on):
          swap them when they appear on the page ---- */
  const fixNode = node => {
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let t; while ((t = walk.nextNode())) { const v = fix(t.nodeValue); if (v !== t.nodeValue) t.nodeValue = v; }
  };
  new MutationObserver(list => list.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType === 3) { const v = fix(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    else if (n.nodeType === 1) fixNode(n);
  }))).observe(document.body, { childList: true, subtree: true });
  fixNode(document.body);
})();
