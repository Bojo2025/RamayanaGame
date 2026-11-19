# Ramayana · Path of Dharma (levels 1–14)

**Developed by Mr Boyjonauth Kevin · Bojo Solutions**

An original, painted 2D action-story game built from the Ramayana Game Design Description.
It is plain HTML5 canvas and vanilla JavaScript, with no engine, no CDN and no network calls.
Every asset is embedded in `js/assets.js`, so the game also runs from `file://`.

## Run
- Local: `python3 -m http.server 8765` in this folder, then open http://127.0.0.1:8765/
- GitHub Pages: push this folder as-is. `index.html` is at the root and all paths are relative.
- Query flags:
  - `?level=N`: open the level card.
  - `?level=N&demo=1`: autopilot playthrough. Add `&seg=S` to start at a segment.
  - `&capture=1`: fixed timestep.
  - `?unlock=1`: unlock all levels.
  - `?lang=hi`: Hindi.
  - `?touch=1` / `?touch=0`: force touch controls on or off.

## Controls
| Action | Keyboard | Touch (landscape) |
|---|---|---|
| Move | ← → / A D | Left-thumb stick (platform, arena). Runner auto-runs. |
| Jump (hold = higher, again in air = double) | Space / ↑ / W | JUMP button · runner: left half. Not stick-up. |
| Slide / crouch | ↓ / S | Stick down · swipe down · runner: swipe down |
| Strike / shoot (2 quick = heavy/charged, 3 with full meter = special) | J / K / X | ⚔ / ➶ · runner: right half |
| Block (arena) | Shift / L | BLOCK |
| Switch brother (L8) | Q / Tab / E | ⇄ |
| Talk / continue | Enter | ENTER button, or tap anywhere on a story or message |
| Focus modes (L5 drill 2, L6, L7) | hold Space, tap J | hold left half, tap right half |
| Pause · mute | P / Esc · M | ⏸ · 🔊 |

## Levels
1. Young Dashanan's Departure: story, then a burning-field platformer (3 war-standards, ash spirits, jackals), then a runner burst.
2. Little Rama in the Palace: platformer and story. Talk to your mother and father, hop the dummy-post sequence, cross the shallow pool, slide under the beams, time the sleeping dog, find the hidden lotus.
3. Sita's Early Training: story, a target-drill platformer, then a fixed-screen spar with the Arms-Mistress (telegraphed strike and sweep, guard, OPEN window), then story.
4. Ravana's Journey to the Mountain: a long runner through four phases (scree, forest, ledges, last climb), with a headwind zone and the cave, then story.
5. Rama's First Lessons: Vasishtha's three drills (timed footwork, on-the-drum held aim, a moving target with no wild shots).
6. Sita's Archery Focus: three focus marks (wind, gusts, shouts, birds, a moving target), walks between them, and a global daylight meter.
7. Ravana Begins Penance: a 120 s stay-put meditation. Hold to stay; tap the closing rings on pebbles, whispers, a crown and a battle memory.
8. Young Rama and Lakshmana Together: a tag-team platformer with "together" hits, swinging sandbags, a boost wall and the straw boar.
9. Ravana's Penance Deepens: a harder stay-put meditation in a night storm, then Brahma arrives.
10. Receiving the Boon: a story audience. Dashanan asks to be unslayable by every being he respects, and not by mankind. The crowns begin to kindle.
11. Conquest of Lanka: a fixed-screen fight through Kubera's gate, then a short run up to the palace.
12. Tataka: a fixed-screen bout. Vishvamitra steadies Rama; the sage does not draw the bow.
13. Protecting the Sacrifice: walk to the altar, hold it against the host, then face Subahu. Maricha is cast far, not slain.
14. Journey to Mithila: a runner along the road to Janaka's gates.
15. Swayamvara Approach: cross the hall, speak with Janaka and Sita, and reach the Pinaka.
16. Lifting the Pinaka: four timed phrases. A miss retries that phrase. The bow breaks.
17. Parashurama Encounter: a short clash that ends when he recognises Rama and departs. He is not killed.
18. Kaikeyi's Demand: Manthara's whisper, then the court. Rama hears the two boons and accepts them.
19. Leaving Ayodhya: the city follows the three to the gate, then a gentle road opens.

After level 19 the game shows a "to be continued" card. Levels 20–30 stay listed in the chronicle (`js/levels2.js`). Painted art for 9–19 loads from `js/assets2.js` after the opening eight, so levels 1–8 still start on the original file.

## Structure
```
index.html  css/style.css
js/assets.js   generated: painted plates (JPEG), 6 textures, 12 chroma-keyed WebP atlases, logo, 2 subset fonts
js/audio.js    WebAudio: Indian-classical procedural score (tanpura, tabla, bansuri, veena), SFX, ambience
js/art.js      parallax plates, scenery layers, textured ground, particles, weather, fog, glow, UI widgets
js/sprites.js  atlas drawing (feet anchors, flip, tint, portraits)
js/levels.js   levels 1–8 as data (bilingual EN/HI)
js/levels2.js  playable levels 9–19; titles for 20–30
js/assets2.js  lazy-loaded plates and sprites for levels 9–19
js/game.js     loop, input, physics, the six play modes, menus, save, demo autopilot, test hooks
tools/test_levels_9_14.js  Playwright: autopilot levels 9–14, smoke 1 and 8, screenshots
```
Saves go to localStorage `rpd_save_v1` (unlocked, best score and stars per level, language, mute, vibration).

## Art pipeline
Painted plates and green-screen character sheets were generated to match the approved character sketches.
They are original art, with no film or actor likenesses.
`tools/make_assets.py` does the processing:
1. Chroma keying with soft edges and despill.
2. Splitting frames by connected components.
3. Normalising scale and anchoring each frame at the feet.
4. Shelf-packing frames into WebP atlases and embedding them in `assets.js` as data URIs.

The source art lives outside this folder, in `../art_source/`, to keep the game small.
Fonts are Cinzel Decorative and Marcellus (OFL), subset.

## Notes
- The Arms-Mistress of Mithila is an invented teacher. Sita's martial training follows popular retellings, not Valmiki.
- All dialogue is original wording.
