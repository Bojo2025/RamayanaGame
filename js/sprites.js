// RAMAYANA: PATH OF DHARMA - painted sprite blitter (pattern from Paille-en-queue js/sprites.js).
// Atlases are chroma-keyed WebP sheets embedded in js/assets.js (window.RPD_SPRITES).
// Frame rect: [x, y, w, h, anchorX, anchorY] with the anchor at the feet (anchorX = head centre).
(function () {
  'use strict';
  var S = { imgs: {}, ok: {}, total: 0, loaded: 0 };
  var DATA = window.RPD_SPRITES || {};
  // native facing of each sheet (1 = faces right, -1 = faces left)
  var FACE = { rama: 1, dash: 1, sita: 1, lak: 1, ascetic: 1, teacher: -1, foe: -1, prop: 1, terr: 1, scen: 1, key: 1,
    rama_adult: 1, lak_adult: 1, sita_adult: 1, ravanan: 1, tataka: 1, subahu: 1, rakshasa: 1, lanka_guards: 1, parashurama: 1,
    puppet_janaka: 1, puppet_dasharatha: 1, puppet_kaikeyi: 1, puppet_manthara: 1, puppet_sita_story: 1,
    shurpanakha_arena: 1, shurpanakha_story: 1,
    puppet_brahma: 1, puppet_vishvamitra: 1, puppet_dashanan_boon: 1, puppet_rama_story: 1, puppet_lak_story: 1,
    props_9_30: 1, scenery_9_30: 1, terrain_9_30: 1, foes_forest: 1,
    npc: { kaikasi: 1, kaushalya: -1, dasharatha: -1, vasishtha: -1 } };
  var tintCache = {};

  S.load = function (done) {
    var keys = Object.keys(DATA); S.total = keys.length;
    if (!keys.length) { done && done(); return; }
    keys.forEach(function (k) {
      var im = new Image();
      im.onload = function () { S.ok[k] = true; S.loaded++; if (S.loaded >= S.total && done) done(); };
      im.onerror = function () { S.ok[k] = false; S.loaded++; if (S.loaded >= S.total && done) done(); };
      im.src = DATA[k].src; S.imgs[k] = im;
    });
  };
  // Levels 9–30 art arrives in window.RPD_SPRITES2 after the opening eight have already started.
  S.loadExtra = function (done) {
    var extra = window.RPD_SPRITES2 || {}, keys = Object.keys(extra);
    if (!keys.length) { S.extra = true; done && done(); return; }
    var left = keys.length;
    keys.forEach(function (k) {
      DATA[k] = extra[k];
      var im = new Image();
      function fin(ok) { S.ok[k] = ok; if (--left <= 0) { S.extra = true; done && done(); } }
      im.onload = function () { fin(true); };
      im.onerror = function () { fin(false); };
      im.src = extra[k].src; S.imgs[k] = im;
    });
  };
  S.has = function (sh, fr) { return !!(S.ok[sh] && DATA[sh].f[fr]); };
  S.rect = function (sh, fr) { return DATA[sh] && DATA[sh].f[fr]; };
  S.size = function (sh, fr) { var r = S.rect(sh, fr); return r ? { w: r[2], h: r[3], ax: r[4], ay: r[5] } : { w: 0, h: 0, ax: 0, ay: 0 }; };
  S.nativeFace = function (sh, fr) { var f = FACE[sh]; return typeof f === 'object' ? (f[fr] || 1) : (f || 1); };

  function tinted(sh, fr, color) {
    var key = sh + '|' + fr + '|' + color;
    if (tintCache[key]) return tintCache[key];
    var r = S.rect(sh, fr), c = document.createElement('canvas'); c.width = r[2]; c.height = r[3];
    var x = c.getContext('2d');
    x.drawImage(S.imgs[sh], r[0], r[1], r[2], r[3], 0, 0, r[2], r[3]);
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = color; x.fillRect(0, 0, r[2], r[3]);
    tintCache[key] = c; return c;
  }

  // draw frame with its feet anchor at (x, y). o: { s, face, alpha, rot, tint, tintA, sx, sy, glow }
  S.draw = function (g, sh, fr, x, y, o) {
    o = o || {};
    if (!S.has(sh, fr)) return false;
    var r = S.rect(sh, fr), s = o.s || 1, sx = s * (o.sx || 1), sy = s * (o.sy || 1);
    var flip = (o.face || 1) !== S.nativeFace(sh, fr);
    g.save();
    g.translate(x, y);
    if (o.rot) { g.translate(0, -r[3] * sy * 0.5); g.rotate(o.rot); g.translate(0, r[3] * sy * 0.5); }
    if (flip) g.scale(-1, 1);
    if (o.alpha != null) g.globalAlpha *= o.alpha;
    if (o.glow) { g.shadowColor = o.glow; g.shadowBlur = o.glowR || 18; }
    var ax = o.cx ? r[2] / 2 : r[4];
    g.drawImage(S.imgs[sh], r[0], r[1], r[2], r[3], -ax * sx, -r[5] * sy, r[2] * sx, r[3] * sy);
    g.shadowBlur = 0;
    if (o.tint && o.tintA > 0) {
      g.globalAlpha *= Math.min(1, o.tintA);
      g.drawImage(tinted(sh, fr, o.tint), -ax * sx, -r[5] * sy, r[2] * sx, r[3] * sy);
    }
    g.restore();
    return true;
  };
  // draw centred on (x, y) (props, icons)
  S.drawC = function (g, sh, fr, x, y, o) {
    o = o || {}; var r = S.rect(sh, fr); if (!r || !S.ok[sh]) return false;
    var s = o.s || 1; o.cx = true;
    return S.draw(g, sh, fr, x, y + r[3] * s / 2, o);
  };
  // draw fitted into a box (w, h) centred on (x, y)
  S.drawFit = function (g, sh, fr, x, y, w, h, o) {
    var r = S.rect(sh, fr); if (!r) return false;
    o = o || {}; o.s = Math.min(w / r[2], h / r[3]); return S.drawC(g, sh, fr, x, y, o);
  };
  // stretch a frame into a rect (platform pieces); x,y = top-left
  S.drawRect = function (g, sh, fr, x, y, w, h, alpha) {
    var r = S.rect(sh, fr); if (!r || !S.ok[sh]) return false;
    if (alpha != null) { g.save(); g.globalAlpha *= alpha; }
    g.drawImage(S.imgs[sh], r[0], r[1], r[2], r[3], x, y, w, h);
    if (alpha != null) g.restore();
    return true;
  };
  // head-and-shoulders portrait canvas (dialogue boxes, level cards)
  var portraitCache = {};
  S.portrait = function (sh, fr, frac) {
    var key = sh + '|' + fr; if (portraitCache[key]) return portraitCache[key];
    var r = S.rect(sh, fr); if (!r || !S.ok[sh]) return null;
    frac = frac || 0.3;
    var ph = Math.round(r[3] * frac), pw = Math.min(r[2], Math.round(ph * 1.05));
    var cx = Math.max(0, Math.min(r[2] - pw, Math.round(r[4] - pw / 2)));
    var c = document.createElement('canvas'); c.width = pw; c.height = ph;
    var x = c.getContext('2d');
    if (S.nativeFace(sh, fr) < 0) { x.translate(pw, 0); x.scale(-1, 1); }
    x.drawImage(S.imgs[sh], r[0] + cx, r[1], pw, ph, 0, 0, pw, ph);
    portraitCache[key] = c; return c;
  };
  window.RPDSprites = S;
})();
