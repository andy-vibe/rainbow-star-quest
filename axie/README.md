# Axie art in this game

The animated characters in `axie/art/` are Axie Infinity art by Sky Mavis.
They come from the public repo https://github.com/axieinfinity/unity-axie-gtk2d
("Axie Infinity IP - Tool Kit 2D"). They are not original to this game.

- Pets (starter Axies): Buba, Puffy, Xia, Bing
- Enemies (Chimeras): grey wolf, treant, aquatic wolf, flowering treant, bear mom, slime

The files are Spine 3.8 animations. They are drawn with the Spine canvas runtime in
`axie/spine/spine-canvas.js`, copyright Esoteric Software LLC. Its license is in `axie/spine/LICENSE`.

Code in this folder:
- `axie.js` loads and draws the characters
- `pet.js` puts the pet and the enemies into the game
- `names.js` changes the game wording from "Glooms" to Chimeras
