/* All the learning content and the story live in this file.
   A parent can add words, sentences or questions here. */
'use strict';

/* ---------- WORDS: [word, picture] grouped by number of letters ---------- */
const WORDS = {
  3: [['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'], ['hat', '🎩'], ['bus', '🚌'], ['pig', '🐷'], ['bed', '🛏️'], ['box', '📦'], ['fox', '🦊'], ['bee', '🐝'], ['egg', '🥚'], ['ant', '🐜'], ['bat', '🦇'], ['cow', '🐮'], ['key', '🔑'], ['car', '🚗'], ['owl', '🦉'], ['ice', '🧊'], ['hen', '🐔'], ['map', '🗺️'], ['nut', '🥜'], ['cup', '🥤'], ['pen', '🖊️'], ['bug', '🐛']],
  4: [['frog', '🐸'], ['fish', '🐟'], ['cake', '🎂'], ['star', '⭐'], ['moon', '🌙'], ['tree', '🌳'], ['duck', '🦆'], ['bear', '🐻'], ['book', '📖'], ['ball', '⚽'], ['bird', '🐦'], ['snow', '❄️'], ['ship', '🚢'], ['milk', '🥛'], ['rain', '🌧️'], ['lion', '🦁'], ['ring', '💍'], ['drum', '🥁'], ['kite', '🪁'], ['sock', '🧦'], ['door', '🚪'], ['leaf', '🍃'], ['corn', '🌽'], ['bell', '🔔'], ['rose', '🌹'], ['crab', '🦀'], ['gift', '🎁'], ['fire', '🔥']],
  5: [['apple', '🍎'], ['house', '🏠'], ['horse', '🐴'], ['tiger', '🐯'], ['train', '🚂'], ['cloud', '☁️'], ['heart', '❤️'], ['snake', '🐍'], ['mouse', '🐭'], ['pizza', '🍕'], ['robot', '🤖'], ['bread', '🍞'], ['chair', '🪑'], ['crown', '👑'], ['panda', '🐼'], ['whale', '🐳'], ['grape', '🍇'], ['lemon', '🍋'], ['zebra', '🦓'], ['shirt', '👕'], ['sheep', '🐑'], ['plane', '✈️'], ['candy', '🍬'], ['koala', '🐨']],
  6: [['rabbit', '🐰'], ['flower', '🌸'], ['monkey', '🐵'], ['banana', '🍌'], ['rocket', '🚀'], ['castle', '🏰'], ['dragon', '🐉'], ['guitar', '🎸'], ['pencil', '✏️'], ['cookie', '🍪'], ['turtle', '🐢'], ['spider', '🕷️'], ['orange', '🍊'], ['carrot', '🥕'], ['candle', '🕯️'], ['cheese', '🧀'], ['planet', '🪐'], ['kitten', '🐱'], ['window', '🪟'], ['ladder', '🪜']],
  7: [['rainbow', '🌈'], ['unicorn', '🦄'], ['penguin', '🐧'], ['dolphin', '🐬'], ['balloon', '🎈'], ['diamond', '💎'], ['giraffe', '🦒'], ['snowman', '⛄'], ['cupcake', '🧁'], ['octopus', '🐙'], ['popcorn', '🍿'], ['volcano', '🌋']],
};

/* Words that rhyme (same ending sound) */
const RHYMES = [
  ['cat', 'hat', 'bat', 'mat', 'rat'], ['dog', 'log', 'frog', 'fog'], ['sun', 'run', 'bun', 'fun'], ['pig', 'big', 'wig', 'dig'],
  ['hen', 'pen', 'ten', 'men'], ['cake', 'lake', 'snake', 'rake'], ['king', 'ring', 'sing', 'wing'], ['star', 'car', 'jar', 'far'],
  ['bee', 'tree', 'see', 'three'], ['boat', 'goat', 'coat'], ['rain', 'train', 'chain'], ['light', 'night', 'kite', 'bright'],
  ['house', 'mouse'], ['sock', 'clock', 'rock', 'block'], ['bell', 'shell', 'well', 'spell'], ['book', 'cook', 'look', 'hook'],
  ['snow', 'grow', 'blow', 'glow'], ['moon', 'spoon', 'soon'], ['ice', 'mice', 'nice', 'rice'],
];

/* Opposites */
const OPPOSITES = [['hot', 'cold'], ['big', 'small'], ['up', 'down'], ['happy', 'sad'], ['day', 'night'], ['fast', 'slow'], ['open', 'closed'], ['wet', 'dry'], ['light', 'dark'], ['full', 'empty'], ['young', 'old'], ['soft', 'hard'], ['loud', 'quiet'], ['tall', 'short'], ['clean', 'dirty'], ['first', 'last']];

/* ---------- SENTENCES ---------- */
/* Put the words in order. One list for each difficulty step (1 to 5). */
const SENT_ORDER = {
  1: [['I see a cat.', '🐱'], ['The sun is hot.', '☀️'], ['The dog can run.', '🐶'], ['We play ball.', '⚽'], ['I am happy.', '😊'], ['The fish can swim.', '🐟'], ['It is a hat.', '🎩'], ['The bee is small.', '🐝'], ['I love my mom.', '❤️'], ['The frog can jump.', '🐸'], ['Snow is cold.', '❄️'], ['I like red apples.', '🍎']],
  2: [['My dog likes to play.', '🐶'], ['I can see the moon.', '🌙'], ['She has a red ball.', '🔴'], ['We go to the park.', '🌳'], ['The duck swims in water.', '🦆'], ['He eats a big cake.', '🎂'], ['I like to read books.', '📖'], ['The star is very bright.', '⭐'], ['My cat drinks milk.', '🥛'], ['The bus is yellow.', '🚌'], ['Bears like to eat fish.', '🐻'], ['The snow is so soft.', '❄️']],
  3: [['The cat sat on the mat.', '🐱'], ['The bird sings in the tree.', '🐦'], ['I like to play with blocks.', '🧱'], ['The little frog jumps very high.', '🐸'], ['We made a big snowman today.', '⛄'], ['My friend has a pink kite.', '🪁'], ['The rabbit eats an orange carrot.', '🐰'], ['The moon shines at night.', '🌙'], ['Can you see the rainbow?', '🌈'], ['Where is my blue hat?', '🎩'], ['The kitten plays with the ball.', '🐱']],
  4: [['The brave girl sings a happy song.', '🎤'], ['My little kitten likes to chase butterflies.', '🦋'], ['We build a tall tower with blocks.', '🧱'], ['The snow falls softly on the hill.', '🏔️'], ['Do you want to play with me?', '🤝'], ['The penguin slides down the icy hill.', '🐧'], ['I gave my friend a big hug.', '🤗'], ['The singer danced on the bright stage.', '💃'], ['A rainbow comes out after the rain.', '🌈']],
  5: [['The stars come out when it is dark.', '🌟'], ['My friends and I love to sing together.', '🎶'], ['The little kitten found a shiny gold key.', '🔑'], ['We can do anything if we work together.', '💪'], ['The ice castle sparkles in the morning sun.', '🏰'], ['Why do the birds fly south in winter?', '🐦'], ['Plants need water and sunlight to grow big.', '🌱'], ['The brave princess was not afraid of mistakes.', '👑']],
};
/* Pick the right word: [sentence, right, wrong, wrong]. Three groups: easy, middle, hard. */
const SENT_BLANK = {
  easy: [['The cat ___ big.', 'is', 'are', 'am'], ['I ___ a girl.', 'am', 'is', 'are'], ['The dogs ___ running.', 'are', 'is', 'am'], ['A fish can ___.', 'swim', 'fly', 'sing'], ['The sun is ___.', 'hot', 'cold', 'wet'], ['Ice is ___.', 'cold', 'hot', 'loud'], ['I see with my ___.', 'eyes', 'ears', 'nose'], ['A frog can ___.', 'jump', 'read', 'drive'], ['We ___ to school.', 'go', 'goes', 'going'], ['I hear with my ___.', 'ears', 'eyes', 'hands']],
  mid: [['She ___ a red hat.', 'has', 'have', 'having'], ['They ___ playing in the snow.', 'are', 'is', 'am'], ['The kitten ___ milk every day.', 'drinks', 'drink', 'drinking'], ['Yesterday we ___ to the park.', 'went', 'go', 'goes'], ['He ___ very fast.', 'runs', 'run', 'running'], ['I have two ___.', 'cats', 'cat', 'cates'], ['The girl ___ a song.', 'sings', 'sing', 'singing'], ['We ___ happy today.', 'are', 'is', 'am'], ['The snow ___ white.', 'is', 'are', 'be'], ['Birds ___ in the sky.', 'fly', 'flies', 'flying']],
  hard: [['Yesterday I ___ a snowman.', 'built', 'build', 'builds'], ['The cat is ___ than the mouse.', 'bigger', 'big', 'biggest'], ['The turtle walks ___.', 'slowly', 'slow', 'slower'], ['We ___ going to build a castle.', 'are', 'is', 'am'], ['The girls ___ their song last night.', 'sang', 'sing', 'sings'], ['This is the ___ tower in the valley.', 'tallest', 'tall', 'taller'], ['I ___ my teeth every morning.', 'brush', 'brushes', 'brushing'], ['Mochi ___ not like the rain.', 'does', 'do', 'doing'], ['There ___ three birds in the tree.', 'are', 'is', 'am'], ['Tomorrow we ___ visit the castle.', 'will', 'did', 'was']],
};
/* Which mark goes at the end? */
const SENT_PUNCT = [['What is your name', '?'], ['I like ice cream', '.'], ['Wow, that is amazing', '!'], ['Where is the kitten', '?'], ['The sky is blue', '.'], ['Watch out', '!'], ['Can you help me', '?'], ['We are friends', '.'], ['How old are you', '?'], ['Hooray, we did it', '!'], ['My hat is pink', '.'], ['Who took the star', '?']];
/* Which sentence matches the picture? */
const SENT_PICTURE = [['🐶⚽', 'The dog has a ball.'], ['🐱🥛', 'The cat drinks milk.'], ['🐸🌧️', 'The frog is in the rain.'], ['👧📖', 'The girl reads a book.'], ['🐻🍯', 'The bear eats honey.'], ['🐦🌳', 'The bird is in the tree.'], ['🐟🌊', 'The fish swims in the sea.'], ['🐰🥕', 'The rabbit eats a carrot.'], ['⛄🎩', 'The snowman has a hat.'], ['🐵🍌', 'The monkey eats a banana.'], ['👦🚲', 'The boy rides a bike.'], ['🐥🥚', 'The chick came out of the egg.']];

/* ---------- SCIENCE ---------- */
/* Sorting: tier, question, bins, items [picture, name, bin number, fun fact] */
const SCI_SORT = [
  { tier: 1, q: 'Is it alive or not alive?', bins: ['🌱 Alive', '🪨 Not alive'], items: [['🐱', 'cat', 0], ['🌳', 'tree', 0], ['🐦', 'bird', 0], ['🌻', 'flower', 0], ['🐟', 'fish', 0], ['🐛', 'bug', 0], ['🪨', 'rock', 1], ['🚗', 'car', 1], ['🧸', 'teddy bear', 1], ['⚽', 'ball', 1], ['🪑', 'chair', 1], ['📱', 'phone', 1]] },
  { tier: 1, q: 'Is it hot or cold?', bins: ['🔥 Hot', '❄️ Cold'], items: [['☀️', 'sun', 0], ['🔥', 'fire', 0], ['☕', 'hot tea', 0], ['🍲', 'soup', 0], ['🌋', 'volcano', 0], ['🧊', 'ice', 1], ['⛄', 'snowman', 1], ['🍦', 'ice cream', 1], ['❄️', 'snowflake', 1], ['🧃', 'cold juice', 1]] },
  { tier: 1, q: 'Is it an animal or a plant?', bins: ['🐾 Animal', '🌿 Plant'], items: [['🐶', 'dog', 0], ['🐸', 'frog', 0], ['🐝', 'bee', 0], ['🐘', 'elephant', 0], ['🐢', 'turtle', 0], ['🌳', 'tree', 1], ['🌵', 'cactus', 1], ['🌻', 'sunflower', 1], ['🌷', 'tulip', 1], ['🍀', 'clover', 1], ['🌴', 'palm tree', 1]] },
  { tier: 1, q: 'Do we see it in the day or at night?', bins: ['☀️ Day', '🌙 Night'], items: [['☀️', 'sun', 0], ['🌈', 'rainbow', 0], ['🐓', 'rooster call', 0], ['🏫', 'school time', 0], ['🌙', 'moon', 1], ['⭐', 'stars', 1], ['🦉', 'owl', 1, 'Owls sleep in the day and hunt at night.'], ['🦇', 'bat', 1], ['🛌', 'bedtime', 1]] },
  { tier: 2, q: 'Where does it live or move the most?', bins: ['🏞️ Land', '🌊 Water', '☁️ Sky'], items: [['🐟', 'fish', 1], ['🐙', 'octopus', 1], ['🦈', 'shark', 1], ['🐬', 'dolphin', 1], ['🐘', 'elephant', 0], ['🦁', 'lion', 0], ['🐴', 'horse', 0], ['🐰', 'rabbit', 0], ['🦅', 'eagle', 2], ['🦋', 'butterfly', 2], ['🐝', 'bee', 2]] },
  { tier: 2, q: 'Will it float or sink in water?', bins: ['🛟 Float', '⚓ Sink'], items: [['🪵', 'wood', 0, 'Wood is lighter than water, so it floats.'], ['🦆', 'rubber duck', 0], ['🍃', 'leaf', 0], ['⚽', 'ball', 0, 'The ball is full of air. Air helps it float.'], ['🪶', 'feather', 0], ['🪨', 'rock', 1], ['🔑', 'key', 1], ['🪙', 'coin', 1], ['🔨', 'hammer', 1], ['🥄', 'metal spoon', 1]] },
  { tier: 2, q: 'Is it a fruit or a vegetable?', bins: ['🍎 Fruit', '🥕 Vegetable'], items: [['🍌', 'banana', 0], ['🍇', 'grapes', 0], ['🍓', 'strawberry', 0], ['🍊', 'orange', 0], ['🍉', 'watermelon', 0], ['🥕', 'carrot', 1], ['🥦', 'broccoli', 1], ['🥔', 'potato', 1], ['🧅', 'onion', 1], ['🥬', 'lettuce', 1]] },
  { tier: 3, q: 'Is it a solid, a liquid or a gas?', bins: ['🧱 Solid', '💧 Liquid', '💨 Gas'], items: [['🧊', 'ice', 0, 'Ice is water that is frozen solid.'], ['🪨', 'rock', 0], ['🍪', 'cookie', 0], ['🧱', 'brick', 0], ['💧', 'water', 1], ['🥛', 'milk', 1], ['🧃', 'juice', 1], ['🍯', 'honey', 1, 'Honey is a thick, slow liquid.'], ['💨', 'air', 2], ['♨️', 'steam', 2, 'Steam is water that became a gas.'], ['🎈', 'gas in a balloon', 2]] },
  { tier: 3, q: 'What does a plant need to grow?', bins: ['✅ Needs it', '❌ Does not need it'], items: [['☀️', 'sunlight', 0], ['💧', 'water', 0], ['🌬️', 'air', 0], ['🟤', 'soil', 0], ['🍕', 'pizza', 1], ['📺', 'TV', 1], ['🧸', 'toys', 1], ['🍭', 'candy', 1], ['👟', 'shoes', 1]] },
  { tier: 3, q: 'Will a magnet pull it?', bins: ['🧲 Yes', '🚫 No'], items: [['📎', 'paper clip', 0, 'Magnets pull things made of iron or steel.'], ['🔩', 'steel bolt', 0], ['🧷', 'safety pin', 0], ['🔑', 'iron key', 0], ['🪵', 'wood', 1], ['📄', 'paper', 1], ['🧦', 'sock', 1], ['🍎', 'apple', 1], ['✏️', 'pencil', 1], ['🥤', 'plastic cup', 1]] },
  { tier: 3, q: 'Is it for winter or summer?', bins: ['⛄ Winter', '🏖️ Summer'], items: [['🧣', 'scarf', 0], ['🧤', 'gloves', 0], ['⛷️', 'skiing', 0], ['🧥', 'warm coat', 0], ['☃️', 'snowman', 0], ['🩴', 'flip-flops', 1], ['😎', 'sunglasses', 1], ['🍉', 'watermelon', 1], ['🏊', 'swimming', 1], ['🧴', 'sunscreen', 1]] },
  { tier: 4, q: 'What does it eat?', bins: ['🌿 Plants', '🍖 Meat'], items: [['🐰', 'rabbit', 0], ['🐮', 'cow', 0], ['🦒', 'giraffe', 0], ['🐘', 'elephant', 0, 'Elephants eat plants all day long.'], ['🐑', 'sheep', 0], ['🦁', 'lion', 1], ['🐯', 'tiger', 1], ['🦈', 'shark', 1], ['🦅', 'eagle', 1], ['🐊', 'crocodile', 1], ['🐺', 'wolf', 1]] },
  { tier: 4, q: 'Is it from nature or made by people?', bins: ['🌍 Nature', '🛠️ Made by people'], items: [['🌳', 'tree', 0], ['🪨', 'rock', 0], ['🌊', 'sea', 0], ['☁️', 'cloud', 0], ['🏔️', 'mountain', 0], ['🚗', 'car', 1], ['🏠', 'house', 1], ['📱', 'phone', 1], ['🌉', 'bridge', 1], ['👟', 'shoe', 1], ['🪑', 'chair', 1]] },
  { tier: 4, q: 'Is it a bird, a mammal or a fish?', bins: ['🪶 Bird', '🐾 Mammal', '🐟 Fish'], items: [['🦆', 'duck', 0], ['🦉', 'owl', 0], ['🐧', 'penguin', 0, 'Penguins are birds, but they swim and do not fly.'], ['🐶', 'dog', 1], ['🐘', 'elephant', 1], ['🐳', 'whale', 1, 'Whales are mammals. They breathe air like us!'], ['🦇', 'bat', 1, 'Bats are mammals that can fly.'], ['🐠', 'clownfish', 2], ['🦈', 'shark', 2], ['🐟', 'trout', 2]] },
  { tier: 5, q: 'Which bin does it go in?', bins: ['📄 Paper', '🥤 Plastic and metal', '🍌 Food scraps'], items: [['📰', 'newspaper', 0], ['📦', 'cardboard box', 0], ['✉️', 'envelope', 0], ['🧴', 'plastic bottle', 1], ['🥫', 'metal can', 1], ['🥤', 'plastic cup', 1], ['🍌', 'banana peel', 2, 'Food scraps can turn into soil. This is called compost.'], ['🍎', 'apple core', 2], ['🥚', 'egg shell', 2]] },
  { tier: 5, q: 'Does it make its own light?', bins: ['💡 Makes light', '🌑 No light of its own'], items: [['☀️', 'sun', 0], ['🔥', 'fire', 0], ['💡', 'lamp', 0], ['⭐', 'star', 0, 'Stars are suns that are very far away.'], ['🕯️', 'candle', 0], ['🌙', 'moon', 1, 'The moon shines because the sun lights it up.'], ['🪞', 'mirror', 1], ['🪨', 'rock', 1], ['💎', 'diamond', 1], ['🌍', 'Earth', 1]] },
  { tier: 5, q: 'Does it need electricity to work?', bins: ['🔌 Needs electricity', '🙌 Works without it'], items: [['📺', 'TV', 0], ['💡', 'lamp', 0], ['💻', 'computer', 0], ['📱', 'phone', 0], ['🚲', 'bike', 1], ['📖', 'book', 1], ['🕯️', 'candle', 1], ['⚽', 'ball', 1], ['🪁', 'kite', 1], ['🥁', 'drum', 1]] },
];
/* Put in order: tier, question, steps [picture, name] in the right order */
const SCI_ORDER = [
  { tier: 1, q: 'How does a chick grow? Put it in order.', steps: [['🥚', 'egg'], ['🐣', 'hatching'], ['🐥', 'chick'], ['🐔', 'hen']] },
  { tier: 1, q: 'How do people grow? Put it in order.', steps: [['👶', 'baby'], ['🧒', 'child'], ['🧑', 'grown-up'], ['🧓', 'grandparent']] },
  { tier: 2, q: 'How does a flower grow? Put it in order.', steps: [['🌰', 'seed'], ['🌱', 'sprout'], ['🌿', 'plant'], ['🌻', 'flower']] },
  { tier: 2, q: 'Smallest to biggest. Put them in order.', steps: [['🐜', 'ant'], ['🐭', 'mouse'], ['🐶', 'dog'], ['🐘', 'elephant'], ['🐳', 'whale']] },
  { tier: 2, q: 'One day, from start to end.', steps: [['🌅', 'sunrise'], ['☀️', 'noon'], ['🌇', 'sunset'], ['🌙', 'night']] },
  { tier: 3, q: 'How does a butterfly grow? Put it in order.', steps: [['🥚', 'egg'], ['🐛', 'caterpillar'], ['🟢', 'cocoon'], ['🦋', 'butterfly']] },
  { tier: 3, q: 'The seasons. Start with spring.', steps: [['🌸', 'spring'], ['☀️', 'summer'], ['🍂', 'autumn'], ['⛄', 'winter']] },
  { tier: 3, q: 'Make water hotter and hotter.', steps: [['🧊', 'ice'], ['💧', 'water'], ['♨️', 'steam']] },
  { tier: 4, q: 'How does rain happen? Put it in order.', steps: [['☀️', 'sun warms the sea'], ['♨️', 'water goes up'], ['☁️', 'clouds form'], ['🌧️', 'rain falls']] },
  { tier: 4, q: 'Who gives energy to who? Start with the sun.', steps: [['☀️', 'sun'], ['🌿', 'grass'], ['🐰', 'rabbit'], ['🦊', 'fox']] },
  { tier: 5, q: 'How does an apple tree grow?', steps: [['🌰', 'seed'], ['🌱', 'sprout'], ['🌳', 'tree'], ['🌸', 'blossom'], ['🍎', 'apple']] },
  { tier: 5, q: 'Smallest to biggest in space.', steps: [['🌙', 'moon'], ['🌍', 'Earth'], ['🪐', 'Jupiter'], ['☀️', 'sun']] },
];
/* Quiz: [question, right, wrong, wrong, fun fact] */
const SCI_QUIZ = {
  1: [
    ['What do we use to see?', '👀 eyes', '👂 ears', '👃 nose', 'Your eyes catch light. That is how you see!'],
    ['What do we use to hear?', '👂 ears', '👀 eyes', '👅 tongue', 'Your ears catch sounds from the air.'],
    ['What do we use to smell?', '👃 nose', '👂 ears', '🖐️ hands', 'Your nose can tell many smells apart.'],
    ['What falls from clouds?', '🌧️ rain', '🪨 rocks', '🍕 pizza', 'Clouds are made of tiny drops of water.'],
    ['Where does a fish live?', '🌊 in water', '🌳 in a tree', '🏜️ in sand', 'Fish breathe under water with gills.'],
    ['What does a cow give us?', '🥛 milk', '🍯 honey', '🥚 eggs', 'Milk can be made into cheese and butter.'],
    ['What is a baby cat called?', 'kitten', 'puppy', 'chick', 'A baby cat is a kitten. A baby dog is a puppy.'],
    ['How many legs does a cat have?', '4', '2', '6', 'Cats walk very softly on their four paws.'],
    ['What do you need when it rains?', '☂️ umbrella', '😎 sunglasses', '🩴 flip-flops', 'An umbrella keeps the rain off you.'],
  ],
  2: [
    ['What do bees make?', '🍯 honey', '🥛 milk', '🧀 cheese', 'Bees make honey from the sweet juice of flowers.'],
    ['What do plants drink?', '💧 water', '🥛 milk', '🧃 juice', 'Plants drink water with their roots.'],
    ['How many legs does a spider have?', '8', '6', '4', 'Spiders have 8 legs. Insects have 6 legs.'],
    ['What is ice made of?', '💧 frozen water', '🥛 frozen milk', '🧂 salt', 'When water gets very cold, it turns into ice.'],
    ['Which animal comes out of an egg?', '🐔 chicken', '🐶 dog', '🐱 cat', 'Birds, fish and frogs all come from eggs.'],
    ['What is a baby dog called?', 'puppy', 'kitten', 'cub', 'A baby bear is called a cub.'],
    ['Which animal is the biggest?', '🐳 blue whale', '🐘 elephant', '🦒 giraffe', 'The blue whale is the biggest animal ever!'],
    ['What does a caterpillar become?', '🦋 butterfly', '🐝 bee', '🐦 bird', 'A caterpillar changes inside a cocoon.'],
    ['Which part of a plant is under the ground?', 'roots', 'leaves', 'flowers', 'Roots hold the plant and drink water.'],
  ],
  3: [
    ['What happens to ice when it gets warm?', 'It melts', 'It grows', 'It turns to stone', 'Warm ice melts and becomes water.'],
    ['What do we breathe?', '💨 air', '💧 water', '🔥 fire', 'Air has oxygen. Our body needs it.'],
    ['What pulls things down to the ground?', 'gravity', 'wind', 'magic', 'Gravity pulls everything toward the Earth.'],
    ['Why do we have day and night?', 'The Earth spins', 'The sun turns off', 'Clouds hide the sun', 'The Earth spins around once every day.'],
    ['Which animal sleeps all winter?', '🐻 bear', '🐧 penguin', '🐺 wolf', 'A long winter sleep is called hibernation.'],
    ['What is a rainbow made of?', 'sunlight and rain', 'paint', 'candy', 'Rain drops split sunlight into colors.'],
    ['Which one is an insect?', '🐜 ant', '🕷️ spider', '🐌 snail', 'Insects have 6 legs. An ant is an insect.'],
    ['Blue and yellow mixed make...?', '🟢 green', '🟣 purple', '🟠 orange', 'Red and yellow make orange. Red and blue make purple.'],
    ['Which one is NOT alive?', '🪨 rock', '🌵 cactus', '🐌 snail', 'Living things grow, eat and make babies.'],
  ],
  4: [
    ['What does your heart do?', 'It pumps blood', 'It helps you see', 'It makes you hungry', 'Your heart beats about 100,000 times a day!'],
    ['What do your lungs help you do?', 'breathe', 'hear', 'taste', 'Lungs fill with air like two balloons.'],
    ['How many legs does an insect have?', '6', '8', '4', 'Ants, bees and butterflies all have 6 legs.'],
    ['What is the closest star to Earth?', '☀️ the sun', '🌙 the moon', 'Mars', 'The sun is a star. The moon is not a star.'],
    ['Animals that eat only plants are called...?', 'herbivores', 'carnivores', 'dinosaurs', 'Meat eaters are called carnivores.'],
    ['What makes a shadow?', 'Something blocks the light', 'The wind', 'Water', 'Light cannot go through you, so you make a shadow.'],
    ['Which planet do we live on?', '🌍 Earth', 'Mars', 'Jupiter', 'Earth is the only planet we know with life.'],
    ['What does a thermometer measure?', 'how hot or cold it is', 'how heavy it is', 'how tall it is', 'We measure hot and cold in degrees.'],
    ['Which animal is a mammal?', '🐬 dolphin', '🦈 shark', '🐸 frog', 'Dolphins breathe air and feed milk to their babies.'],
  ],
  5: [
    ['Why does the moon shine?', 'The sun lights it up', 'It is on fire', 'It has lamps', 'The moon is like a mirror for sunlight.'],
    ['What gas do plants give us?', 'oxygen', 'smoke', 'steam', 'Trees make oxygen. We need it to breathe.'],
    ['How long does the Earth take to go around the sun?', 'one year', 'one day', 'one week', 'One trip around the sun is one year. That is your birthday!'],
    ['What is the hardest part of your body?', '🦷 teeth', '👃 nose', '👂 ears', 'The outside of your teeth is harder than bone.'],
    ['What slows down a rolling ball?', 'friction', 'light', 'sound', 'Friction is the rubbing between two things.'],
    ['What does your brain do?', 'It thinks and controls your body', 'It pumps blood', 'It breaks down food', 'Your brain works even when you sleep.'],
    ['How many planets go around our sun?', '8', '5', '12', 'Earth is planet number 3 from the sun.'],
    ['What do plants use to make food?', '☀️ sunlight', '🍕 pizza', '🌙 moonlight', 'Leaves use sunlight, water and air to make food.'],
    ['Which planet is the biggest?', 'Jupiter', 'Earth', 'Mars', 'Jupiter is so big that 1,000 Earths could fit inside.'],
    ['Sound is made by...?', 'things that shake very fast', 'colors', 'shadows', 'Fast shaking is called vibration. Touch your throat and hum!'],
  ],
};

/* ---------- WORLDS, LEVELS AND STORY ---------- */
/* Level types: words, math, sentences, science, creative, boss */
const WORLDS = [
  { id: 'frost', name: 'Frost Peaks', emoji: '🏔️', host: 'lumi', tier: 1, float: ['❄️', '❄️', '🌨️', '⛄', '❄️'],
    levels: [
      { t: 'words', name: 'Frozen Words', icon: '🔤', intro: 'The Glooms froze the words! Spell them to melt the ice.' },
      { t: 'math', name: 'Snowball Count', icon: '🔢', intro: 'Count the blocks to build an ice bridge.' },
      { t: 'science', name: 'Hot and Cold', icon: '🔬', intro: 'What melts my ice? Let us find out!' },
      { t: 'sentences', name: 'Snow Song', icon: '📝', intro: 'The wind mixed up my song. Put the words in order.' },
      { t: 'creative', tool: 'builder', name: 'Ice Castle', icon: '🎨', intro: 'Use your ideas!', prompt: 'Build an ice castle for Lumi. Any shape you like!' },
      { t: 'boss', name: 'Frosty Gloom', icon: '👾', intro: 'A Gloom has the star shard! Answer well to cheer it up.' },
    ] },
  { id: 'block', name: 'Block Valley', emoji: '🟩', host: 'pix', tier: 2, float: ['🟩', '🟫', '🟦', '🟨', '🟧'],
    levels: [
      { t: 'math', name: 'Block Counting', icon: '🔢', intro: 'Count first, then build. Help me count!' },
      { t: 'words', name: 'Word Bricks', icon: '🔤', intro: 'Each brick has a letter. Build the words!' },
      { t: 'sentences', name: 'Sign Posts', icon: '📝', intro: 'The signs are broken. Fix the sentences.' },
      { t: 'science', name: 'Float or Sink', icon: '🔬', intro: 'What can cross the river? Let us test.' },
      { t: 'creative', tool: 'pet', name: 'Invent a Pet', icon: '🎨', intro: 'Use your ideas!', prompt: 'Invent a new animal friend for Pix!' },
      { t: 'boss', name: 'Rocky Gloom', icon: '👾', intro: 'This Gloom sits on the shard. Cheer it up!' },
    ] },
  { id: 'star', name: 'Star City', emoji: '🎤', host: 'nova', tier: 3, float: ['🎵', '🎶', '⭐', '💖', '🎵'],
    levels: [
      { t: 'sentences', name: 'Lost Lyrics', icon: '📝', intro: 'The Glooms mixed up our song. Fix the lines!' },
      { t: 'math', name: 'Tens and Ones', icon: '🔢', intro: 'Count the fans! Use tens and ones.' },
      { t: 'words', name: 'Rhyme Time', icon: '🔤', intro: 'A good song needs good words.' },
      { t: 'science', name: 'Sound and Light', icon: '🔬', intro: 'How does the stage work? Let us learn.' },
      { t: 'creative', tool: 'song', name: 'Write a Song', icon: '🎨', intro: 'Use your ideas!', prompt: 'Make your own song for the Starlights!' },
      { t: 'boss', name: 'Noisy Gloom', icon: '👾', intro: 'It is show time. Sing the Gloom happy!' },
    ] },
  { id: 'meadow', name: 'Ribbon Meadow', emoji: '🌸', host: 'mochi', tier: 4, float: ['🌸', '🦋', '🌼', '🎀', '🌷'],
    levels: [
      { t: 'science', name: 'Why, Why, Why?', icon: '🔬', intro: 'I have so many questions! Help me answer them.' },
      { t: 'math', name: 'Flower Shop', icon: '🔢', intro: 'How many flowers? These numbers are bigger!' },
      { t: 'words', name: 'Big Words', icon: '🔤', intro: 'I found long words in my book.' },
      { t: 'sentences', name: 'Letter to a Friend', icon: '📝', intro: 'Let us write a kind letter.' },
      { t: 'creative', tool: 'scene', name: 'Party Picture', icon: '🎨', intro: 'Use your ideas!', prompt: 'Make a party picture. Who will come?' },
      { t: 'boss', name: 'Sneaky Gloom', icon: '👾', intro: 'This Gloom hides in the flowers. Cheer it up!' },
    ] },
  { id: 'castle', name: 'Gloom Castle', emoji: '🏰', host: 'twinkle', tier: 5, float: ['⭐', '🌙', '✨', '🦇', '⭐'],
    levels: [
      { t: 'words', name: 'The Word Gate', icon: '🔤', intro: 'Spell the words to open the gate.' },
      { t: 'math', name: 'The Number Stairs', icon: '🔢', intro: 'Each step is a number puzzle.' },
      { t: 'sentences', name: 'The Song Hall', icon: '📝', intro: 'Fix the lines on the wall.' },
      { t: 'science', name: 'The Star Lab', icon: '🔬', intro: 'Use what you know about the world.' },
      { t: 'creative', tool: 'story', name: 'Tell a Story', icon: '🎨', intro: 'Use your ideas!', prompt: 'Make a story for King Grumble.' },
      { t: 'boss', name: 'King Grumble', icon: '👑', intro: 'The Gloom King has the last shard. Show him what friends can do!' },
    ] },
];

/* Story scenes. They play like a little movie.
   A line is [who, text, mood, effect]. {name} is the hero's name.
   A line ['fx', effect, who] plays an effect by itself. The effects live in js/movie.js. */
const STORY = {
  intro: [
    ['narr', 'Long ago, the Rainbow Star lit up the land of Lumina.', null, 'starshine'],
    ['narr', 'One night, the grumpy Glooms came.', null, 'gloomsfly'],
    ['fx', 'crack'],
    ['narr', 'The star broke into five shards. They flew far, far away.'],
    ['narr', 'The colors of the land began to fade...', null, 'fade'],
    ['fx', 'twinkledrop'],
    ['twinkle', 'Hello, {name}! I am Twinkle. I am a tiny piece of the star.'],
    ['twinkle', 'I need a hero. Will you help me find the five shards?'],
    ['hero', 'Yes! Let us go, Twinkle!'],
  ],
  'frost-in': [
    ['twinkle', 'Brr! This is Frost Peaks. The first shard is near.'],
    ['lumi', 'Oh! Hello... I am Lumi. I can make ice magic.', 'sad'],
    ['lumi', 'But my magic goes wrong sometimes. So I hide here.', 'sad', 'magicoops'],
    ['hero', 'Mistakes are OK! That is how we learn. Come with us!'],
    ['lumi', 'Really? ... OK. I will try!', 'happy', 'snowburst'],
  ],
  'frost-boss': [
    ['gloom', 'Grrr! This shard is MINE. Go away!'],
    ['lumi', 'I am scared... but I will not hide this time!', 'happy', 'snowburst'],
  ],
  'frost-out': [
    ['fx', 'shard'],
    ['glow', 'Wait... that was fun! I feel warm inside.'],
    ['lumi', 'I made mistakes. I tried again. Now I feel brave!'],
    ['fx', 'powerup', 'lumi'],
    ['twinkle', 'Lumi got the Brave Tiara! We have shard number 1.'],
    ['twinkle', 'Next stop: Block Valley!'],
  ],
  'block-in': [
    ['pix', 'Hey! I am Pix. I build FAST! Look at my tower!', 'happy', 'towerup'],
    ['fx', 'towerdown'],
    ['narr', 'CRASH! The tower falls down.'],
    ['pix', 'Oh no. Not again...', 'sad'],
    ['lumi', 'Try to count the blocks first. Slow and steady.'],
    ['pix', 'Count first... OK! Help me, {name}!'],
  ],
  'block-boss': [
    ['gloom', 'Hmph! I knock down every tower. Building is silly!'],
    ['pix', 'This time I have a plan. Ready, {name}?'],
  ],
  'block-out': [
    ['fx', 'shard'],
    ['glow', 'You built that together? Can I help next time?'],
    ['pix', 'I counted. I planned. My tower is the tallest ever!', 'happy', 'towerup'],
    ['fx', 'powerup', 'pix'],
    ['twinkle', 'Pix got the Golden Hammer! We have shard number 2.'],
    ['twinkle', 'I hear music... Let us go to Star City!'],
  ],
  'star-in': [
    ['nova', 'Hi... I am Nova. I sing in a band called the Starlights.'],
    ['nova', 'Our songs chase the Glooms away. But they took our words!', 'sad', 'notesdrop'],
    ['nova', 'Now I am too shy to sing.', 'sad'],
    ['pix', 'We will fix the words with you. One by one!'],
    ['nova', 'With friends... maybe I can do it.'],
  ],
  'star-boss': [
    ['gloom', 'LA LA LA! I can not hear you! No more songs!'],
    ['nova', 'My friends are with me. I will sing!', 'happy', 'notes'],
  ],
  'star-out': [
    ['fx', 'shard'],
    ['glow', 'That song... it makes me want to dance!'],
    ['nova', 'I found my voice! My friends make me strong.', 'happy', 'notes'],
    ['fx', 'powerup', 'nova'],
    ['twinkle', 'Nova got the Star Mic! We have shard number 3.'],
    ['twinkle', 'Look, pink flowers! Ribbon Meadow is this way.'],
  ],
  'meadow-in': [
    ['mochi', 'Meow! I am Mochi. Why is the sky blue? Why are Glooms grumpy? Why...', 'happy', 'questions'],
    ['nova', 'Wow. You ask so many questions!'],
    ['mochi', 'Sorry... Do I ask too many?', 'sad'],
    ['hero', 'No! Questions help us find answers. Keep asking, Mochi!'],
    ['mochi', 'Yay! Then let us find out everything!', 'happy', 'questions'],
  ],
  'meadow-boss': [
    ['gloom', 'Go away! No questions! I do not want to talk.'],
    ['mochi', 'Hmm. Why is this Gloom so sad? I want to know.', 'happy', 'questions'],
  ],
  'meadow-out': [
    ['fx', 'shard'],
    ['glow', 'Nobody ever asked how I feel. Thank you.'],
    ['mochi', 'Now I know! Glooms live in the dark. They are lonely!'],
    ['fx', 'powerup', 'mochi'],
    ['twinkle', 'Mochi got the Wonder Glass! We have shard number 4.'],
    ['twinkle', 'The last shard is in Gloom Castle. Be brave!'],
  ],
  'castle-in': [
    ['grumble', 'WHO comes to my castle? Nobody visits. Nobody likes Glooms!'],
    ['mochi', 'See? He is not bad. He is lonely.'],
    ['lumi', 'Let us show him what friends can do.'],
    ['hero', 'We are coming, King Grumble!'],
  ],
  'castle-boss': [
    ['grumble', 'The last shard is mine! It is the only light I have.'],
    ['hero', 'We do not want to fight. We want to share the light!'],
  ],
  'castle-out': [
    ['fx', 'shard'],
    ['grumble', 'You... want to be MY friend?'],
    ['hero', 'Yes! Come to our party. Everyone is welcome.'],
    ['fx', 'starjoin'],
    ['narr', 'The five shards came together. The Rainbow Star shone again!'],
    ['narr', 'The Glooms were never grumpy again. Now they are called the Glows.', null, 'glows'],
    ['twinkle', 'You did it, {name}! You are the Star Guardian!', 'happy', 'party'],
  ],
};

/* Friends: what they are like and how they grow */
const FRIENDS = [
  { id: 'lumi', name: 'Lumi', world: 0, about: 'A snow princess with ice magic.', before: 'She is afraid to make mistakes.', after: 'She learned that mistakes help her grow. She is brave now!', power: 'Brave Tiara' },
  { id: 'pix', name: 'Pix', world: 1, about: 'A builder from Block Valley.', before: 'Pix builds too fast, so things fall down.', after: 'Pix learned to count and plan first.', power: 'Golden Hammer' },
  { id: 'nova', name: 'Nova', world: 2, about: 'A singer in the Starlights band.', before: 'She is too shy to sing.', after: 'She found her voice with help from friends.', power: 'Star Mic' },
  { id: 'mochi', name: 'Mochi', world: 3, about: 'A kitten who loves to ask why.', before: 'She thinks she asks too many questions.', after: 'Her questions solved the big mystery!', power: 'Wonder Glass' },
];

const HERO_TITLES = ['Star Seeker', 'Snow Scout', 'Word Wizard', 'Block Builder', 'Number Ninja', 'Song Star', 'Idea Maker', 'Science Scout', 'Wonder Kid', 'Shard Finder', 'Rainbow Hero', 'Star Guardian'];

const SHOP = [
  { id: 'flower', name: 'Flower', slot: 'head', cost: 15 },
  { id: 'bow', name: 'Pink Bow', slot: 'head', cost: 20 },
  { id: 'catears', name: 'Kitty Ears', slot: 'head', cost: 30 },
  { id: 'headphones', name: 'Pop Headphones', slot: 'head', cost: 40 },
  { id: 'helmet', name: 'Builder Hat', slot: 'head', cost: 40 },
  { id: 'tiara', name: 'Ice Tiara', slot: 'head', cost: 60 },
  { id: 'crown', name: 'Gold Crown', slot: 'head', cost: 90 },
  { id: 'wand', name: 'Star Wand', slot: 'hand', cost: 50 },
  { id: 'mic', name: 'Microphone', slot: 'hand', cost: 35 },
  { id: 'lightstick', name: 'Heart Stick', slot: 'hand', cost: 45 },
  { id: 'cape', name: 'Hero Cape', slot: 'back', cost: 60 },
  { id: 'wings', name: 'Fairy Wings', slot: 'back', cost: 100 },
];
