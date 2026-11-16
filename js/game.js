// RAMAYANA: PATH OF DHARMA - loop, physics, input, the six modes (levels 1-8 use five), HUD, menus, save, demo, hooks.
// Movement / collision / runner controls follow Zombi Lile Runner (GRAV 2700, jump -930, double -840, variable
// height, coyote time, 0.62 s slide, 1/2/3-tap attack chain on a 0.36 s window, hit-stop, shake, pop text).
(function () {
  'use strict';
  var ART = window.RPDArt, SPR = window.RPDSprites, AU = window.RPDAudio;
  var LEVELS = window.RPD_LEVELS, CAST = window.RPD_CAST, LATER = window.RPD_LATER || [];
  var cv = document.getElementById('game'), g = cv.getContext('2d');
  var H = 540, W = 960, DPR = 1, VS = 1, OX = 0, OY = 0, GY = 440;
  var GRAV = 2700, RUNSPD = 330;
  var Q = new URLSearchParams(location.search);
  var DEMO = Q.get('demo') === '1', CAPTURE = Q.get('capture') === '1';
  var TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || Q.get('touch') === '1';
  if (Q.get('touch') === '0') TOUCH = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function overlap(a, b) { return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]; }
  var seedS = 1; function srand(s) { seedS = s >>> 0; }
  function rnd() { seedS = (seedS + 0x6D2B79F5) >>> 0; var t = seedS; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function RR(a, b) { return a + (b - a) * rnd(); }

  // ---------------- save ----------------
  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var SAVE = store.get('rpd_save_v1', null) || {};
  SAVE.unlocked = SAVE.unlocked || 1; SAVE.best = SAVE.best || {}; SAVE.lang = SAVE.lang || 'en';
  if (SAVE.mute == null) SAVE.mute = false; if (SAVE.vibe == null) SAVE.vibe = true;
  if (Q.get('unlock') === '1') SAVE.unlocked = 8;
  if (Q.get('lang') === 'hi') SAVE.lang = 'hi';
  function persist() { store.set('rpd_save_v1', SAVE); }
  AU.setMuted(SAVE.mute);

  // ---------------- language ----------------
  var STR = {
    play: ['Play', 'खेलें'], cont: ['Continue', 'जारी रखें'], levels: ['Chronicle', 'कथा-क्रम'], howto: ['How to Play', 'कैसे खेलें'],
    soundOn: ['Sound: On', 'ध्वनि: चालू'], soundOff: ['Sound: Off', 'ध्वनि: बंद'], vibeOn: ['Vibration: On', 'कंपन: चालू'], vibeOff: ['Vibration: Off', 'कंपन: बंद'],
    lang: ['Language: English', 'भाषा: हिंदी'], back: ['Back', 'वापस'], begin: ['Begin', 'आरंभ'], resume: ['Resume', 'जारी रखें'], restart: ['Restart this part', 'यह भाग फिर से'],
    paused: ['Paused', 'विराम'], retry: ['Try Again', 'फिर प्रयास'], next: ['Next Level', 'अगला स्तर'], complete: ['Level Complete', 'स्तर पूर्ण'], over: ['Not Yet', 'अभी नहीं'],
    chron: ['The Chronicle', 'कथा-क्रम'], goesOn: ['The story goes on', 'कथा आगे बढ़ती है'], locked: ['Locked', 'बंद'], soon: ['Coming in Part 1', 'भाग 1 में आ रहा है'],
    tapNext: ['Tap the glowing speaker  ·  Enter', 'चमकते पात्र को टैप करो  ·  Enter'], tapCont: ['Tap to continue  ·  Enter', 'आगे बढ़ने के लिए टैप करो  ·  Enter'],
    talk: ['Talk', 'बात करो'], score: ['Score', 'अंक'], stars: ['Stars', 'तारे'], rules: ['Stars for this level', 'इस स्तर के तारे'], subtitle: ['Path of Dharma', 'धर्म पथ'],
    credit: ['Developed by Mr Boyjonauth Kevin · Bojo Solutions', 'विकासकर्ता: Mr Boyjonauth Kevin · Bojo Solutions'],
    rotate: ['Turn your phone sideways', 'अपना फ़ोन आड़ा करें'], playAnyway: ['Play anyway', 'फिर भी खेलें'],
    perfect: ['Perfect!', 'सटीक!'], trueShot: ['True shot!', 'सच्चा बाण!'], hit: ['Hit', 'लगा'], miss: ['Miss', 'चूक'], focusBroken: ['Focus broken', 'एकाग्रता टूटी'],
    needMeter: ['Needs a full meter', 'पूरा मीटर चाहिए'], together: ['Together!', 'साथ!'], wild: ['Wild shot!', 'भटका बाण!'], steady: ['Endured', 'सहन किया'], tooSoon: ['Too soon', 'बहुत जल्दी'],
    blocked: ['Blocked!', 'रोका!'], open: ['OPEN', 'खुला'], spar: ['Spar!', 'मुक़ाबला!'], wellStruck: ['Well struck!', 'बहुत अच्छा!'], drillFail: ['Again, from the start of the drill', 'अभ्यास फिर से आरंभ'],
    sunset: ['The sun has set on the range', 'धनुष-क्षेत्र पर सूरज ढल गया'], outOfPips: ['Your strength is spent', 'तुम्हारी शक्ति समाप्त हुई'], teacherStops: ['The teacher stops the bout', 'गुरु ने मुक़ाबला रोक दिया'],
    meditBroken: ['The meditation shattered', 'ध्यान बिखर गया'], focusSpent: ['Your focus is spent for today', 'आज की एकाग्रता समाप्त'], hits: ['Hits', 'भेदन'], arrows: ['Arrows', 'बाण'],
    penance: ['Penance', 'तप'], steadiness: ['Steadiness', 'स्थिरता'], dayLeft: ['Daylight', 'दिन का प्रकाश'], focusL: ['Focus', 'एकाग्रता'], time: ['Time', 'समय'],
    levelSel: ['Chronicle', 'कथा-क्रम'], storyCard: ['Next in the chronicle: Level 9 · Ravana\'s Penance Deepens. The ascetic returns to the mountain, and this time Brahma will answer.', 'कथा-क्रम में आगे: स्तर 9 · रावण की तपस्या गहराती है। तपस्वी फिर पर्वत पर लौटता है, और इस बार ब्रह्मा उत्तर देंगे।'],
    mark: ['Mark', 'निशान'], demo: ['DEMO', 'डेमो'], arenaIntro: ['A sporting bout. Fill her training meter!', 'खेल का मुक़ाबला। उसका प्रशिक्षण-मीटर भरो!'],
    clean: ['Clean sequence!', 'साफ़ क्रम!'], again: ['Again: light feet!', 'फिर से: हल्के पैर!'], woof: ['Woof! Back you go', 'भौं! वापस जाओ'], splash: ['Splash! Back to the lamp', 'छपाक! दीये तक वापस'],
    oof: ['Oof!', 'उफ़!'], boarBeaten: ['The boar is beaten!', 'सूअर हार गया!'], pulled: ['Pulled up!', 'ऊपर खींचा!'], standard: ['War-standard', 'युद्ध-ध्वज'], lotusFound: ['Hidden lotus!', 'छिपा कमल!'],
    hold: ['HOLD', 'दबाओ'], tap: ['TAP', 'टैप'], beat: ['On the beat!', 'थाप पर!'], offBeat: ['Off the beat', 'थाप से चूके'], weak: ['Draw fully first', 'पहले पूरा खींचो'],
    bird: ['The bird!', 'पक्षी!'], ignore: ['Ignore the shout!', 'शोर अनसुना करो!'], markReset: ['Out of arrows: the mark resets', 'बाण समाप्त: निशान फिर से'], best: ['Best', 'सर्वश्रेष्ठ']
  };
  function T(k) { var s = STR[k]; return s ? (SAVE.lang === 'hi' ? s[1] : s[0]) : k; }
  function tr(o) { return o ? (SAVE.lang === 'hi' ? (o.hi || o.en) : o.en) : ''; }

  // ---------------- resize / rotate ----------------
  var rotateEl = document.getElementById('rotate'), rotateDismissed = false;
  function resize() {
    var iw = window.innerWidth || 960, ih = window.innerHeight || 540;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    if (iw * ih * DPR * DPR > 2560 * 1440) DPR = Math.max(1, Math.sqrt(2560 * 1440 / (iw * ih)));
    W = clamp(Math.round(H * iw / ih), 760, 1170);
    VS = Math.min(iw / W, ih / H); OX = (iw - W * VS) / 2; OY = (ih - H * VS) / 2;
    cv.width = Math.round(iw * DPR); cv.height = Math.round(ih * DPR); cv.style.width = iw + 'px'; cv.style.height = ih + 'px';
    checkRotate();
  }
  function checkRotate() {
    if (!rotateEl) return;
    var portrait = TOUCH && window.innerHeight > window.innerWidth && !rotateDismissed;
    rotateEl.style.display = portrait ? 'flex' : 'none';
    var t = rotateEl.querySelector('.rt'), b = rotateEl.querySelector('button');
    if (t) t.textContent = T('rotate'); if (b) b.textContent = T('playAnyway');
    if (portrait && G.scene === SC.play) setScene(SC.pause);
  }
  if (rotateEl) { var rb = rotateEl.querySelector('button'); if (rb) rb.addEventListener('click', function () { rotateDismissed = true; checkRotate(); }); }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function () { setTimeout(resize, 120); });

  // ---------------- input ----------------
  var K = {}, P = {}, AIC = null;
  function press(a) { P[a] = (P[a] || 0) + 1; K[a] = true; }
  function rel(a) { K[a] = false; }
  function took(a) { if (P[a]) { P[a] = 0; return true; } return false; }
  var KEYMAP = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'jump', KeyW: 'jump', Space: 'jump', ArrowDown: 'down', KeyS: 'down',
    KeyJ: 'atk', KeyK: 'atk', KeyX: 'atk', Enter: 'confirm', NumpadEnter: 'confirm', ShiftLeft: 'block', ShiftRight: 'block', KeyL: 'block', KeyQ: 'tag', Tab: 'tag',
    KeyP: 'pause', Escape: 'pause', KeyM: 'mute', KeyE: 'tag' };
  window.addEventListener('keydown', function (e) {
    var a = KEYMAP[e.code]; if (!a) return;
    if (e.code === 'Tab' || e.code === 'Space' || e.code.indexOf('Arrow') === 0) e.preventDefault();
    AU.init();
    if (e.repeat) return;
    press(a);
    if (a === 'jump') press('hold');
    if (a === 'atk' || a === 'confirm') press('tap');
    if (G.scene && G.scene.key) G.scene.key(a);
  });
  window.addEventListener('keyup', function (e) { var a = KEYMAP[e.code]; if (!a) return; rel(a); if (a === 'jump') rel('hold'); });
  // In demo mode the mode AI writes these instead of the player.
  var IN = {
    mx: function () { if (AIC) return AIC.mx || 0; return (K.right ? 1 : 0) - (K.left ? 1 : 0); },
    jumpP: function () { if (AIC) { var v = AIC.jumpP; AIC.jumpP = false; return v; } return took('jump'); },
    jumpHeld: function () { return AIC ? !!AIC.jumpHeld : !!K.jump; },
    downP: function () { if (AIC) { var v = AIC.downP; AIC.downP = false; return v; } return took('down'); },
    downHeld: function () { return AIC ? !!AIC.downHeld : !!K.down; },
    atkP: function () { if (AIC) { var v = AIC.atkP; AIC.atkP = false; return v; } var a = took('atk'); return a; },
    blockHeld: function () { return AIC ? !!AIC.block : !!K.block; },
    tagP: function () { if (AIC) { var v = AIC.tagP; AIC.tagP = false; return v; } return took('tag'); },
    holdHeld: function () { return AIC ? !!AIC.hold : !!(K.hold || K.jump); },
    tapP: function () { if (AIC) { var v = AIC.tapP; AIC.tapP = false; return v; } return took('tap'); },
    confirmP: function () { if (AIC) { var v = AIC.confirmP; AIC.confirmP = false; return v; } return took('confirm'); }
  };
  function clearInput() { for (var k in P) P[k] = 0; }

  // pointers: menus, HUD buttons, on-screen touch buttons, zones and swipes
  var pointers = {};
  function toV(e) { return { x: (e.clientX - OX) / VS, y: (e.clientY - OY) / VS }; }
  cv.addEventListener('pointerdown', function (e) {
    AU.init(); e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    if (e.pointerType === 'touch') TOUCH = true;
    var v = toV(e), p = { id: e.pointerId, x: v.x, y: v.y, sx: v.x, sy: v.y, t0: performance.now(), act: null, swiped: false };
    pointers[e.pointerId] = p;
    if (G.scene && G.scene.down) G.scene.down(p);
  });
  cv.addEventListener('pointermove', function (e) {
    var p = pointers[e.pointerId]; if (!p) return; var v = toV(e); p.x = v.x; p.y = v.y;
    var dx = p.x - p.sx, dy = p.y - p.sy, dtm = performance.now() - p.t0;
    if (!p.swiped && dtm < 420 && Math.abs(dy) > 42 && Math.abs(dy) > Math.abs(dx) * 1.2 && G.scene === SC.play && G.mode && G.mode.swipes) {
      p.swiped = true;
      if (dy > 0) { press('down'); setTimeout(function () { rel('down'); }, 120); } else if (!p.act) { press('jump'); p.act = 'jump'; }
    }
    if (G.scene && G.scene.move) G.scene.move(p);
  });
  function pUp(e) {
    var p = pointers[e.pointerId]; if (!p) return; delete pointers[e.pointerId];
    if (p.act) { rel(p.act); if (p.act === 'jump') rel('hold'); }
    if (G.scene && G.scene.up) G.scene.up(p);
  }
  cv.addEventListener('pointerup', pUp); cv.addEventListener('pointercancel', pUp);
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { AU.suspend(); if (G.scene === SC.play && !DEMO) setScene(SC.pause); } else AU.resume();
  });
  function vibe(ms) { if (SAVE.vibe && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

  // ---------------- FX ----------------
  var FX = { shake: 0, hitstop: 0, flash: 0, flashCol: '255,255,255', slow: 0, pops: [], fade: 0, banner: null };
  function shake(a) { FX.shake = Math.max(FX.shake, a); }
  function hitstop(t) { FX.hitstop = Math.max(FX.hitstop, t); }
  function flash(a, col) { FX.flash = Math.max(FX.flash, a); FX.flashCol = col || '255,255,255'; }
  function slowmo(t) { FX.slow = Math.max(FX.slow, t); }
  function pop(x, y, txt, col, size, screen) { FX.pops.push({ x: x, y: y, t: 0, txt: txt, col: col || '#fff2c0', size: size || 24, screen: !!screen }); if (FX.pops.length > 30) FX.pops.shift(); }
  function banner(txt, sub, dur) { FX.banner = { txt: txt, sub: sub || '', t: 0, dur: dur || 2.4 }; }

  // ---------------- game state ----------------
  var G = { t: 0, scene: null, mode: null, L: null, li: 0, si: 0, pips: 3, maxPips: 5, meter: 0, score: 0, stats: {}, cam: 0, tip: null, tipT: 0, demoTimer: 0, segName: null };
  var SC = {};
  function setScene(s, arg) { if (G.scene && G.scene.leave) G.scene.leave(); G.scene = s; clearInput(); if (s.enter) s.enter(arg); }

  // ---------------- heroes (painted sprite frames per state) ----------------
  var RUN6 = ['run0', 'run1', 'run2', 'run3', 'run4', 'run5'];
  var HEROES = {
    dash: { sh: 'dash', s: 0.62, melee: true, run: RUN6, idle: 'idle', jump: 'jump', fall: 'fall', a1: 'slash', a2: 'special', a3: 'special', hurt: 'hurt', slide: 'slide', block: 'idle2', trail: 'rgba(190,120,255,', name: 'dash' },
    rama: { sh: 'rama', s: 0.62, melee: false, run: RUN6, idle: 'idle', jump: 'jump', fall: 'jump', a1: 'shoot', a2: 'shoot', a3: 'shoot', hurt: 'hurt', slide: 'kneel', block: 'kneel', trail: 'rgba(255,220,140,', name: 'rama' },
    sita: { sh: 'sita', s: 0.63, melee: false, run: RUN6, idle: 'idle', jump: 'jump', fall: 'jump', a1: 'release', a2: 'draw', a3: 'focus', hurt: 'hurt', slide: 'kick', block: 'aim', kick: 'kick', trail: 'rgba(255,200,120,', name: 'sita' },
    lak: { sh: 'lak', s: 0.66, melee: true, run: RUN6, idle: 'idle', jump: 'jump', fall: 'jump', a1: 'slash', a2: 'heavy', a3: 'slash2', hurt: 'hurt', slide: 'guard', block: 'guard', trail: 'rgba(170,255,170,', name: 'lak' }
  };
  function makeHero(id, x, y) {
    return { id: id, A: HEROES[id], x: x, y: y, vx: 0, vy: 0, face: 1, gr: true, jumps: 0, airT: 0, hold: false, holdT: 0, slideT: 0, qSlide: false, flipT: 0,
      atk: null, chainN: 0, chainT: 0, inv: 0, hurtT: 0, phase: 0, on: null, blocking: false, crouch: false, landT: 0, lastGround: x, talkT: 0 };
  }
  function hbox(h) { var low = h.slideT > 0 || h.crouch; return low ? [h.x - 30, h.y - 56, h.x + 36, h.y] : [h.x - 17, h.y - 128, h.x + 17, h.y]; }
  function heroFrame(h) {
    var A = h.A;
    if (h.hurtT > 0) return A.hurt;
    if (h.atk) { if (h.atk.kick && A.kick) return A.kick; return h.atk.n === 1 ? A.a1 : h.atk.n === 2 ? A.a2 : A.a3; }
    if (h.blocking) return A.block;
    if (h.slideT > 0 || h.crouch) return A.slide;
    if (!h.gr) return h.vy < 0 ? A.jump : A.fall;
    if (Math.abs(h.vx) > 30) return A.run[Math.floor(h.phase) % A.run.length];
    return A.idle;
  }
  function drawHero(g, h, camX, o) {
    o = o || {};
    var A = h.A, fr = heroFrame(h), x = h.x - camX, y = h.y;
    ART.shadow(g, x, (h.shadowY || y) + 2, 34, 0.32);
    var blink = h.inv > 0 && Math.floor(h.inv * 14) % 2 === 0 && h.hurtT <= 0;
    var rot = 0;
    if (h.flipT > 0) rot = (1 - h.flipT / 0.45) * Math.PI * 2 * h.face;
    var sy = 1, sx = 1;
    if (h.landT > 0) { sy = 1 - h.landT * 0.5; sx = 1 + h.landT * 0.35; }
    if (h.gr && Math.abs(h.vx) < 30 && !h.atk) sy *= 1 + Math.sin(G.t * 2.4 + x) * 0.008;
    // attack trail
    if (h.atk && A.melee) {
      var k = h.atk.t / h.atk.dur, r = h.atk.n === 3 ? 140 : 95 + h.atk.n * 12;
      g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
      if (h.atk.n === 3) { g.strokeStyle = A.trail + (0.6 * (1 - k)) + ')'; g.lineWidth = 16; g.beginPath(); g.arc(x, y - 70, r, k * 12, k * 12 + 4.2); g.stroke(); }
      else { var a0 = -2.2 + k * 2.6; g.strokeStyle = A.trail + (0.75 * (1 - k)) + ')'; g.lineWidth = 10 + h.atk.n * 4; g.beginPath(); if (h.face > 0) g.arc(x + 10, y - 80, r, a0 - 1.0, a0); else g.arc(x - 10, y - 80, r, Math.PI - a0, Math.PI - a0 + 1.0); g.stroke(); }
      g.restore();
    }
    if (o.glow) ART.glow(g, x, y - 70, 110, o.glow, 0.5);
    var ok = SPR.draw(g, A.sh, fr, x, y, { s: A.s * (o.s || 1), face: h.face, rot: rot, alpha: blink ? 0.35 : (o.alpha == null ? 1 : o.alpha), sx: sx, sy: sy,
      tint: h.hurtT > 0 ? '#ff3030' : (h.flashT > 0 ? '#ffffff' : null), tintA: h.hurtT > 0 ? 0.45 : (h.flashT || 0) * 2 });
    if (!ok) ART.fallbackFigure(g, x, y, 140, '#a0603a', h.face);
    if (o.marker) { g.fillStyle = '#ffe27a'; g.beginPath(); g.moveTo(x - 8, y - 160); g.lineTo(x + 8, y - 160); g.lineTo(x, y - 150); g.fill(); }
  }

  // ---------------- world physics ----------------
  // world: { segs:[{x0,x1,y0,y1,k}], plats:[{x,y,w,h,dx,dy}], solids:[{x,y,w,h}] }
  function groundAt(w, x) {
    var s = w.segs;
    for (var i = 0; i < s.length; i++) if (x >= s[i].x0 && x <= s[i].x1) { var q = s[i]; return q.y0 + (q.y1 - q.y0) * ((x - q.x0) / Math.max(1, q.x1 - q.x0)); }
    return null;
  }
  function segAt(w, x) { var s = w.segs; for (var i = 0; i < s.length; i++) if (x >= s[i].x0 && x <= s[i].x1) return s[i]; return null; }
  function physHero(h, dt, w, c) {
    // c: { mx, auto, jumpP, jumpHeld, downP, downHeld, jmul, canDouble, minX, maxX, slow }
    if (h.on && h.on.dx) h.x += h.on.dx;
    if (h.on && h.on.dy) h.y += h.on.dy;
    if (c.auto != null) h.vx = c.auto;
    else {
      var target = (c.mx || 0) * RUNSPD * (c.slow || 1);
      if (h.blocking || (h.atk && h.gr && !h.A.melee)) target *= 0.25;
      h.vx += (target - h.vx) * Math.min(1, dt * (h.gr ? 14 : 6));
      if (c.mx && !c.lockFace) h.face = c.mx > 0 ? 1 : -1;
    }
    if (c.jumpP) {
      if (h.gr || h.airT < 0.1) { h.vy = -930 * (c.jmul || 1); h.gr = false; h.on = null; h.jumps = 1; h.hold = true; h.holdT = 0; h.slideT = 0; AU.sfx('jump'); dust(h.x, h.y, 6); }
      else if (h.jumps < 2 && c.canDouble !== false) { h.vy = -840 * (c.jmul || 1); h.jumps = 2; h.flipT = 0.45; h.hold = true; h.holdT = 0; AU.sfx('djump'); ART.spawn('ring', h.x, h.y - 40, { r: 10, life: 0.35, col: 'rgba(255,240,200,0.9)', speed: 0 }); }
    }
    if (!c.jumpHeld) h.hold = false;
    var gm = (h.hold && h.vy < 0 && h.holdT < 0.22) ? 0.5 : 1; if (h.hold) h.holdT += dt;
    if (c.downP) {
      if (h.gr) { if (h.slideT <= 0) { h.slideT = 0.62; AU.sfx('slide'); dust(h.x, h.y, 5); } }
      else { h.vy = Math.max(h.vy, 1350); h.qSlide = true; }
    }
    h.crouch = !!c.crouch && h.gr;
    // horizontal move + solids
    var px = h.x; h.x += h.vx * dt;
    if (c.minX != null) h.x = Math.max(c.minX, h.x); if (c.maxX != null) h.x = Math.min(c.maxX, h.x);
    var hb = hbox(h);
    for (var i = 0; i < w.solids.length; i++) {
      var s = w.solids[i]; if (s.off) continue;
      var sb = [s.x, s.y, s.x + s.w, s.y + s.h];
      if (overlap(hb, sb) && h.y > s.y + 6) {
        if (px <= s.x + 2) h.x = s.x - (hb[2] - h.x) - 0.5; else if (px >= s.x + s.w - 2) h.x = s.x + s.w + (h.x - hb[0]) + 0.5;
        if (s.onSide) s.onSide(h, px < s.x ? -1 : 1);
        hb = hbox(h);
      }
    }
    // stepping into much higher ground acts as a wall
    var gyNew = groundAt(w, h.x), gyOld = groundAt(w, px);
    if (h.gr && gyNew != null && gyOld != null && gyNew < h.y - 30) h.x = px;
    // vertical
    h.vy += GRAV * gm * dt; if (h.vy > 1500) h.vy = 1500;
    var py = h.y; h.y += h.vy * dt;
    var wasGr = h.gr; h.gr = false; var land = null, landOn = null;
    var gy = groundAt(w, h.x);
    if (gy != null && h.vy >= 0 && h.y >= gy && py <= gy + 26) { land = gy; }
    for (i = 0; i < w.plats.length; i++) {
      var p = w.plats[i]; if (p.off) continue;
      if (h.x > p.x - 8 && h.x < p.x + p.w + 8 && h.vy >= 0 && py <= p.y + 4 + Math.abs(p.dy || 0) && h.y >= p.y && (land == null || p.y < land)) { land = p.y; landOn = p; }
    }
    for (i = 0; i < w.solids.length; i++) {
      s = w.solids[i]; if (s.off) continue;
      if (h.x + 14 > s.x && h.x - 14 < s.x + s.w) {
        if (h.vy >= 0 && py <= s.y + 4 + Math.abs(s.dy || 0) && h.y >= s.y && (land == null || s.y < land)) { land = s.y; landOn = s; }
        else if (h.vy < 0 && py - 128 >= s.y + s.h - 2 && h.y - 128 < s.y + s.h && !(h.slideT > 0)) { h.y = s.y + s.h + 128; h.vy = 0; }
      }
    }
    if (land != null) {
      if (!wasGr && h.vy > 500) { h.landT = 0.12; dust(h.x, land, 7); AU.sfx('land'); if (h.vy > 1200) shake(4); }
      h.y = land; h.vy = 0; h.gr = true; h.jumps = 0; h.airT = 0; h.on = landOn; h.flipT = 0;
      if (h.qSlide) { h.qSlide = false; h.slideT = 0.62; AU.sfx('slide'); }
      if (!landOn) h.lastGround = h.x;
    } else { h.on = null; h.airT += dt; }
    if (h.slideT > 0 && h.slideT - dt <= 0 && h.gr && underCeiling(h, w)) h.slideT = dt + 0.04;
    if (h.slideT > 0) { h.slideT -= dt; if (h.gr && Math.random() < 0.5) dust(h.x - h.face * 20, h.y, 1); }
    if (h.flipT > 0) h.flipT = Math.max(0, h.flipT - dt);
    if (h.landT > 0) h.landT = Math.max(0, h.landT - dt);
    if (h.inv > 0) h.inv -= dt; if (h.hurtT > 0) h.hurtT -= dt; if (h.flashT > 0) h.flashT -= dt;
    h.phase += dt * Math.abs(h.vx) / 34;
    if (h.chainT > 0) h.chainT -= dt;
    if (h.atk) { h.atk.t += dt; if (h.atk.t >= h.atk.dur) h.atk = null; }
  }
  function underCeiling(h, w) { var b = [h.x - 17, h.y - 128, h.x + 17, h.y - 40]; for (var i = 0; i < w.solids.length; i++) { var s = w.solids[i]; if (!s.off && overlap(b, [s.x, s.y, s.x + s.w, s.y + s.h])) return true; } return false; }
  function dust(x, y, n) { ART.spawn('dust', x, y - 4, { n: n || 5, ang: -1.57, spread: 2.6, speed: 90, life: 0.5, r: 5, col: 'rgba(210,190,160,0.55)', g: 120, drag: 2 }); }
  function sparks(x, y, col, n) { ART.spawn('spark', x, y, { n: n || 10, speed: 380, life: 0.32, col: col || '#ffd27a', g: 600 }); ART.spawn('glow', x, y, { n: 1, speed: 0, life: 0.18, r: 22, col: 'rgba(255,220,150,0.8)' }); }
  // attack chain: 1 tap light, 2 taps heavy, 3 taps special (needs full meter) - runner's slash()
  function attackPress(h, onFire) {
    if (h.chainT > 0 && h.chainN < 3) h.chainN++; else h.chainN = 1;
    h.chainT = 0.36;
    var n = h.chainN;
    if (n === 3 && G.meter < 100) { n = 2; pop(h.x, h.y - 170, T('needMeter'), '#ffd0a0', 18); }
    if (n === 3) { G.meter = 0; flash(0.35, '255,230,160'); shake(8); }
    h.atk = { n: n, t: 0, dur: [0.22, 0.34, 0.55][n - 1], hit: {}, done: false };
    if (h.A.melee) AU.sfx(n === 1 ? 'swing' : n === 2 ? 'cleave' : 'spin');
    else AU.sfx(n === 1 ? 'bow' : n === 2 ? 'bowHeavy' : 'astra');
    if (onFire) onFire(h, n);
    return n;
  }
  function meleeBox(h) {
    var a = h.atk; if (!a) return null;
    if (a.n === 3) return [h.x - 270, h.y - 200, h.x + 270, h.y + 10];
    var reach = a.n === 1 ? 120 : 150;
    return h.face > 0 ? [h.x - 10, h.y - 150, h.x + reach, h.y] : [h.x - reach, h.y - 150, h.x + 10, h.y];
  }
  function meleeActive(h) { var a = h.atk; return a && h.A.melee && a.t >= a.dur * 0.2 && a.t <= a.dur * 0.75; }
  // arrows
  function fireArrows(list, h, n) {
    var y = h.y - (h.gr ? 92 : 98), x = h.x + h.face * 40;
    var mk = function (ang, dmg, glow) { list.push({ x: x, y: y, vx: Math.cos(ang) * 1150 * h.face, vy: Math.sin(ang) * 1150, dmg: dmg, n: n, life: 1.4, glow: glow, owner: h.id, hits: {} }); };
    if (n === 1) mk(0, 1, false); else if (n === 2) mk(0, 2, true); else { mk(-0.09, 3, true); mk(0, 3, true); mk(0.09, 3, true); }
  }
  function drawArrow(g, a, camX) {
    var x = a.x - camX, y = a.y, ang = Math.atan2(a.vy, a.vx);
    g.save(); g.translate(x, y); g.rotate(ang);
    if (a.glow) { ART.glow(g, 0, 0, 34, 'rgba(255,230,140,0.9)', 0.9); g.strokeStyle = 'rgba(255,240,190,0.6)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-70, 0); g.lineTo(0, 0); g.stroke(); }
    g.strokeStyle = '#6a4222'; g.lineWidth = 3; g.beginPath(); g.moveTo(-34, 0); g.lineTo(14, 0); g.stroke();
    g.fillStyle = '#d8d8e0'; g.beginPath(); g.moveTo(22, 0); g.lineTo(12, -4.5); g.lineTo(12, 4.5); g.fill();
    g.fillStyle = a.glow ? '#bfe6ff' : '#c84a2a'; g.beginPath(); g.moveTo(-34, 0); g.lineTo(-42, -6); g.lineTo(-28, 0); g.lineTo(-42, 6); g.fill();
    g.restore();
  }

  // ---------------- shared scenery ----------------
  function theme(n) { return ART.THEMES[n] || ART.THEMES.ash; }
  function drawBackdrop(th, camX, o) {
    o = o || {};
    ART.plate(g, th.plate, camX, o.par == null ? 0.16 : o.par, W, H, o.yoff == null ? -26 : o.yoff, o.zoom);
    if (th.weather === 'stars') { /* twinkles in weather */ }
    if (!o.noMid && th.mid && th.mid.length) ART.midLayer(g, th, camX, 0.5, W, GY + 4, o.midS || 0.82, null, 3.7);
    ART.haze(g, W, H, th.haze, 0, o.hazeA == null ? 0.22 : o.hazeA, H * 0.3);
    if (th.weather === 'mist') { ART.fog(g, W, H, camX, G.t, GY - 150, 0.28); ART.fog(g, W, H, camX * 1.3 + 700, G.t * 1.4, GY - 60, 0.22); }
  }
  function drawForeground(th, camX) {
    if (!th.fg) return;
    var spacing = 760, par = 1.3, off = camX * par, i0 = Math.floor(off / spacing) - 1;
    for (var i = i0; i < i0 + Math.ceil(W / spacing) + 2; i++) {
      var h = Math.abs(Math.sin(i * 7.31 + 1.7) * 9973.1) % 1; if (h < 0.45) continue;
      var x = i * spacing - off + h * 300, nm = th.fg === 'pine' ? 'pine' : th.fg === 'ash' ? 'deadtree' : th.fg === 'leaves' ? 'banana' : 'reeds';
      SPR.draw(g, 'scen', nm, x, H + (nm === 'reeds' ? 30 : 140), { s: nm === 'reeds' ? 0.8 : 1.1, cx: true, tint: '#160c06', tintA: 0.88, face: h > 0.7 ? -1 : 1 });
    }
  }
  function drawGrade(th) {
    if (th.grade) { g.fillStyle = th.grade; g.fillRect(0, 0, W, H); }
    ART.vignette(g, W, H, 0.42);
  }

  // ---------------- dialogue ----------------
  function Dialog(lines, onDone) { this.lines = lines; this.i = 0; this.ch = 0; this.done = false; this.onDone = onDone; this.wait = 0; }
  Dialog.prototype.cur = function () { return this.lines[this.i]; };
  Dialog.prototype.text = function () { return tr(this.cur()); };
  Dialog.prototype.full = function () { return this.ch >= this.text().length; };
  Dialog.prototype.update = function (dt) {
    if (this.done) return;
    var before = Math.floor(this.ch); this.ch = Math.min(this.text().length, this.ch + dt * (SAVE.lang === 'hi' ? 40 : 52));
    if (Math.floor(this.ch) !== before && Math.floor(this.ch) % 4 === 0 && !this.full()) AU.sfx('talk');
    this.wait += dt;
  };
  Dialog.prototype.advance = function () {
    if (this.done) return;
    if (!this.full()) { this.ch = this.text().length; return; }
    AU.sfx('tap'); this.i++; this.ch = 0; this.wait = 0;
    if (this.i >= this.lines.length) { this.done = true; if (this.onDone) this.onDone(); }
  };
  Dialog.prototype.draw = function (g, hint) {
    if (this.done) return;
    var ln = this.cur(), who = CAST[ln.who] || CAST.narrator, bx = 26, bw = W - 52, bh = 128, by = H - bh - 14;
    ART.panel(g, bx, by, bw, bh, { r: 18 });
    var tx = bx + 26;
    if (who.sh) {
      var pc = SPR.portrait(who.sh, who.fr, who.sh === 'npc' ? 0.26 : 0.3);
      if (pc) {
        g.save(); g.beginPath(); g.arc(bx + 70, by + 64, 48, 0, 6.283); g.fillStyle = 'rgba(255,220,160,0.18)'; g.fill(); g.clip();
        var s = 104 / pc.height; g.drawImage(pc, bx + 70 - pc.width * s / 2, by + 14, pc.width * s, pc.height * s); g.restore();
        g.beginPath(); g.arc(bx + 70, by + 64, 48, 0, 6.283); g.lineWidth = 3; g.strokeStyle = '#f2cf6a'; g.stroke();
        tx = bx + 136;
      }
    }
    ART.text(g, tr(who.name), tx, by + 32, { size: 19, gold: true, sw: 3 });
    var lines = ART.wrap(g, this.text().slice(0, Math.floor(this.ch)), bw - (tx - bx) - 30, SAVE.lang === 'hi' ? 22 : 21);
    for (var i = 0; i < lines.length && i < 3; i++) ART.text(g, lines[i], tx, by + 62 + i * 27, { size: SAVE.lang === 'hi' ? 22 : 21, col: ln.who === 'narrator' ? '#f6e6c4' : '#fff8ea', sw: 3 });
    if (this.full()) {
      var a = 0.55 + 0.45 * Math.sin(G.t * 5);
      g.globalAlpha = a; ART.text(g, hint || T('tapCont'), bx + bw - 22, by + bh - 14, { size: 14, align: 'right', col: '#ffe9b0', sw: 3 }); g.globalAlpha = 1;
    }
  };

  // ---------------- STORY mode (tap the highlighted speaker) ----------------
  function StoryMode(seg) {
    var th = theme(seg.theme), M = { kind: 'story', touch: 'story', swipes: false, t: 0, done: false };
    var actors = seg.cast.map(function (c) { var d = CAST[c.id]; return { id: c.id, sh: d.sh, fr: c.fr || d.fr, x: c.x * W, y: H - 26, face: c.face, s: c.s || 1 }; });
    var dlg = new Dialog(seg.lines, function () { M.doneT = 0.6; });
    function nextSpeaker() { var ln = seg.lines[dlg.i + 1]; if (!ln) return null; for (var i = 0; i < actors.length; i++) if (actors[i].id === ln.who) return actors[i]; return null; }
    function box(a) { var r = SPR.size(a.sh, a.fr); return [a.x - 80, a.y - r.h * a.s * 0.95, a.x + 80, a.y]; }
    M.update = function (dt) {
      M.t += dt; dlg.update(dt);
      if (M.doneT != null) { M.doneT -= dt; if (M.doneT <= 0) M.done = true; }
      if (IN.confirmP() || IN.atkP() || IN.jumpP()) dlg.advance();
    };
    M.tap = function (x, y) {
      if (dlg.done) return;
      if (!dlg.full()) { dlg.advance(); return; }
      var ns = nextSpeaker();
      if (y > H - 150) { dlg.advance(); return; }
      if (!ns) { dlg.advance(); return; }
      var b = box(ns); if (x > b[0] && x < b[2] && y > b[1] && y < b[3]) dlg.advance(); else { M.nudge = 0.5; AU.sfx('click'); }
    };
    M.ai = function (c) { if (dlg.full() && dlg.wait > 0.7) { var ns = nextSpeaker(); if (ns) { var b = box(ns); M.tap((b[0] + b[2]) / 2, (b[1] + b[3]) / 2); } else dlg.advance(); dlg.wait = 0; } };
    M.draw = function () {
      var z = 1.1 + Math.sin(M.t * 0.08) * 0.02;
      ART.plate(g, th.plate, M.t * 6, 1, W, H, -10, z);
      ART.haze(g, W, H, [10, 5, 0], 0, seg.dim ? 0.7 : 0.45, H * 0.45);
      if (seg.dim) { g.fillStyle = 'rgba(10,5,30,0.35)'; g.fillRect(0, 0, W, H); }
      var cur = dlg.cur() && dlg.cur().who, ns = dlg.full() ? nextSpeaker() : null;
      actors.forEach(function (a) {
        var speaking = a.id === cur, hl = ns === a;
        ART.shadow(g, a.x, a.y, 60 * a.s, 0.4);
        if (hl) { var p = 0.6 + 0.4 * Math.sin(M.t * 5); ART.glow(g, a.x, a.y - 120 * a.s, 170 * a.s, 'rgba(255,215,120,' + (0.45 * p) + ')'); }
        var bob = speaking ? Math.sin(M.t * 7) * 1.5 : 0;
        if (!SPR.draw(g, a.sh, a.fr, a.x, a.y + bob, { s: a.s, face: a.face, sy: 1 + Math.sin(M.t * 2 + a.x) * 0.01, alpha: speaking || hl || !cur ? 1 : 0.92 }))
          ART.fallbackFigure(g, a.x, a.y, 300 * a.s, '#a0603a', a.face);
        if (hl) {
          var r = SPR.size(a.sh, a.fr), ty = a.y - r.h * a.s - 22 + Math.sin(M.t * 6) * 6;
          g.fillStyle = '#ffe27a'; g.beginPath(); g.moveTo(a.x - 14, ty - 14); g.lineTo(a.x + 14, ty - 14); g.lineTo(a.x, ty + 4); g.fill();
          ART.text(g, T('tap'), a.x, ty - 22, { size: 16, align: 'center', col: '#ffe9b0' });
        }
      });
      ART.vignette(g, W, H, 0.5);
      dlg.draw(g, ns ? T('tapNext') : T('tapCont'));
    };
    M.dlg = dlg;
    return M;
  }

  // ---------------- PLATFORM mode ----------------
  var PLAT_SPR = { ledgeRuin: 'ledgeRuin', ledgePalace: 'ledgePalace', plank: 'plank', ledgeRock: 'ledgeRock' };
  function PlatformMode(seg, L) {
    var th = theme(seg.theme), M = { kind: 'platform', touch: seg.partner ? 'duo' : (seg.noAttack ? 'noatk' : 'platform'), swipes: true, t: 0, done: false, fail: null };
    var w = { segs: [], plats: [], solids: [] }, len = seg.len;
    seg.ground.forEach(function (gd) {
      var k = gd[2] || 'ground';
      if (k === 'pool') w.segs.push({ x0: gd[0], x1: gd[1], y0: GY + 26, y1: GY + 26, k: 'pool' });
      else if (k === 'sandpit') { M.sandpit = [gd[0], gd[1]]; }
      else w.segs.push({ x0: gd[0], x1: gd[1], y0: gd[3] || GY, y1: gd[3] || GY, k: k });
    });
    var pits = []; for (var i = 0; i < w.segs.length - 1; i++) if (w.segs[i + 1].x0 > w.segs[i].x1 + 2) pits.push([w.segs[i].x1, w.segs[i + 1].x0]);
    if (M.sandpit) pits.push(M.sandpit);
    (seg.plats || []).forEach(function (p) { w.plats.push({ x0: p.x, y0: p.y, x: p.x, y: p.y, w: p.w, k: p.k, mx: p.mx || 0, my: p.my || 0, per: p.per || 4, seq: p.seq, dx: 0, dy: 0 }); });
    (seg.solids || []).forEach(function (s) { w.solids.push({ x: s.x, y: s.y != null ? s.y : GY - s.h, w: s.w, h: s.h, k: s.k, boost: s.boost }); });
    var carts = (seg.carts || []).map(function (c) { var s = { x: c.x0, y: GY - 74, w: 150, h: 74, k: 'cart', cart: c, dir: 1, dx: 0 }; w.solids.push(s); return s; });
    var dogs = (seg.dogs || []).map(function (d) { return { x: d.x, st: 'sleep', t: 0, cyc: 0 }; });
    var foes = (seg.foes || []).map(function (f) { return { t: f.t, x: f.x, home: f.x, y: GY, hp: f.t === 'spirit' ? 2 : 1, st: 'idle', tt: 0, face: -1, vx: 0, hurt: 0, dead: false, ph: Math.random() * 6 }; });
    var items = (seg.items || []).map(function (it) { return { t: it.t, x: it.x, y: it.y, got: false, hidden: it.hidden, bob: Math.random() * 6 }; });
    var targets = (seg.targets || []).map(function (t) { return { x0: t.x, y0: t.y, x: t.x, y: t.y, mx: t.mx || 0, my: t.my || 0, per: t.per || 3, hp: t.hp || 1, max: t.hp || 1, dummy: t.dummy, big: t.big, dead: false, flash: 0, ph: Math.random() * 3, lastBy: {} }; });
    var wilds = (seg.wilds || []).map(function (wd) { return { t: wd.t, x: wd.x, y: wd.y, hit: 0 }; });
    var swings = (seg.swings || []).map(function (s) { return { x: s.x, y: s.y, len: s.len, a: 0, ph: Math.random() * 3 }; });
    var boar = seg.boar ? { x: seg.boar.x1, x0: seg.boar.x0, x1: seg.boar.x1, hp: seg.boar.hp, max: seg.boar.hp, dir: -1, st: 'pause', t: 1, dead: false, flash: 0 } : null;
    var npcs = (seg.npcs || []).map(function (n) { var d = CAST[n.id]; return { id: n.id, sh: d.sh, fr: d.fr, x: n.x, face: n.face, key: n.key, lines: n.lines, talked: false }; });
    var tips = (seg.tips || []).map(function (t) { return { x: t.x, t: t.t, shown: false }; });
    var cps = seg.checkpoints || [60], cp = cps[0];
    var flags = {}, arrows = [], dlg = null, goalT = 0, seqNext = 0, seqFailT = 0, poolT = 0, timeLeft = seg.timeLimit || 0, arrowsLeft = seg.arrows || 0;
    var hero = makeHero(seg.hero, 80, GY), party = [hero], ai = 0;
    if (seg.partner) { var p2 = makeHero(seg.partner, 10, GY); party.push(p2); }
    M.hero = hero; M.party = party;
    function active() { return party[ai]; }
    G.cam = 0;
    function respawn(h, msg) {
      h.x = cp; h.y = GY - 200; h.vx = 0; h.vy = 0; h.inv = 1.2; h.slideT = 0;
      if (party.length > 1) party.forEach(function (b, k) { b.x = cp - k * 50; b.y = GY - 200; b.vy = 0; });
      if (msg) pop(h.x, GY - 180, msg, '#ffe0b0', 22);
    }
    function hurt(h, dmg, kx, msg) {
      if (h.inv > 0 || M.done) return;
      G.pips -= dmg || 1; G.stats.hits++; h.inv = 1.6; h.hurtT = 0.32; h.vx = (kx || -h.face) * 380; h.vy = -380; h.gr = false;
      AU.sfx('hurt'); shake(9); flash(0.25, '255,60,40'); vibe(60);
      if (msg) pop(h.x, h.y - 160, msg, '#ff9a7a', 20);
      if (G.pips <= 0) { if (DEMO) G.pips = 1; else M.fail = T('outOfPips'); }
    }
    function addMeter(v) { G.meter = Math.min(100, G.meter + v); if (G.meter >= 100 && !M.meterPop) { M.meterPop = true; pop(active().x, GY - 190, 'SPECIAL ×3', '#ffe27a', 24); AU.sfx('good'); } if (G.meter < 100) M.meterPop = false; }
    function hitTarget(t, dmg, who, perfectOK) {
      if (t.dead) return;
      t.hp -= dmg; t.flash = 0.2; G.score += 50;
      var glowing = !t.dummy && (Math.sin(G.t * 3.5 + t.ph) > 0.55);
      if (party.length > 1) {
        t.lastBy[who] = M.t;
        var other = who === 'rama' ? 'lak' : 'rama';
        if (t.lastBy[other] != null && M.t - t.lastBy[other] < 1.6 && !t.tog) { t.tog = true; G.stats.together++; pop(t.x, t.y - 90, T('together'), '#9affc0', 26); AU.sfx('perfect'); addMeter(30); }
        else if (t.tog && M.t - (t.lastBy[other] || -9) > 1.6) t.tog = false;
      }
      if (perfectOK && glowing) { G.stats.perfect++; pop(t.x, t.y - 60, T('perfect'), '#ffe27a', 24); AU.sfx('perfect'); addMeter(25); G.score += 150; }
      else AU.sfx('thunk');
      sparks(t.x, t.y, '#ffe0a0', 8); ART.spawn('chip', t.x, t.y, { n: 6, speed: 220, life: 0.6, r: 3, col: '#d8b860', g: 700 });
      if (t.hp <= 0) { t.dead = true; G.score += 100; addMeter(15); if (t.dummy) { ART.spawn('chip', t.x, t.y - 40, { n: 18, speed: 320, life: 0.9, r: 4, col: '#d8b860', g: 800 }); AU.sfx('crack'); shake(5); } }
    }
    function hitFoe(f, dmg, kx) {
      if (f.dead) return;
      f.hp -= dmg; f.hurt = 0.25; f.vx = kx * 260; f.st = 'stagger'; f.tt = 0.35; hitstop(0.05); shake(5); sparks(f.x, f.y - 60, '#ffb070', 12); AU.sfx('hit');
      addMeter(20);
      if (f.hp <= 0) { f.dead = true; G.score += 100; ART.spawn('smoke', f.x, f.y - 60, { n: 14, speed: 120, life: 1, r: 18, col: 'rgba(40,30,30,1)' }); ART.spawn('ember', f.x, f.y - 60, { n: 16, speed: 240, life: 0.9, r: 2.4, col: '#ff8a3a' }); }
    }
    function onFire(h, n) {
      if (seg.noAttack) return;
      if (!h.A.melee) {
        if (seg.arrows) { if (arrowsLeft <= 0) { pop(h.x, h.y - 170, T('arrows') + ': 0', '#ffb0a0', 20); return; } arrowsLeft--; }
        fireArrows(arrows, h, n);
        if (n === 3) ART.spawn('ring', h.x + h.face * 40, h.y - 92, { r: 14, life: 0.5, col: 'rgba(255,230,160,0.9)', speed: 0 });
      }
    }
    function talkable() { var h = active(); for (var i = 0; i < npcs.length; i++) if (!npcs[i].talked && Math.abs(npcs[i].x - h.x) < 130) return npcs[i]; return null; }
    function openTalk(n) { dlg = new Dialog(n.lines, function () { n.talked = true; flags[n.key] = true; dlg = null; }); }
    function goalNeeds() {
      var goal = seg.goal; if (!goal) return true;
      if (goal.need) for (var i = 0; i < goal.need.length; i++) if (!flags[goal.need[i]]) return false;
      if (seg.needTargets) { for (i = 0; i < targets.length; i++) if (!targets[i].dead) return false; if (boar && !boar.dead) return false; }
      return true;
    }
    M.tap = function (x, y) {
      if (dlg) { dlg.advance(); return true; }
      var n = talkable(); if (n) { var sx = n.x - G.cam; if (Math.abs(x - sx) < 110 && y > GY - 260 && y < GY + 20) { openTalk(n); return true; } }
      return false;
    };
    M.drillFail = function (msg) { if (DEMO && seg.drill) { G.stats.drillRetries++; M.restart = true; return; } M.restart = true; G.stats.drillRetries++; banner(msg || T('drillFail'), tr(seg.drillName), 1.8); };
    M.update = function (dt) {
      M.t += dt;
      if (dlg) { dlg.update(dt); if (IN.confirmP() || IN.atkP() || IN.jumpP()) dlg.advance(); return; }
      if (M.endDlg) { M.endDlg.update(dt); if (IN.confirmP() || IN.atkP() || IN.jumpP()) M.endDlg.advance(); if (M.doneT != null) { M.doneT -= dt; if (M.doneT <= 0) M.done = true; } return; }
      // tag (L8)
      if (party.length > 1 && IN.tagP()) { ai = 1 - ai; AU.sfx('click'); pop(active().x, active().y - 170, active().id === 'rama' ? 'Rama' : 'Lakshmana', '#fff2c0', 20); ART.spawn('ring', active().x, active().y - 60, { r: 12, life: 0.4, col: 'rgba(255,240,180,0.9)', speed: 0 }); }
      var h = active();
      // timers
      if (seg.timeLimit) { timeLeft -= dt; if (timeLeft <= 0) { M.drillFail(); return; } }
      // moving platforms / carts
      w.plats.forEach(function (p) {
        var ox = p.x, oy = p.y;
        if (p.mx) p.x = p.x0 + Math.sin(M.t * 6.283 / p.per) * p.mx; if (p.my) p.y = p.y0 + Math.sin(M.t * 6.283 / p.per) * p.my;
        p.dx = p.x - ox; p.dy = p.y - oy;
      });
      carts.forEach(function (c) {
        var ox = c.x; c.x += c.dir * c.cart.speed * dt;
        if (c.x > c.cart.x1) { c.x = c.cart.x1; c.dir = -1; } if (c.x < c.cart.x0) { c.x = c.cart.x0; c.dir = 1; }
        c.dx = c.x - ox;
        c.onSide = function (b, side) { if (Math.abs(b.x - (c.x + c.w / 2)) < c.w / 2 + 30 && b.inv <= 0) { b.vx = side * 460; b.vy = -320; b.gr = false; b.inv = 0.6; pop(b.x, b.y - 150, T('oof'), '#ffe0b0', 20); AU.sfx('land'); G.stats.bumps = (G.stats.bumps || 0) + 1; } };
      });
      // controls
      var mx = IN.mx(), jp = IN.jumpP(), jh = IN.jumpHeld(), dp = IN.downP();
      if (goalT <= 0 && seg.goal && !goalNeeds() && h.x > seg.goal.x - 60 && mx > 0) { mx = 0; if (!M.blockPop || M.t - M.blockPop > 2.5) { M.blockPop = M.t; pop(h.x, h.y - 170, tr(seg.goal.blocked) || '…', '#ffe0b0', 18); } }
      var inPool = false, sg = segAt(w, h.x); if (sg && sg.k === 'pool' && h.gr) inPool = true;
      physHero(h, dt, w, { mx: mx, jumpP: jp, jumpHeld: jh, downP: dp, slow: inPool ? 0.55 : 1, minX: 20, maxX: len - 20 });
      if (seg.goal && !goalNeeds()) h.x = Math.min(h.x, seg.goal.x - 20);
      // pool dawdle (L2)
      if (inPool) { poolT += dt; if (Math.random() < 0.3) ART.spawn('drop', h.x + (Math.random() - 0.5) * 30, h.y - 10, { speed: 120, ang: -1.57, spread: 1.4, life: 0.5, r: 2.4, col: 'rgba(200,235,255,0.8)', g: 600 }); if (poolT > 2.4) { poolT = 0; G.stats.falls++; AU.sfx('splash'); hurt(h, 1); respawn(h, T('splash')); } }
      else poolT = 0;
      // attack
      if (!seg.noAttack && IN.atkP()) {
        var nT = talkable(); if (nT) openTalk(nT); else attackPress(h, onFire);
      } else if (seg.noAttack && (IN.atkP() || IN.confirmP())) { var n2 = talkable(); if (n2) openTalk(n2); }
      if (!seg.noAttack && IN.confirmP()) { var n3 = talkable(); if (n3) openTalk(n3); }
      // partner AI (follows, joins attacks)
      if (party.length > 1) partnerAI(party[1 - ai], h, dt);
      party.forEach(function (b) { if (meleeActive(b)) meleeResolve(b); });
      // pits
      party.forEach(function (b) {
        if (b.y > H + 60) {
          var inSand = M.sandpit && b.x > M.sandpit[0] && b.x < M.sandpit[1];
          if (inSand && seg.failOnPit) { AU.sfx('land'); M.drillFail(); return; }
          if (b === h) { G.stats.falls++; ART.spawn('ember', b.x, H, { n: 20, ang: -1.57, spread: 1, speed: 300, life: 0.8, r: 3, col: '#ff8a3a' }); AU.sfx('fire'); hurt(b, 1); respawn(b); }
          else { b.x = h.x - 40 * b.face; b.y = h.y - 200; b.vy = 0; }
        }
      });
      if (M.restart) return;
      // checkpoints & tips
      for (var c = 0; c < cps.length; c++) if (h.x > cps[c] && cps[c] > cp && groundAt(w, cps[c]) != null) { cp = cps[c]; AU.sfx('tick'); }
      tips.forEach(function (tp) { if (!tp.shown && h.x > tp.x) { tp.shown = true; G.tip = tr(tp.t); G.tipT = 6; } });
      // dummy-post sequence (L2)
      if (seg.seq) {
        if (h.gr && h.on && h.on.seq != null) { if (h.on.seq === seqNext) { seqNext++; AU.sfx('tick'); ART.spawn('ring', h.x, h.y, { r: 8, life: 0.4, col: 'rgba(255,240,180,0.9)', speed: 0 }); if (seqNext >= seg.seq.posts && !flags.seq) { flags.seq = true; pop(h.x, h.y - 170, T('clean'), '#ffe27a', 26); AU.sfx('perfect'); G.score += 300; } } else if (h.on.seq > seqNext) { seqNext = 0; } }
        else if (h.gr && !h.on && !flags.seq && seqNext > 0 && h.x > seg.seq.x0 && h.x < seg.seq.x1) { seqNext = 0; pop(h.x, h.y - 160, T('again'), '#ffe0b0', 20); G.stats.falls += 0; }
      }
      // items
      items.forEach(function (it) {
        if (it.got) return;
        if (Math.abs(it.x - h.x) < 46 && h.y > it.y - 60 && h.y - 130 < it.y + 10) {
          it.got = true; G.score += 250;
          if (it.t === 'standard') { G.stats.standards++; AU.sfx('standard'); pop(it.x, it.y - 120, T('standard') + ' ' + G.stats.standards + '/3', '#ffe27a', 22); addMeter(20); }
          else if (it.t === 'lotus') { G.stats.lotus++; AU.sfx('pickup'); pop(it.x, it.y - 100, T('lotusFound'), '#ffb6d0', 24); }
          ART.spawn('star', it.x, it.y - 30, { n: 12, speed: 160, life: 0.8, r: 6, col: 'rgba(255,230,150,1)' });
        }
      });
      // dogs (sleep 3.2 s, stir 1 s, awake 2 s)
      dogs.forEach(function (d) {
        d.t += dt; var cyc = d.st === 'sleep' ? 3.2 : d.st === 'stir' ? 1.0 : 2.0;
        if (d.t > cyc) { d.t = 0; d.st = d.st === 'sleep' ? 'stir' : d.st === 'stir' ? 'awake' : 'sleep'; if (d.st === 'awake') AU.sfx('bark'); }
        if (d.st === 'awake' && Math.abs(h.x - d.x) < 150 && h.inv <= 0) { G.stats.falls++; AU.sfx('bark'); shake(4); pop(h.x, h.y - 170, T('woof'), '#ffe0b0', 22); h.inv = 1; var back = d.x - 360; h.x = back; h.y = GY - 120; h.vx = 0; }
      });
      // foes
      foes.forEach(function (f) { if (!f.dead) foeUpdate(f, h, dt); });
      // swings
      swings.forEach(function (s) { s.a = Math.sin(M.t * 1.7 + s.ph) * 1.05; var bx = s.x + Math.sin(s.a) * s.len, by = s.y + Math.cos(s.a) * s.len; s.bx = bx; s.by = by; party.forEach(function (b) { if (b === h && overlap(hbox(b), [bx - 26, by - 30, bx + 26, by + 30])) hurt(b, 1, Math.cos(s.a) > 0 ? 1 : -1); }); });
      // boar on its rail
      if (boar && !boar.dead) {
        boar.t -= dt; boar.flash = Math.max(0, boar.flash - dt);
        if (boar.st === 'pause') { if (boar.t <= 0) { boar.st = 'run'; AU.sfx('growl'); } }
        else { boar.x += boar.dir * 300 * dt; if (Math.random() < 0.4) dust(boar.x - boar.dir * 50, GY, 1); if (boar.x < boar.x0 || boar.x > boar.x1) { boar.x = clamp(boar.x, boar.x0, boar.x1); boar.dir *= -1; boar.st = 'pause'; boar.t = 1.1; } }
        party.forEach(function (b) { if (b === h && boar.st === 'run' && overlap(hbox(b), [boar.x - 70, GY - 90, boar.x + 70, GY])) hurt(b, 1, boar.dir); });
      }
      // targets move
      targets.forEach(function (t) { if (t.mx) t.x = t.x0 + Math.sin(M.t * 6.283 / t.per) * t.mx; if (t.my) t.y = t.y0 + Math.sin(M.t * 6.283 / t.per) * t.my; t.flash = Math.max(0, t.flash - dt); });
      // arrows
      for (var ai2 = arrows.length - 1; ai2 >= 0; ai2--) {
        var a = arrows[ai2]; a.x += a.vx * dt; a.y += a.vy * dt; a.life -= dt; var gone = a.life <= 0;
        for (var s2 = 0; s2 < w.solids.length && !gone; s2++) { var so = w.solids[s2]; if (a.x > so.x && a.x < so.x + so.w && a.y > so.y && a.y < so.y + so.h) { gone = true; sparks(a.x, a.y, '#ccb090', 4); AU.sfx('thunk'); } }
        for (var t2 = 0; t2 < targets.length && !gone; t2++) { var tg = targets[t2]; if (tg.dead) continue; var rr = tg.dummy ? 36 : (tg.big ? 44 : 36); if (Math.abs(a.x - tg.x) < rr && Math.abs(a.y - (tg.dummy ? tg.y - 60 : tg.y)) < (tg.dummy ? 70 : rr)) { hitTarget(tg, a.dmg, a.owner, true); if (a.n < 2) gone = true; } }
        for (var f2 = 0; f2 < foes.length && !gone; f2++) { var fo = foes[f2]; if (!fo.dead && Math.abs(a.x - fo.x) < 40 && a.y > fo.y - 140 && a.y < fo.y) { hitFoe(fo, a.dmg, Math.sign(a.vx)); if (a.n < 2) gone = true; } }
        for (var w2 = 0; w2 < wilds.length && !gone; w2++) { var wd = wilds[w2]; if (Math.abs(a.x - wd.x) < 32 && Math.abs(a.y - (wd.y - 35)) < 35) { gone = true; wd.hit = 0.8; G.stats.wild++; AU.sfx(wd.t === 'bell' ? 'bell' : 'crack'); pop(wd.x, wd.y - 110, T('wild'), '#ff9a7a', 22); shake(4); } }
        if (boar && !boar.dead && !gone && Math.abs(a.x - boar.x) < 70 && a.y > GY - 100) { gone = true; boarHit(a.dmg, a.owner); }
        if (gone) arrows.splice(ai2, 1);
      }
      if (seg.arrows && arrowsLeft <= 0 && arrows.length === 0 && !goalNeeds()) { M.drillFail(); return; }
      // goal
      if (seg.goal && h.x > seg.goal.x - 40 && goalNeeds() && goalT <= 0) {
        goalT = 1; AU.sfx('level'); ART.spawn('star', seg.goal.x, GY - 100, { n: 30, speed: 260, life: 1.2, r: 7, col: 'rgba(255,230,150,1)' });
        if (seg.goal.line) { M.endDlg = new Dialog(seg.goal.line, function () { M.done = true; }); } else M.doneT = 0.8;
      }
      if (M.doneT != null) { M.doneT -= dt; if (M.doneT <= 0) M.done = true; }
      // camera
      var tx = clamp(h.x - W * 0.4, 0, Math.max(0, len - W)); G.cam += (tx - G.cam) * Math.min(1, dt * 6);
      AU.setIntensity(0.3 + (foes.some(function (f) { return !f.dead && Math.abs(f.x - h.x) < 600; }) ? 0.6 : 0) + (boar && !boar.dead && Math.abs(boar.x - h.x) < 700 ? 0.6 : 0));
    };
    M.updateEndDlg = function (dt) { if (M.endDlg) { M.endDlg.update(dt); if (IN.confirmP() || IN.atkP() || IN.jumpP()) M.endDlg.advance(); } };
    function boarHit(dmg, who) {
      boar.hp -= dmg; boar.flash = 0.18; sparks(boar.x, GY - 60, '#ffe0a0', 10); AU.sfx('thunk'); hitstop(0.04); shake(4);
      if (who) { boar.lastBy = boar.lastBy || {}; boar.lastBy[who] = M.t; var other = who === 'rama' ? 'lak' : 'rama'; if (boar.lastBy[other] != null && M.t - boar.lastBy[other] < 1.6 && M.t - (boar.togT || -9) > 1.6) { boar.togT = M.t; G.stats.together++; pop(boar.x, GY - 150, T('together'), '#9affc0', 26); AU.sfx('perfect'); } }
      if (boar.hp <= 0) { boar.dead = true; slowmo(0.6); shake(12); flash(0.4); AU.sfx('smash'); pop(boar.x, GY - 170, T('boarBeaten'), '#ffe27a', 30); ART.spawn('chip', boar.x, GY - 50, { n: 40, speed: 420, life: 1.2, r: 5, col: '#d8b860', g: 900 }); G.score += 800; }
    }
    function meleeResolve(b) {
      var mb = meleeBox(b), dmg = b.atk.n; if (!mb) return;
      targets.forEach(function (t, k) { if (t.dead || b.atk.hit['t' + k]) return; var tb = t.dummy ? [t.x - 30, t.y - 120, t.x + 30, t.y] : [t.x - 30, t.y - 30, t.x + 30, t.y + 30]; if (overlap(mb, tb)) { b.atk.hit['t' + k] = 1; hitTarget(t, dmg, b.id, false); hitstop(0.04); } });
      foes.forEach(function (f, k) { if (f.dead || b.atk.hit['f' + k]) return; if (overlap(mb, [f.x - 40, f.y - 140, f.x + 40, f.y])) { b.atk.hit['f' + k] = 1; hitFoe(f, dmg, b.face); } });
      if (boar && !boar.dead && !b.atk.hit.boar && overlap(mb, [boar.x - 70, GY - 100, boar.x + 70, GY])) { b.atk.hit.boar = 1; boarHit(dmg * 1.5, b.id); }
      wilds.forEach(function (wd, k) { if (!b.atk.hit['w' + k] && overlap(mb, [wd.x - 30, wd.y - 80, wd.x + 30, wd.y])) { b.atk.hit['w' + k] = 1; G.stats.wild++; wd.hit = 0.8; AU.sfx('bell'); pop(wd.x, wd.y - 110, T('wild'), '#ff9a7a', 22); } });
    }
    function foeUpdate(f, h, dt) {
      f.tt -= dt; f.hurt = Math.max(0, f.hurt - dt); f.ph += dt;
      var dx = h.x - f.x, ad = Math.abs(dx);
      if (f.t === 'spirit') {
        f.y = GY - 18 + Math.sin(f.ph * 2.2) * 8;
        if (f.st === 'stagger') { f.x += f.vx * dt; f.vx *= 0.9; if (f.tt <= 0) f.st = 'idle'; }
        else if (f.st === 'idle') { if (ad < 560) { f.face = dx > 0 ? 1 : -1; f.x += f.face * 75 * dt; if (ad < 190 && f.tt <= 0) { f.st = 'tele'; f.tt = 0.55; } } }
        else if (f.st === 'tele') { if (f.tt <= 0) { f.st = 'lunge'; f.tt = 0.38; f.vx = f.face * 560; AU.sfx('whisper'); } }
        else if (f.st === 'lunge') { f.x += f.vx * dt; if (f.tt <= 0) { f.st = 'idle'; f.tt = 1.1; } }
        if (Math.random() < 0.3) ART.spawn('smoke', f.x + (Math.random() - 0.5) * 40, f.y - 50, { speed: 30, ang: -1.57, life: 0.8, r: 10, col: 'rgba(30,20,25,1)' });
      } else {
        if (f.st === 'stagger') { f.x += f.vx * dt; f.vx *= 0.9; if (f.tt <= 0) f.st = 'idle'; }
        else if (ad < 380) { f.face = dx > 0 ? 1 : -1; f.x += f.face * 300 * dt; f.run = true; }
        else { f.run = true; f.x += f.face * 120 * dt; if (Math.abs(f.x - f.home) > 160) f.face = f.x > f.home ? -1 : 1; }
        if (groundAt(w, f.x + f.face * 30) == null) f.face *= -1;
      }
      if (f.st !== 'stagger' && overlap(hbox(h), [f.x - 34, f.y - 110, f.x + 34, f.y]) && h.inv <= 0) hurt(h, 1, dx > 0 ? 1 : -1);
    }
    function partnerAI(p, lead, dt) {
      var tx = lead.x - lead.face * 70, dx = tx - p.x, mx = Math.abs(dx) > 30 ? Math.sign(dx) : 0, jp = false;
      if (!lead.gr && lead.vy < -200 && p.gr && Math.abs(lead.x - p.x) < 260) jp = true;
      var wall = w.solids.some(function (s) { return !s.k || s.k === 'cart' ? false : (mx > 0 ? s.x - p.x > 0 && s.x - p.x < 60 : p.x - (s.x + s.w) > 0 && p.x - (s.x + s.w) < 60) && s.y < p.y - 20; });
      if (wall && p.gr) jp = true;
      if (Math.abs(lead.x - p.x) > 520 || (lead.gr && p.gr && lead.y < p.y - 140 && Math.abs(lead.x - p.x) < 160)) { p.x = lead.x - lead.face * 50; p.y = lead.y; p.vy = 0; ART.spawn('ring', p.x, p.y - 60, { r: 10, life: 0.4, col: 'rgba(255,240,180,0.9)', speed: 0 }); pop(p.x, p.y - 160, T('pulled'), '#fff2c0', 18); }
      physHero(p, dt, w, { mx: mx, jumpP: jp, jumpHeld: jp || (!p.gr && p.vy < 0), minX: 20, maxX: len - 20 });
      p.aiCd = (p.aiCd || 0) - dt;
      if (p.aiCd <= 0 && !p.atk) {
        var best = null;
        targets.forEach(function (t) { if (t.dead) return; var ddx = t.x - p.x; if (p.A.melee) { if (Math.abs(ddx) < 130 && t.y > p.y - 160) best = t; } else if (Math.abs(ddx) < 560 && Math.abs((t.dummy ? t.y - 60 : t.y) - (p.y - 92)) < 34) best = t; });
        if (boar && !boar.dead && Math.abs(boar.x - p.x) < (p.A.melee ? 140 : 520)) best = boar;
        if (best) { p.face = best.x > p.x ? 1 : -1; attackPress(p, onFire); p.aiCd = p.A.melee ? 0.55 : 0.9; }
      }
    }
    // ---- demo autopilot: objective list + a surface-hopping planner (gaps, posts, ledges, walls, beams) ----
    function surfaces() {
      var out = [];
      w.segs.forEach(function (s) { out.push({ x0: s.x0, x1: s.x1, y: s.y0, ref: s }); });
      w.plats.forEach(function (p) { out.push({ x0: p.x, x1: p.x + p.w, y: p.y, ref: p, plat: true }); });
      w.solids.forEach(function (s) { if (s.k !== 'beam') out.push({ x0: s.x, x1: s.x + s.w, y: s.y, ref: s, solid: true }); });
      return out;
    }
    function curSurface(h) { var ss = surfaces(); for (var i = 0; i < ss.length; i++) { var s = ss[i]; if (h.x >= s.x0 - 6 && h.x <= s.x1 + 6 && Math.abs(s.y - h.y) < 3) return s; } return null; }
    function nextSurface(h, dir, cur) {
      var ss = surfaces(), best = null, edge = dir > 0 ? cur.x1 : cur.x0;
      ss.forEach(function (s) {
        if (s.ref === cur.ref) return;
        var near = dir > 0 ? s.x0 - edge : edge - s.x1;
        if (near < -40 || near > 330) return;
        if (s.y < h.y - 250) return;
        if (dir > 0 ? s.x1 <= edge + 10 : s.x0 >= edge - 10) return;
        var sc = near + Math.max(0, h.y - s.y) * 0.3;
        if (!best || sc < best.sc) best = { s: s, sc: sc };
      });
      return best && best.s;
    }
    M.ai = function (C) {
      var h = active(); C.mx = 0; C.jumpHeld = !h.gr && h.vy < 0 && h.aiHold !== false;
      var D = dlg || M.endDlg;
      if (D) { if (D.full() && D.wait > 0.5) C.confirmP = true; return; }
      var obj = aiObjective(h); M.aiObj = obj; if (!obj) return;
      if (party.length > 1 && obj.who && h.id !== obj.who && h.gr) { C.tagP = true; return; }
      if (obj.talk) { C.confirmP = true; return; }
      if (obj.wait) return;
      var dx = obj.x - h.x, arrived = Math.abs(dx) <= 16;
      C.mx = arrived ? 0 : Math.sign(dx);
      if (arrived && obj.face && h.face !== obj.face) C.mx = obj.face;
      var dir = C.mx || h.face;
      if (h.gr) {
        h.aiPlan = null;
        var cur = curSurface(h);
        // edge of the current surface: hop to the next one, or walk off if the next surface is lower and close
        if (cur && C.mx) {
          var toEdge = dir > 0 ? cur.x1 - h.x : h.x - cur.x0;
          if (toEdge < 46) {
            var nx = nextSurface(h, dir, cur), contiguous = nx && (dir > 0 ? nx.x0 - cur.x1 : cur.x0 - nx.x1) < 6 && Math.abs(nx.y - cur.y) < 28;
            var edgeX = dir > 0 ? cur.x1 : cur.x0, below = groundAt(w, edgeX + dir * 24), objBeyond = nx && (dir > 0 ? obj.x > nx.x0 - 10 : obj.x < nx.x1 + 10);
            if (nx && !contiguous && !(nx.y > h.y + 20 && (dir > 0 ? nx.x0 - cur.x1 : cur.x0 - nx.x1) < 10) && (below == null || (objBeyond && nx.y < below - 20))) { C.jumpP = true; C.jumpHeld = true; h.aiHold = true; h.aiPlan = nx; }
          }
        }
        // a wall ahead
        w.solids.forEach(function (s) { if (s.k === 'beam') return; var d = dir > 0 ? s.x - (h.x + 17) : h.x - 17 - (s.x + s.w); if (C.mx && d > -2 && d < 60 && s.y < h.y - 10) { C.jumpP = true; C.jumpHeld = true; h.aiHold = true; h.aiPlan = { x0: s.x, x1: s.x + s.w, y: s.y }; } });
        // a low beam ahead: slide
        w.solids.forEach(function (s) { if (s.k !== 'beam') return; var d = dir > 0 ? s.x - h.x : h.x - (s.x + s.w); if (C.mx && d > -24 && d < 100 && h.slideT <= 0.05) C.downP = true; });
        // objective above (ledge / post / item)
        if (obj.y != null && obj.y < h.y - 20 && Math.abs(dx) < (obj.jx || 170) && !C.jumpP) { C.jumpP = true; C.jumpHeld = true; h.aiHold = true; h.aiPlan = { x0: obj.x - 40, x1: obj.x + 40, y: obj.y }; }
      } else if (h.aiPlan) {
        var p = h.aiPlan, cx = clamp(h.x, p.x0 + 24, p.x1 - 24);
        if (p.ref && p.ref.dx != null && p.ref.w) cx = clamp(h.x, p.ref.x + 24, p.ref.x + p.ref.w - 24);
        C.mx = Math.abs(cx - h.x) > 12 ? Math.sign(cx - h.x) : 0;
        if (C.mx === 0 && !obj.face) C.mx = 0;
        var below = h.y > p.y - 30, notOver = h.x < p.x0 + 10 || h.x > p.x1 - 10;
        if (h.jumps === 1 && h.vy > -120 && (below && notOver || h.y > p.y - 10 && notOver)) { C.jumpP = true; C.jumpHeld = true; }
      }
      // shooting / striking
      if (obj.shoot && h.gr && arrived && !h.atk) C.atkP = true;
      if (obj.jumpShot) {
        if (h.gr && arrived && h.face === obj.face && !h.atk) { C.jumpP = true; C.jumpHeld = true; h.aiHold = true; h.aiShot = false; }
        else if (!h.gr && !h.aiShot && Math.abs(h.y - 98 - obj.ty) < 20) { C.atkP = true; h.aiShot = true; }
      }
      if (obj.strike && !h.atk) C.atkP = true;
      // stuck guard: hop
      if (C.mx && h.gr && Math.abs(h.x - (h.aiLastX || -1)) < 1) h.aiStuck = (h.aiStuck || 0) + 1 / 60; else h.aiStuck = 0;
      h.aiLastX = h.x;
      if (h.aiStuck > 0.7) { C.jumpP = true; C.jumpHeld = true; h.aiStuck = 0; }
    };
    function platUnder(x, y) { for (var i = 0; i < w.plats.length; i++) { var p = w.plats[i]; if (x > p.x - 4 && x < p.x + p.w + 4 && p.y >= y - 4 && p.y < y + 300) return true; } return false; }
    function aiObjective(h) {
      var i, shooter = party.filter(function (b) { return !b.A.melee; })[0], swd = party.filter(function (b) { return b.A.melee; })[0];
      var sid = shooter && shooter.id, mid = swd && swd.id;
      // talk when beside an NPC
      for (i = 0; i < npcs.length; i++) if (!npcs[i].talked && Math.abs(npcs[i].x - h.x) < 100) return { talk: true };
      // dog: wait unless it has just fallen asleep
      for (i = 0; i < dogs.length; i++) { var d = dogs[i]; if (h.x < d.x + 160 && h.x > d.x - 430 && (d.st !== 'sleep' || d.t > 0.8)) return h.x < d.x - 380 ? { wait: true } : { x: d.x + 400 }; }
      // dummy-post sequence
      if (seg.seq && !flags.seq && h.x > seg.seq.x0 - 320 && h.x < seg.seq.x1 + 200) { var post = w.plats.filter(function (p) { return p.seq === seqNext; })[0]; if (post) { if (h.on === post) { var nxt = w.plats.filter(function (p) { return p.seq === seqNext + 1; })[0]; if (nxt) return { x: nxt.x + nxt.w / 2, y: nxt.y, jx: 230 }; } return { x: post.x + post.w / 2, y: post.y, jx: 175 }; } }
      // items near the path
      for (i = 0; i < items.length; i++) { var it = items[i]; if (!it.got && it.x - h.x < 700 && it.x - h.x > -300) { if (it.y < GY - 150) { var lp = w.plats.filter(function (p) { return Math.abs(p.y - it.y) < 4 && it.x >= p.x && it.x <= p.x + p.w; })[0], st = lp && w.plats.filter(function (p) { return p !== lp && p.y > lp.y && p.y < GY - 40 && p.x < lp.x && p.x > lp.x - 400; })[0]; if (st && h.on !== st && h.on !== lp && h.y > st.y) return { x: st.x + st.w / 2, y: st.y, jx: 190 }; } return { x: it.x, y: it.y < GY - 20 ? it.y : null, jx: 240 }; } }
      // NPC ahead
      for (i = 0; i < npcs.length; i++) if (!npcs[i].talked && npcs[i].x > h.x - 60 && npcs[i].x - h.x < 900) return { x: npcs[i].x };
      // foes
      for (i = 0; i < foes.length; i++) { var f = foes[i]; if (f.dead || Math.abs(f.y - h.y) > 90) continue; var fd = f.x - h.x; if (Math.abs(fd) < 140) return { x: h.x, strike: true, face: fd > 0 ? 1 : -1 }; if (fd > 0 && fd < 420) return { x: f.x - 100 }; }
      // targets (in x order)
      var tgs = targets.filter(function (t) { return !t.dead; }).sort(function (a, b) { return a.x0 - b.x0; });
      if (tgs.length) {
        var t = tgs[0];
        if (t.dummy) {
          if (mid) return Math.abs(t.x - h.x) < 90 && h.id === mid ? { x: h.x, strike: true, face: t.x > h.x ? 1 : -1, who: mid } : { x: t.x - 75, who: mid, face: 1 };
          return { x: t.x - 300, face: 1, shoot: true, who: sid };
        }
        var aimG = GY - 92;
        if (h.gr && (!sid || h.id === sid) && Math.abs(t.y - (h.y - 92)) < 28 && t.x > h.x + 50 && t.x - h.x < 650) return { x: h.x, face: 1, shoot: true, who: sid };
        if ((t.my && Math.abs(t.y0 - aimG) <= t.my + 10) || (t.mx && Math.abs(t.y0 - aimG) < 28)) { var sx2 = t.x0 - t.mx - 330; w.plats.forEach(function (p) { if (sx2 > p.x - 30 && sx2 < p.x + p.w + 30) sx2 = p.x - 40; }); return { x: sx2, face: 1, who: sid }; }
        var best = null;
        w.plats.forEach(function (p) { if (p.mx || p.my) return; var py = p.y - 92; if (Math.abs(t.y0 - py) <= 34 + (t.my || 0) && p.x < t.x0 - 50 - (t.mx || 0) && t.x0 - p.x < 700) { if (!best || p.x > best.x) best = p; } });
        if (best) {
          if (h.on === best) { var ok = Math.abs(t.y - (best.y - 92)) < 35 && t.x > h.x + 6; return { x: best.x + 22, face: 1, shoot: ok && Math.abs(h.x - best.x - 22) < 18, who: sid }; }
          return { x: best.x + 22, y: best.y, jx: 200, who: sid };
        }
        if (t.y < GY - 110 && t.y > GY - 340) return { x: t.x0 - (t.mx || 0) - 240, face: 1, jumpShot: true, ty: t.y, who: sid };
        return { x: t.x0 - 320, face: 1, who: sid };
      }
      // the straw boar: the archer shoots from beyond its rail
      if (boar && !boar.dead) {
        if (h.x < boar.x0 - 900) return { x: boar.x0 - 320 };
        return { x: boar.x0 - 320, face: 1, shoot: true, who: sid || h.id };
      }
      // swinging sandbags: wait for the bag to swing away
      for (i = 0; i < swings.length; i++) { var s = swings[i]; if (s.bx != null && h.x < s.x + 40 && h.x > s.x - 230) { var nextA = Math.sin((M.t + 0.35) * 1.7 + s.ph) * 1.05, nbx = s.x + Math.sin(nextA) * s.len; if (Math.abs(nbx - (h.x + 60)) < 110 || Math.abs(s.bx - (h.x + 40)) < 90) return h.x < s.x - 160 ? { wait: true } : { x: h.x - 200 }; } }
      // carts: hop on, ride, hop off (wait while one rolls at us)
      for (i = 0; i < carts.length; i++) { var c = carts[i], cd = c.x - h.x; if (h.gr && !h.on && cd > -40 && cd < 260 && c.dir < 0) return { wait: true }; }
      if (seg.goal) return { x: seg.goal.x + 60 };
      return { x: len };
    }
    M.draw = function () {
      var cam = G.cam;
      drawBackdrop(th, cam);
      // goal behind world
      drawGoal(seg.goal, cam, goalNeeds());
      // decor
      (seg.decor || []).forEach(function (d) { var x = d.x - cam; if (x < -300 || x > W + 300) return; if (d.k === 'fire') { drawFire(x, GY, d.s); return; } SPR.draw(g, d.sh || 'prop', d.k, x, GY + 4, { s: d.s, cx: true, face: d.face || 1 }); });
      // ground + pits
      pits.forEach(function (p) { var x0 = p[0] - cam, x1 = p[1] - cam; if (x1 < 0 || x0 > W) return; drawPit(x0, x1, M.sandpit && p[0] === M.sandpit[0] ? 'sand' : (seg.pits || 'void')); });
      w.segs.forEach(function (s) { var x0 = s.x0 - cam, x1 = s.x1 - cam; if (x1 < -10 || x0 > W + 10) return; if (s.k === 'pool') drawPool(x0, x1); else ART.groundBlock(g, th, x0, x1, s.y0, s.y1, H, cam); });
      // checkpoints (diya lamps)
      cps.forEach(function (c) { if (c < 100) return; var x = c - cam; if (x < -40 || x > W + 40) return; drawDiya(x, groundAt(w, c) || GY, cp >= c); });
      // plats
      w.plats.forEach(function (p) { drawPlat(p, cam); });
      w.solids.forEach(function (s) { drawSolid(s, cam); });
      // items / npcs / dogs / targets / wilds
      items.forEach(function (it) { if (it.got) return; var x = it.x - cam, y = it.y - 34 + Math.sin(G.t * 3 + it.bob) * 5; ART.glow(g, x, y, 60, 'rgba(255,220,140,0.55)'); SPR.drawC(g, 'prop', it.t === 'standard' ? 'standard' : 'lotus', x, y - 10, { s: it.t === 'standard' ? 0.42 : 0.3 }); });
      npcs.forEach(function (n) { var x = n.x - cam; if (x < -200 || x > W + 200) return; ART.shadow(g, x, GY, 40, 0.35); SPR.draw(g, n.sh, n.fr, x, GY + 2, { s: 0.56, face: n.face, sy: 1 + Math.sin(G.t * 2 + n.x) * 0.01 });
        if (!n.talked) { var near = Math.abs(n.x - active().x) < 130, by = GY - 200 + Math.sin(G.t * 4) * 5; ART.glow(g, x, by, 40, 'rgba(255,220,120,0.6)'); g.fillStyle = '#ffe27a'; g.beginPath(); g.arc(x, by, near ? 16 : 11, 0, 6.283); g.fill(); ART.text(g, near ? T('talk') : '…', x, by + 5, { size: near ? 13 : 14, align: 'center', col: '#3a1404', stroke: false, bold: true }); } });
      dogs.forEach(function (d) { var x = d.x - cam, bob = d.st === 'awake' ? Math.abs(Math.sin(G.t * 12)) * 6 : 0; SPR.draw(g, 'terr', 'dog', x, GY + 4 - bob, { s: 0.42, cx: true, face: -1 });
        if (d.st === 'sleep') ART.text(g, 'z', x + 30 + Math.sin(G.t * 2) * 6, GY - 70 - (d.t * 12 % 30), { size: 22, col: '#fff', sw: 3 }); else ART.text(g, '!', x + 20, GY - 90, { size: d.st === 'awake' ? 40 : 26, col: d.st === 'awake' ? '#ff6a4a' : '#ffe27a', sw: 5, bold: true }); });
      targets.forEach(function (t) { if (t.dead && !t.dummy) return; drawTarget(t, cam); });
      wilds.forEach(function (wd) { var x = wd.x - cam, sx = wd.hit > 0 ? Math.sin(G.t * 40) * 4 * wd.hit : 0; wd.hit = Math.max(0, wd.hit - 1 / 60); SPR.draw(g, 'prop', wd.t, x + sx, wd.y + 4, { s: wd.t === 'bell' ? 0.5 : 0.36, cx: true }); });
      swings.forEach(function (s) { var x = s.x - cam; if (x < -200 || x > W + 200) return; g.strokeStyle = '#4a2a12'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 60, s.y - 4); g.lineTo(x + 60, s.y - 4); g.stroke(); g.lineWidth = 3; g.strokeStyle = '#8a6a3a'; g.beginPath(); g.moveTo(x, s.y); g.lineTo(s.bx - cam, s.by); g.stroke(); g.save(); g.translate(s.bx - cam, s.by); g.rotate(-s.a); g.fillStyle = '#b8945a'; ART.rr(g, -24, -30, 48, 62, 16); g.fill(); g.strokeStyle = '#5a3a1a'; g.lineWidth = 2; g.stroke(); g.restore(); });
      if (boar) drawBoar(boar, cam);
      foes.forEach(function (f) { if (!f.dead) drawFoe(f, cam); });
      // heroes
      party.forEach(function (b, k) { if (k !== ai) drawHero(g, b, cam, { alpha: 0.95 }); });
      drawHero(g, active(), cam, { glow: G.meter >= 100 ? 'rgba(255,220,140,0.5)' : null, marker: party.length > 1 });
      arrows.forEach(function (a) { drawArrow(g, a, cam); });
      if (seg.fgPillar) { var fx = seg.fgPillar.x - cam, near = Math.abs(active().x - seg.fgPillar.x) < 120; SPR.draw(g, 'terr', 'pillarPalace', fx, GY + 10, { s: 0.98, cx: true, alpha: near ? 0.35 : 1 }); }
      ART.drawParts(g, cam, false);
      drawForeground(th, cam);
      drawGrade(th);
      if (dlg) dlg.draw(g); if (M.endDlg) M.endDlg.draw(g);
    };
    M.hud = function () {
      var x = 260;
      if (seg.timeLimit) { ART.text(g, '⏳ ' + Math.max(0, Math.ceil(timeLeft)) + 's', W / 2, 92, { size: 26, align: 'center', col: timeLeft < 10 ? '#ff9a7a' : '#fff2c0' }); }
      if (seg.arrows) ART.text(g, T('arrows') + ': ' + arrowsLeft, W / 2, seg.timeLimit ? 120 : 92, { size: 20, align: 'center' });
      if (targets.length) { var left = targets.filter(function (t) { return !t.dead; }).length; ART.text(g, '◎ ' + (targets.length - left) + '/' + targets.length, x, 74, { size: 18 }); x += 90; }
      if (seg.drillName) ART.text(g, tr(seg.drillName), W / 2, 66, { size: 18, align: 'center', gold: true });
      if (boar && !boar.dead && Math.abs(boar.x - active().x) < 900) { ART.bar(g, W / 2 - 150, 100, 300, 16, boar.hp / boar.max, '#c8582a'); ART.text(g, SAVE.lang === 'hi' ? 'घास का सूअर' : 'Straw Boar', W / 2, 96, { size: 15, align: 'center' }); }
      if (party.length > 1) ART.text(g, (active().id === 'rama' ? '➶ Rama' : '⚔ Lakshmana') + '   ⇄ Q', 20, 100, { size: 16, col: '#fff2c0' });
    };
    M.restartSeg = function () { return PlatformMode(seg, L); };
    M.isTalking = function () { return !!dlg || !!M.endDlg; };
    M.flags = flags; M.targets = targets; M.foes = foes; M.items = items; M.npcs = npcs; M.world = w; M.boarRef = function () { return boar; };
    return M;
  }

  // ---------------- world draw helpers ----------------
  function drawFire(x, y, s) {
    s = s || 0.5;
    ART.glow(g, x, y - 40 * s, 160 * s, 'rgba(255,140,50,0.55)', 0.9);
    SPR.draw(g, 'prop', 'fire', x, y + 4, { s: s * (1 + Math.sin(G.t * 9 + x) * 0.04), cx: true, sy: 1 + Math.sin(G.t * 13 + x) * 0.06 });
    if (Math.random() < 0.25) ART.spawn('ember', x + G.cam + (Math.random() - 0.5) * 50 * s, y - 60 * s, { speed: 70, ang: -1.57, spread: 0.8, life: 1.2, r: 2, col: '#ffb060', g: -40 });
  }
  function drawPit(x0, x1, kind) {
    if (kind === 'sand') {
      var gr = g.createLinearGradient(0, GY + 20, 0, H); gr.addColorStop(0, '#b88a4a'); gr.addColorStop(1, '#5a3a1a'); g.fillStyle = gr; g.fillRect(x0, GY + 30, x1 - x0, H);
      g.fillStyle = 'rgba(255,230,170,0.25)'; for (var i = 0; i < (x1 - x0) / 40; i++) g.fillRect(x0 + i * 40 + ((i * 17) % 23), GY + 40 + (i * 13) % 30, 18, 3);
      return;
    }
    if (kind === 'fire') {
      var gf = g.createLinearGradient(0, GY, 0, H); gf.addColorStop(0, 'rgba(40,10,5,0)'); gf.addColorStop(0.5, 'rgba(160,40,10,0.7)'); gf.addColorStop(1, 'rgba(255,140,40,0.95)');
      g.fillStyle = gf; g.fillRect(x0, GY, x1 - x0, H - GY);
      for (var k = 0; k < (x1 - x0) / 46; k++) { var fx = x0 + 23 + k * 46; SPR.draw(g, 'prop', 'fire', fx, H + 26, { s: 0.36 + 0.05 * Math.sin(G.t * 7 + k), cx: true, sy: 1 + Math.sin(G.t * 11 + k * 2) * 0.12 }); }
      if (Math.random() < 0.5) ART.spawn('ember', x0 + G.cam + Math.random() * (x1 - x0), H - 20, { speed: 140, ang: -1.57, spread: 0.6, life: 1.4, r: 2.2, col: '#ffa040', g: -60 });
      return;
    }
    g.fillStyle = 'rgba(10,6,4,0.75)'; g.fillRect(x0, GY + 10, x1 - x0, H);
  }
  function drawPool(x0, x1) {
    var y = GY + 10;
    g.fillStyle = '#c8b48a'; g.fillRect(x0 - 6, GY - 2, 12, H); g.fillRect(x1 - 6, GY - 2, 12, H);
    var gr = g.createLinearGradient(0, y, 0, H); gr.addColorStop(0, 'rgba(90,170,190,0.9)'); gr.addColorStop(1, 'rgba(20,70,100,1)');
    g.fillStyle = gr; g.fillRect(x0, y, x1 - x0, H - y);
    g.strokeStyle = 'rgba(230,250,255,0.6)'; g.lineWidth = 2;
    for (var i = 0; i < 3; i++) { g.beginPath(); for (var x = x0; x <= x1; x += 12) { var yy = y + 6 + i * 16 + Math.sin(x * 0.05 + G.t * 2 + i) * 2.5; if (x === x0) g.moveTo(x, yy); else g.lineTo(x, yy); } g.stroke(); }
    for (var k = 0; k < (x1 - x0) / 110; k++) SPR.drawC(g, 'prop', 'lotus', x0 + 50 + k * 110, y + 10 + Math.sin(G.t + k) * 2, { s: 0.16 });
  }
  function drawDiya(x, y, lit) {
    g.fillStyle = '#6a3a1a'; g.beginPath(); g.ellipse(x, y - 6, 14, 6, 0, 0, 6.283); g.fill();
    g.fillStyle = '#3a2010'; g.fillRect(x - 3, y - 6, 6, 6);
    if (lit) { ART.glow(g, x, y - 18, 46, 'rgba(255,180,80,0.7)'); g.fillStyle = '#ffd070'; g.beginPath(); g.ellipse(x, y - 17 + Math.sin(G.t * 12 + x) * 1, 4, 8, 0, 0, 6.283); g.fill(); }
  }
  function drawPlat(p, cam) {
    var x = p.x - cam; if (x > W + 50 || x + p.w < -50) return;
    if (p.k === 'post') {
      var gr = g.createLinearGradient(x, 0, x + p.w, 0); gr.addColorStop(0, '#5a3a1e'); gr.addColorStop(0.5, '#9a6a3a'); gr.addColorStop(1, '#4a2a14');
      g.fillStyle = gr; g.fillRect(x + p.w * 0.3, p.y, p.w * 0.4, H - p.y);
      g.fillStyle = '#b8834a'; ART.rr(g, x, p.y - 4, p.w, 18, 6); g.fill(); g.strokeStyle = '#4a2a10'; g.lineWidth = 2; g.stroke();
      g.fillStyle = 'rgba(255,240,200,0.35)'; g.fillRect(x + 6, p.y - 2, p.w - 12, 3);
      if (p.seq != null && M_seqHint(p)) { ART.glow(g, x + p.w / 2, p.y - 10, 40, 'rgba(255,230,140,0.55)'); ART.text(g, String(p.seq + 1), x + p.w / 2, p.y - 18, { size: 18, align: 'center', gold: true }); }
      return;
    }
    var nm = PLAT_SPR[p.k] || 'plank', r = SPR.size('terr', nm);
    if (r.w) {
      var hh = p.k === 'plank' ? 34 : Math.min(120, r.h * (p.w / r.w));
      if (p.k === 'plank' && !(p.mx || p.my)) { g.fillStyle = '#4a2c14'; g.fillRect(x + 12, p.y + 20, 8, GY - p.y - 20 > 0 ? GY - p.y - 20 : 0); g.fillRect(x + p.w - 20, p.y + 20, 8, GY - p.y - 20 > 0 ? GY - p.y - 20 : 0); }
      SPR.drawRect(g, 'terr', nm, x - 8, p.y - 10, p.w + 16, hh);
    } else { g.fillStyle = '#7a5a3a'; g.fillRect(x, p.y, p.w, 22); }
  }
  var seqHintFn = null; function M_seqHint(p) { return seqHintFn ? seqHintFn(p) : true; }
  function drawSolid(s, cam) {
    var x = s.x - cam; if (x > W + 60 || x + s.w < -60) return;
    if (s.k === 'cart') {
      g.fillStyle = '#7a4a22'; ART.rr(g, x, s.y + 8, s.w, s.h - 26, 8); g.fill(); g.fillStyle = '#a0683a'; g.fillRect(x + 6, s.y + 12, s.w - 12, 10);
      SPR.draw(g, 'prop', 'cart', x + s.w / 2, s.y + s.h + 4, { s: 0.5, cx: true, face: s.dir || 1 });
      return;
    }
    if (s.k === 'beam') {
      g.fillStyle = '#5a3418'; g.fillRect(x + 6, 0, 12, s.y); g.fillRect(x + s.w - 18, 0, 12, s.y);
      var gb = g.createLinearGradient(0, s.y, 0, s.y + s.h); gb.addColorStop(0, '#c08850'); gb.addColorStop(1, '#6a3c1c');
      g.fillStyle = gb; ART.rr(g, x - 6, s.y, s.w + 12, s.h, 6); g.fill(); g.strokeStyle = '#3a1c08'; g.lineWidth = 2; g.stroke();
      g.fillStyle = 'rgba(255,230,180,0.25)'; g.fillRect(x, s.y + 4, s.w, 4);
      return;
    }
    var nm = s.k === 'earthWall' ? 'earthWall' : s.k === 'pillarBroken' ? 'pillarBroken' : s.k === 'ledgePalace' ? 'ledgePalace' : 'ledgeRock';
    if (!SPR.drawRect(g, 'terr', nm, x - 10, s.y - 10, s.w + 20, s.h + 16)) { g.fillStyle = '#6a5040'; g.fillRect(x, s.y, s.w, s.h); }
    if (s.boost) { var a = 0.5 + 0.5 * Math.sin(G.t * 4); g.globalAlpha = a; ART.text(g, '⇧', x + s.w / 2, s.y - 16, { size: 26, align: 'center', gold: true }); g.globalAlpha = 1; }
  }
  function drawTarget(t, cam) {
    var x = t.x - cam, y = t.y; if (x < -80 || x > W + 80) return;
    if (t.dummy) {
      var lean = t.dead ? 0.9 : Math.sin(t.flash * 30) * 0.15;
      g.save(); g.translate(x, y); g.rotate(lean); SPR.draw(g, 'prop', 'dummy', 0, 4, { s: 0.42, cx: true, alpha: t.dead ? 0.6 : 1, tint: '#ffffff', tintA: t.flash * 3 }); g.restore();
      if (!t.dead) ART.bar(g, x - 24, y - 150, 48, 6, t.hp / t.max, '#ffd27a');
      return;
    }
    var s = t.big ? 0.5 : 0.36, glowing = Math.sin(G.t * 3.5 + t.ph) > 0.55;
    g.strokeStyle = '#5a3a1a'; g.lineWidth = 3; if (!t.mx && !t.my) { g.beginPath(); g.moveTo(x, y + 20); g.lineTo(x, GY); g.stroke(); } else { g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x, 0); g.stroke(); }
    if (glowing) ART.glow(g, x, y, 70, 'rgba(255,220,110,0.8)');
    SPR.drawC(g, 'prop', 'target', x, y, { s: s, tint: '#ffffff', tintA: t.flash * 3 });
    if (t.max > 1) ART.bar(g, x - 26, y - 44 * (t.big ? 1.4 : 1), 52, 6, t.hp / t.max, '#ffd27a');
  }
  function drawBoar(b, cam) {
    var x = b.x - cam; if (x < -200 || x > W + 200) return;
    g.strokeStyle = '#6a4a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(b.x0 - cam - 60, GY - 6); g.lineTo(b.x1 - cam + 60, GY - 6); g.stroke();
    if (b.dead) { SPR.draw(g, 'prop', 'boar', x, GY + 18, { s: 0.55, cx: true, rot: 1.4, alpha: 0.7 }); return; }
    var bob = b.st === 'run' ? Math.abs(Math.sin(G.t * 14)) * 6 : 0;
    ART.shadow(g, x, GY, 70, 0.35);
    SPR.draw(g, 'prop', 'boar', x, GY + 4 - bob, { s: 0.55, cx: true, face: b.dir, tint: '#ffffff', tintA: b.flash * 3 });
    if (b.st === 'pause' && b.t < 0.5) ART.text(g, '!', x, GY - 120, { size: 36, align: 'center', col: '#ff6a4a', sw: 5, bold: true });
  }
  function drawFoe(f, cam) {
    var x = f.x - cam; if (x < -150 || x > W + 150) return;
    var fr = f.t + (Math.floor(G.t * (f.st === 'lunge' || f.run ? 10 : 3)) % 2);
    if (f.t === 'spirit') { ART.glow(g, x, f.y - 60, 90, f.st === 'tele' ? 'rgba(255,80,60,0.6)' : 'rgba(120,40,140,0.35)'); }
    else ART.shadow(g, x, GY, 40, 0.35);
    SPR.draw(g, 'foe', fr, x, f.y + 4, { s: f.t === 'spirit' ? 0.62 : 0.55, cx: true, face: f.face, tint: '#ffffff', tintA: f.hurt * 3, alpha: f.t === 'spirit' ? 0.92 : 1 });
    if (f.st === 'tele') ART.text(g, '!', x, f.y - 160, { size: 34, align: 'center', col: '#ff6a4a', sw: 5, bold: true });
  }
  function drawGoal(goal, cam, open) {
    if (!goal) return; var x = goal.x - cam; if (x < -300 || x > W + 300) return;
    if (goal.k === 'shrine') { ART.glow(g, x, GY - 90, 200, 'rgba(255,200,120,0.4)'); SPR.draw(g, 'prop', 'shrine', x, GY + 6, { s: 0.7, cx: true }); }
    else if (goal.k === 'gate') { SPR.draw(g, 'scen', 'arch', x, GY + 8, { s: 0.95, cx: true }); if (!open) { g.fillStyle = 'rgba(90,50,20,0.85)'; g.fillRect(x - 60, GY - 190, 120, 190); g.strokeStyle = '#d8a050'; g.lineWidth = 3; g.strokeRect(x - 60, GY - 190, 120, 190); } else ART.glow(g, x, GY - 100, 150, 'rgba(255,230,160,0.55)'); }
    else if (goal.k === 'mark') { g.fillStyle = '#6a4a2a'; g.fillRect(x - 3, GY - 120, 6, 120); g.fillStyle = '#e8c060'; g.beginPath(); g.arc(x, GY - 120, 16, 0, 6.283); g.fill(); ART.glow(g, x, GY - 120, 50, 'rgba(255,220,120,0.6)'); }
    else { SPR.draw(g, 'prop', 'standard', x, GY + 6, { s: 0.6, cx: true, sx: 1 + Math.sin(G.t * 3) * 0.04 }); if (open) ART.glow(g, x, GY - 120, 90, 'rgba(255,230,160,0.5)'); }
  }

  // ---------------- RUNNER mode (auto-run; tap left = jump, right = strike, swipe down = slide) ----------------
  function RunnerMode(seg) {
    var th = theme(seg.theme), M = { kind: 'runner', touch: 'runner', swipes: true, t: 0, done: false, fail: null };
    var len = seg.len, obs = [], gaps = [], plats = [];
    srand(seg.seed || 7);
    function addObs(t, x, wdt) {
      if (t === 'gap') { gaps.push([x, x + wdt]); return; }
      if (t === 'ledges') { gaps.push([x, x + 680]); plats.push({ x: x + 120, y: 372, w: 170 }, { x: x + 390, y: 340, w: 170 }); return; }
      var o = { t: t, x: x, hp: t === 'boulder' ? 2 : 1, dead: false, passed: false, ph: rnd() * 6 };
      if (t === 'rock') { o.w = 70; o.h = 58; }
      if (t === 'masonry') { o.w = 80; o.h = 84; }
      if (t === 'boulder') { o.w = 92; o.h = 92; }
      if (t === 'wolf') { o.w = 90; o.h = 70; o.vx = -170; }
      if (t === 'eagle') { o.w = 80; o.h = 50; o.vx = -120; o.yy = GY - 150; }
      if (t === 'branch') { o.w = 130; o.h = 70; o.yy = GY - 175; }
      if (t === 'fall') { o.w = 70; o.h = 58; o.fy = -200; o.st = 'wait'; }
      obs.push(o);
    }
    if (seg.fixed) seg.fixed.forEach(function (f) { addObs(f.t, f.x, f.w); });
    if (seg.phases) {
      var x = 1400, pi = 0;
      while (x < (seg.cave || len) - 1200) {
        while (pi < seg.phases.length - 1 && x > seg.phases[pi].until) pi++;
        var set = seg.phases[pi].set, t = set[Math.floor(rnd() * set.length)];
        var windy = (seg.wind || []).some(function (z) { return x > z[0] - 400 && x < z[1]; });
        if (t === 'gap') addObs('gap', x, windy ? RR(140, 180) : RR(150, 240));
        else addObs(t, x, 0);
        x += (t === 'ledges' ? 1150 : RR(620, 900)) * (1 + x / len * 0.15);
      }
    }
    if (seg.cave) obs.push({ t: 'cave', x: seg.cave, w: 260, h: 130, yy: GY - 200, dead: false, passed: false });
    gaps.sort(function (a, b) { return a[0] - b[0]; });
    var w = { segs: [], plats: plats.map(function (p) { return { x: p.x, y: p.y, w: p.w, k: 'ledgeRock' }; }), solids: [] };
    var cx = 0; gaps.forEach(function (gp) { w.segs.push({ x0: cx, x1: gp[0], y0: GY, y1: GY }); cx = gp[1]; }); w.segs.push({ x0: cx, x1: len + W + 400, y0: GY, y1: GY });
    var hero = makeHero(seg.hero, 120, GY); M.hero = hero;
    var tips = (seg.tips || []).map(function (t) { return { x: t.x, t: t.t, shown: false }; });
    var phaseI = -1, endT = null;
    G.cam = 0;
    function hurt(msg, why) {
      if (hero.inv > 0) return;
      (M.hitLog = M.hitLog || []).push((why || '?') + '@' + Math.round(hero.x));
      G.pips--; G.stats.hits++; hero.inv = 1.7; hero.hurtT = 0.3; AU.sfx('hurt'); shake(10); flash(0.28, '255,60,40'); vibe(60);
      if (msg) pop(hero.x, hero.y - 160, msg, '#ff9a7a', 20);
      if (G.pips <= 0) { if (DEMO) G.pips = 1; else M.fail = T('outOfPips'); }
    }
    function obox(o) {
      if (o.t === 'eagle') return [o.x - o.w / 2, o.yy - o.h / 2, o.x + o.w / 2, o.yy + o.h / 2];
      if (o.t === 'branch' || o.t === 'cave') return [o.x - o.w / 2, o.yy, o.x + o.w / 2, o.yy + o.h];
      if (o.t === 'fall') return [o.x - o.w / 2, o.fy - o.h, o.x + o.w / 2, o.fy];
      return [o.x - o.w / 2, GY - o.h, o.x + o.w / 2, GY];
    }
    function smashIt(o, how) {
      o.dead = true; G.stats.smash++; G.score += 120; addMeter(20);
      ART.spawn('chip', o.x, GY - 40, { n: 18, speed: 380, life: 0.9, r: 5, col: o.t === 'wolf' ? '#6a5a50' : '#8a8a90', g: 900 });
      ART.spawn('dust', o.x, GY - 30, { n: 10, speed: 160, life: 0.8, r: 14, col: 'rgba(200,190,170,0.6)' });
      if (o.t === 'eagle') ART.spawn('leaf', o.x, o.yy, { n: 10, speed: 160, life: 1.2, r: 5, col: '#3a2a20', g: 300 });
      AU.sfx(o.t === 'boulder' ? 'smash' : 'hit'); hitstop(0.05); shake(6);
      pop(o.x, GY - 150, how || '+120', '#ffe27a', 20);
    }
    function addMeter(v) { G.meter = Math.min(100, G.meter + v); }
    M.update = function (dt) {
      M.t += dt;
      var prog = clamp(hero.x / len, 0, 1), spd = seg.speed + ((seg.speedMax || seg.speed) - seg.speed) * prog;
      var inWind = (seg.wind || []).some(function (z) { return hero.x > z[0] && hero.x < z[1]; });
      if (seg.phases) { var np = 0; while (np < seg.phases.length - 1 && hero.x > seg.phases[np].until) np++; if (np !== phaseI) { phaseI = np; banner(tr(seg.phases[np].name), (np + 1) + ' / ' + seg.phases.length, 2.2); } }
      if (endT != null) { endT -= dt; hero.vx = spd * 0.6; physHero(hero, dt, w, { auto: spd * Math.max(0, endT / 1.6) }); if (endT <= 0) M.done = true; camUpd(dt); return; }
      var jp = IN.jumpP(), dp = seg.jumpOnly ? false : IN.downP(), ap = seg.jumpOnly ? false : IN.atkP();
      if (hero.slideT > 0 && hero.slideT < 0.06 && hero.gr) { var sb = [hero.x - 20, hero.y - 128, hero.x + 40, hero.y - 40]; if (obs.some(function (o) { return !o.dead && (o.t === 'branch' || o.t === 'cave') && overlap(sb, obox(o)); })) hero.slideT = 0.1; }
      physHero(hero, dt, w, { auto: spd * (inWind ? 0.93 : 1), jumpP: jp, jumpHeld: IN.jumpHeld(), downP: dp, jmul: inWind ? 0.86 : 1 });
      hero.face = 1;
      if (inWind && Math.random() < 0.6) ART.spawn('dust', G.cam + W + 20, 120 + Math.random() * 320, { n: 1, ang: Math.PI, spread: 0.1, speed: 900, life: 1.2, r: 2, col: 'rgba(230,240,255,0.5)' });
      if (ap) attackPress(hero, null);
      // gaps
      if (hero.y > H + 50) {
        var gp = gaps.filter(function (q) { return hero.x > q[0] - 60 && hero.x < q[1] + 300; })[0];
        hurt(null, 'gap'); hero.x = gp ? gp[1] + 40 : hero.x + 120; hero.y = GY; hero.vy = 0; hero.gr = true; G.stats.falls++;
        ART.spawn('ring', hero.x, GY - 60, { r: 14, life: 0.5, col: 'rgba(255,240,200,0.9)', speed: 0 });
      }
      // obstacles
      var hb = hbox(hero), mb = meleeActive(hero) ? meleeBox(hero) : null;
      obs.forEach(function (o) {
        if (o.dead) return;
        var d = o.x - hero.x;
        if (o.vx && d < W) o.x += o.vx * dt;
        if (o.t === 'eagle') o.yy = GY - 150 + Math.sin(M.t * 4 + o.ph) * 10;
        if (o.t === 'fall') {
          if (o.st === 'wait' && d < spd * 1.25) { o.st = 'warn'; o.wt = 0.55; AU.sfx('crack'); }
          if (o.st === 'warn') { o.wt -= dt; if (o.wt <= 0) { o.st = 'drop'; o.vy = 0; } }
          if (o.st === 'drop') { o.vy += 3000 * dt; o.fy += o.vy * dt; if (o.fy >= GY) { o.fy = GY; o.st = 'land'; shake(5); AU.sfx('rumble'); dust(o.x, GY, 10); } }
        }
        if (mb && !(hero.atk.hit[o.x]) && o.t !== 'cave' && o.t !== 'branch' && overlap(mb, obox(o))) {
          hero.atk.hit[o.x] = 1; o.hp -= hero.atk.n; sparks(o.x, (obox(o)[1] + obox(o)[3]) / 2, '#ffd08a', 10); AU.sfx('hit'); hitstop(0.04);
          if (o.hp <= 0) smashIt(o);
          else { o.shk = 0.2; pop(o.x, GY - 130, '×2', '#ffe0b0', 18); }
        }
        if (o.dead) return;
        if (o.t === 'fall' && o.st !== 'land' && o.st !== 'drop') { if (!o.passed && d < -60) o.passed = true; return; }
        if (overlap(hb, obox(o))) {
          o.hitHero = true;
          hurt(o.t === 'branch' ? T('oof') : null, o.t);
          if (o.t === 'wolf' || o.t === 'eagle') { o.dead = true; ART.spawn('smoke', o.x, GY - 60, { n: 6, speed: 90, life: 0.6, r: 14, col: 'rgba(80,70,60,1)' }); }
        }
        if (!o.passed && d < -o.w) {
          o.passed = true;
          if (!o.hitHero && (o.t === 'boulder' || o.t === 'wolf' || o.t === 'eagle')) { G.stats.smash++; G.score += 60; addMeter(10); pop(hero.x, hero.y - 170, T('clean'), '#fff0c0', 16); }
          else if (!o.hitHero) G.score += 30;
        }
      });
      if (hero.slideT > 0 && Math.random() < 0.6) ART.spawn('spark', hero.x - 20, GY - 4, { n: 1, ang: Math.PI, spread: 0.6, speed: 200, life: 0.25, col: '#ffd8a0', g: 300 });
      tips.forEach(function (tp) { if (!tp.shown && hero.x > tp.x) { tp.shown = true; G.tip = tr(tp.t); G.tipT = 5; } });
      G.score += dt * 10;
      if (hero.x >= len) { endT = 1.6; banner(tr(seg.endText), '', 2); AU.sfx('level'); }
      camUpd(dt);
      AU.setIntensity(0.5 + prog * 0.5);
    };
    function camUpd(dt) { G.cam = hero.x - W * 0.26; }
    M.ai = function (C) {
      C.jumpHeld = !hero.gr && hero.vy < 0 && hero.aiHold;
      var spd = Math.max(300, hero.vx);
      // ground edge (gap or ledge end)
      var onS = null; if (hero.gr) { if (hero.on) onS = { x1: hero.on.x + hero.on.w }; else { var sg = segAt(w, hero.x); if (sg) onS = { x1: sg.x1 }; } }
      if (onS && onS.x1 - hero.x < 34 + spd * 0.02 && onS.x1 < len) { C.jumpP = true; C.jumpHeld = true; hero.aiHold = true; hero.aiGap = true; }
      if (!hero.gr && hero.jumps === 1 && hero.vy > 60) {
        var fx = hero.x + 40, sup = groundAt(w, fx) != null || w.plats.some(function (p) { return fx > p.x - 10 && fx < p.x + p.w + 10 && p.y >= hero.y - 4; });
        if (!sup) { C.jumpP = true; C.jumpHeld = true; hero.aiHold = true; }
      }
      if (!hero.gr && hero.aiGap && false && hero.jumps === 1 && hero.vy > -60) {
        var gp = gaps.filter(function (q) { return hero.x > q[0] - 40 && hero.x < q[1]; })[0];
        if (gp) { var platAhead = w.plats.some(function (p) { return p.x > hero.x - 20 && p.x - hero.x < 140; }); var landX = hero.x + spd * 0.32; if (landX < gp[1] + 10 && !platAhead && !w.plats.some(function (p) { return hero.x > p.x && hero.x < p.x + p.w; })) { C.jumpP = true; C.jumpHeld = true; } }
        hero.aiGap = false;
      }
      if (hero.gr) hero.aiGap = false;
      // next live obstacle ahead
      var next = null;
      for (var i = 0; i < obs.length; i++) { var o = obs[i]; if (o.dead || o.passed) continue; var d = o.x - o.w / 2 - (hero.x + 18); if (d > -o.w && (!next || d < next.d)) next = { o: o, d: d }; }
      if (!next) return;
      var o2 = next.o, d2 = next.d, rel = d2 / Math.max(1, spd + (o2.vx ? -o2.vx : 0)) * spd;
      if (o2.t === 'branch' || o2.t === 'cave') { if (d2 < 70 && d2 > -o2.w && hero.gr && hero.slideT <= 0.08) C.downP = true; return; }
      if (o2.t === 'eagle') { if (seg.jumpOnly) return; if (rel < 150 && !hero.atk) C.atkP = true; return; }
      if ((o2.t === 'wolf' || o2.t === 'boulder') && !seg.jumpOnly && hero.gr) {
        if (rel < 200 && rel > 60) { if (!hero.atk) C.atkP = true; else if (hero.atk.n === 1 && o2.hp > 1 && hero.atk.t > 0.06) C.atkP = true; return; }
        if (rel <= 60 && rel > 0) { C.jumpP = true; C.jumpHeld = true; hero.aiHold = true; }
        return;
      }
      if (o2.t === 'fall' && o2.st !== 'land' && o2.st !== 'drop') return;
      if (hero.gr && rel < 96 + spd * 0.04 && rel > 0) { C.jumpP = true; C.jumpHeld = true; hero.aiHold = rel > 40 || o2.h > 70; }
    };
    M.draw = function () {
      var cam = G.cam;
      drawBackdrop(th, cam, { par: 0.12 });
      // gaps
      gaps.forEach(function (gp) { var x0 = gp[0] - cam, x1 = gp[1] - cam; if (x1 < 0 || x0 > W) return; drawPit(x0, x1, th === ART.THEMES.ash ? 'fire' : 'void'); if (th !== ART.THEMES.ash) { var gm = g.createLinearGradient(0, GY, 0, H); gm.addColorStop(0, 'rgba(180,190,210,0)'); gm.addColorStop(1, 'rgba(200,210,230,0.55)'); g.fillStyle = gm; g.fillRect(x0, GY, x1 - x0, H - GY); } });
      w.segs.forEach(function (s) { var x0 = s.x0 - cam, x1 = s.x1 - cam; if (x1 < -10 || x0 > W + 10) return; ART.groundBlock(g, th, Math.max(-20, x0), Math.min(W + 20, x1), GY, GY, H, cam); });
      w.plats.forEach(function (p) { drawPlat(p, cam); });
      // wind zone streaks
      (seg.wind || []).forEach(function (z) { var x0 = z[0] - cam, x1 = z[1] - cam; if (x1 < 0 || x0 > W) return; g.fillStyle = 'rgba(220,235,255,0.06)'; g.fillRect(Math.max(0, x0), 0, Math.min(W, x1) - Math.max(0, x0), GY); });
      obs.forEach(function (o) { if (o.dead) return; var x = o.x - cam; if (x < -200 || x > W + 200) return; drawObs(o, x); });
      drawHero(g, hero, cam, { glow: G.meter >= 100 ? 'rgba(255,220,140,0.5)' : null });
      ART.drawParts(g, cam, false);
      drawForeground(th, cam);
      drawGrade(th);
    };
    function drawObs(o, x) {
      var sk = o.shk > 0 ? (o.shk -= 1 / 60, Math.sin(G.t * 60) * 4) : 0;
      if (o.t === 'rock') { ART.shadow(g, x, GY, 40, 0.35); SPR.draw(g, 'prop', 'rock', x, GY + 6, { s: 0.42, cx: true }); }
      else if (o.t === 'masonry') { SPR.draw(g, 'terr', 'pillarBroken', x, GY + 6, { s: 0.55, cx: true }); }
      else if (o.t === 'boulder') { ART.shadow(g, x, GY, 50, 0.35); SPR.draw(g, 'prop', 'boulder', x + sk, GY + 6, { s: 0.5, cx: true, rot: Math.sin(G.t * 2 + o.ph) * 0.03 }); }
      else if (o.t === 'wolf') { ART.shadow(g, x, GY, 44, 0.35); SPR.draw(g, 'foe', 'wolf' + (Math.floor(G.t * 10) % 2), x, GY + 4, { s: 0.52, cx: true, face: -1 }); }
      else if (o.t === 'eagle') { ART.shadow(g, x, GY, 30, 0.2); SPR.draw(g, 'foe', 'eagle' + (Math.floor(G.t * 8) % 2), x, o.yy + 40, { s: 0.5, cx: true, face: -1 }); }
      else if (o.t === 'branch') {
        g.strokeStyle = '#3a2414'; g.lineCap = 'round'; g.lineWidth = 22; g.beginPath(); g.moveTo(x + 120, o.yy - 120); g.quadraticCurveTo(x + 40, o.yy + 10, x - 70, o.yy + 40); g.stroke();
        g.lineWidth = 9; g.beginPath(); g.moveTo(x, o.yy + 20); g.lineTo(x - 30, o.yy + 66); g.moveTo(x + 40, o.yy + 4); g.lineTo(x + 30, o.yy + 60); g.stroke();
        for (var k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#2e4a22' : '#3e5e2a'; g.beginPath(); g.ellipse(x - 70 + k * 22, o.yy + 40 + Math.sin(k * 2) * 18, 20, 10, k, 0, 6.283); g.fill(); }
      }
      else if (o.t === 'fall') {
        if (o.st === 'warn' || o.st === 'wait') { var a = 0.4 + 0.4 * Math.sin(G.t * 20); ART.shadow(g, x, GY, 40 * (o.st === 'warn' ? 1 : 0.6), 0.5 * a + 0.1); if (o.st === 'warn') ART.text(g, '!', x, GY - 170, { size: 46, align: 'center', col: '#ff5a3a', sw: 6, bold: true }); }
        else { if (o.st === 'drop') ART.shadow(g, x, GY, 40, 0.5); SPR.draw(g, 'prop', 'rock', x, o.fy + 6, { s: 0.42, cx: true }); }
      }
      else if (o.t === 'cave') {
        g.fillStyle = '#16141a'; g.beginPath(); g.moveTo(x - 160, GY); g.quadraticCurveTo(x - 150, GY - 330, x + 40, GY - 360); g.quadraticCurveTo(x + 300, GY - 360, x + 420, GY - 180); g.lineTo(x + 700, GY - 200); g.lineTo(x + 900, H); g.lineTo(x - 160, H); g.fill();
        g.fillStyle = '#050407'; g.beginPath(); g.ellipse(x + 160, GY, 170, 200, 0, Math.PI, 0); g.fill();
        g.fillStyle = '#4a4650'; g.beginPath(); g.moveTo(x - 140, o.yy); g.lineTo(x + 140, o.yy + 20); g.lineTo(x + 130, o.yy + o.h); g.lineTo(x - 130, o.yy + o.h - 20); g.fill();
        ART.glow(g, x + 160, GY - 60, 140, 'rgba(255,150,70,0.25)');
      }
    }
    M.hud = function () {
      var prog = clamp(M.hero.x / len, 0, 1), bw = Math.min(380, W * 0.36), bx = W / 2 - bw / 2;
      g.fillStyle = 'rgba(20,10,5,0.55)'; ART.rr(g, bx - 4, 82, bw + 8, 14, 7); g.fill();
      g.fillStyle = '#e8b858'; ART.rr(g, bx, 85, bw * prog, 8, 4); g.fill();
      ART.text(g, '⛰', bx + bw + 16, 96, { size: 16 });
      SPR.drawC(g, HEROES[seg.hero].sh, 'idle', bx + bw * prog, 82, { s: 0.09 });
      if (seg.phases || seg.jumpOnly) ART.text(g, (seg.jumpOnly ? '' : '✦ ' + G.stats.smash), bx - 16, 96, { size: 16, align: 'right' });
    };
    M.obs = obs; M.gaps = gaps;
    return M;
  }

  // ---------------- ARENA mode (fixed screen, Street-Fighter style spar) ----------------
  function ArenaMode(seg) {
    var th = theme(seg.theme), M = { kind: 'arena', touch: 'arena', swipes: true, t: 0, done: false, fail: null };
    var w = { segs: [{ x0: -50, x1: 4000, y0: GY, y1: GY }], plats: [], solids: [] };
    var hero = makeHero(seg.hero, 0, GY), arrows = [];
    var F = { x: 0, y: GY, face: -1, hp: seg.foeHp || 100, max: seg.foeHp || 100, st: 'intro', t: 1.4, hurt: 0, vx: 0, combo: 0, bowT: 0 };
    M.hero = hero; M.foe = F;
    function lay() { var cx = W / 2; if (!M.laid) { hero.x = cx - W * 0.24; F.x = cx + W * 0.22; M.laid = true; } }
    G.cam = 0; banner(T('spar'), tr(seg.tips && seg.tips[0] && seg.tips[0].t) ? '' : '', 1.6);
    var tipI = 0; M.tipT = 0;
    function hurtHero(kx, what) {
      if (hero.inv > 0) return;
      G.pips--; G.stats.sparHits++; G.stats.hits++; hero.inv = 1.5; hero.hurtT = 0.32; hero.vx = kx * 420; hero.vy = -360; hero.gr = false;
      AU.sfx('hurt'); shake(10); flash(0.3, '255,60,40'); vibe(70); pop(hero.x, hero.y - 170, what || '', '#ff9a7a', 20);
      if (G.pips <= 0) { if (DEMO) G.pips = 1; else M.fail = T('teacherStops'); }
    }
    function dmgFoe(v, kind, x, y) {
      if (F.st === 'bow' || F.st === 'intro') return;
      if (F.st === 'guard' && kind === 'light') { AU.sfx('clang'); sparks(x, y, '#cfe0ff', 8); pop(F.x, F.y - 190, T('blocked'), '#cfe0ff', 20); return; }
      var open = F.st === 'recover';
      if (open) { v *= 2; G.stats.perfect++; pop(F.x, F.y - 200, T('perfect'), '#ffe27a', 28); AU.sfx('perfect'); slowmo(0.12); }
      else AU.sfx(kind === 'kick' ? 'hit' : 'thunk');
      F.hp = Math.max(0, F.hp - v); F.hurt = 0.22; G.score += v * 10; G.meter = Math.min(100, G.meter + (open ? 30 : 20));
      sparks(x, y, open ? '#ffe27a' : '#ffd0a0', open ? 16 : 9); hitstop(open ? 0.08 : 0.05); shake(open ? 8 : 5);
      if (F.st === 'guard' || F.st === 'windup' || F.st === 'sweepWind') { if (kind !== 'light' || open) { F.st = 'stagger'; F.t = 0.4; } }
      else if (F.st !== 'recover') { F.st = 'stagger'; F.t = 0.3; }
      F.vx = (F.x > hero.x ? 1 : -1) * (kind === 'kick' ? 520 : 200);
      if (F.hp <= 0) { F.st = 'bow'; F.t = 2.6; slowmo(0.9); flash(0.5, '255,240,200'); AU.sfx('gong'); banner(T('wellStruck'), '', 2.4); G.score += 1000; }
    }
    function onFire(h, n) {
      var d = Math.abs(F.x - h.x);
      if (d < 140 && h.gr) { h.atk.kick = true; h.atk.dur = 0.32; AU.sfx('swing'); M.kickPend = true; return; }
      fireArrows(arrows, h, n);
    }
    M.update = function (dt) {
      M.t += dt; lay();
      if (M.tipT <= 0 && seg.tips && tipI < seg.tips.length) { G.tip = tr(seg.tips[tipI].t); G.tipT = 6; M.tipT = 7; tipI++; } M.tipT -= dt;
      var mx = IN.mx(), blk = IN.blockHeld() && hero.gr;
      hero.blocking = blk && !hero.atk;
      physHero(hero, dt, w, { mx: blk ? 0 : mx, jumpP: IN.jumpP(), jumpHeld: IN.jumpHeld(), downP: false, crouch: IN.downHeld(), minX: 50, maxX: W - 50, lockFace: true });
      hero.face = F.x > hero.x ? 1 : -1;
      if (IN.atkP() && !hero.blocking && F.st !== 'bow') attackPress(hero, onFire);
      if (M.kickPend && hero.atk && hero.atk.kick && hero.atk.t > 0.1) { M.kickPend = false; if (Math.abs(F.x - hero.x) < 160) dmgFoe(8, 'kick', (F.x + hero.x) / 2, GY - 80); }
      // arrows
      for (var i = arrows.length - 1; i >= 0; i--) {
        var a = arrows[i]; a.x += a.vx * dt; a.y += a.vy * dt; a.life -= dt;
        if (Math.abs(a.x - F.x) < 38 && a.y > F.y - 190 && a.y < F.y && !a.hits.f) { a.hits.f = 1; dmgFoe(a.n === 1 ? 5 : a.n === 2 ? 10 : 8, a.n === 1 ? 'light' : 'heavy', a.x, a.y); if (a.n === 1 || F.st !== 'bow') { arrows.splice(i, 1); continue; } }
        if (a.life <= 0 || a.x < -50 || a.x > W + 50) arrows.splice(i, 1);
      }
      // foe brain
      F.t -= dt; F.hurt = Math.max(0, F.hurt - dt); F.x += F.vx * dt; F.vx *= Math.pow(0.02, dt); F.x = clamp(F.x, 70, W - 70);
      var d = hero.x - F.x, ad = Math.abs(d);
      if (F.st !== 'bow' && F.st !== 'strike' && F.st !== 'sweep') F.face = d > 0 ? 1 : -1;
      switch (F.st) {
        case 'intro': if (F.t <= 0) { F.st = 'idle'; F.t = 0.6; } break;
        case 'idle': case 'advance':
          if (ad > 190) { F.st = 'advance'; F.x += F.face * 150 * dt; } else F.st = 'idle';
          if (F.t <= 0) {
            var r = Math.random();
            if (ad < 240 && r < 0.55) { F.st = 'windup'; F.t = 0.65; AU.sfx('whisper'); }
            else if (ad < 260 && r < 0.85) { F.st = 'sweepWind'; F.t = 0.6; }
            else if (r < 0.97 && arrows.length) { F.st = 'guard'; F.t = 1.2; }
            else { F.t = 0.3; }
            if (F.st === 'idle' || F.st === 'advance') F.t = 0.25;
          }
          if (arrows.some(function (a) { return Math.abs(a.x - F.x) < 260 && a.n === 1; }) && Math.random() < dt * 2.2 && F.st !== 'windup') { F.st = 'guard'; F.t = 1.0; }
          break;
        case 'guard': if (F.t <= 0) { F.st = 'idle'; F.t = 0.4; } break;
        case 'windup': if (F.t <= 0) { F.st = 'strike'; F.t = 0.28; F.x += F.face * 60; AU.sfx('swing'); F.hitDone = false; } break;
        case 'strike':
          if (!F.hitDone && F.t < 0.2) { F.hitDone = true; var reach = F.face > 0 ? [F.x, GY - 170, F.x + 200, GY - 40] : [F.x - 200, GY - 170, F.x, GY - 40];
            if (overlap(hbox(hero), reach)) { if (hero.blocking && hero.face === -F.face) { AU.sfx('clang'); sparks(hero.x + hero.face * 20, GY - 100, '#cfe0ff', 14); pop(hero.x, hero.y - 170, T('blocked'), '#cfe0ff', 22); hero.vx = -hero.face * 260; G.meter = Math.min(100, G.meter + 15); shake(4); } else hurtHero(F.face, ''); } }
          if (F.t <= 0) { F.st = 'recover'; F.t = 0.9; } break;
        case 'sweepWind': if (F.t <= 0) { F.st = 'sweep'; F.t = 0.32; AU.sfx('cleave'); F.hitDone = false; } break;
        case 'sweep':
          if (!F.hitDone && F.t < 0.24) { F.hitDone = true; var low = [F.x - 230, GY - 50, F.x + 230, GY]; if (overlap(hbox(hero), low) && hero.gr) hurtHero(F.face, ''); else if (!hero.gr) { pop(hero.x, hero.y - 170, '✓', '#bfffc0', 22); G.meter = Math.min(100, G.meter + 10); } dust(F.x + F.face * 120, GY, 10); }
          if (F.t <= 0) { F.st = 'recover'; F.t = 0.8; } break;
        case 'recover': if (F.t <= 0) { F.st = 'idle'; F.t = 0.5 + Math.random() * 0.4; if (ad < 160) F.vx = -F.face * 380; } break;
        case 'stagger': if (F.t <= 0) { F.st = 'idle'; F.t = 0.35; } break;
        case 'bow': if (F.t <= 0 && !M.done) M.done = true; break;
      }
      // body collision
      if (F.st !== 'bow' && ad < 60) { hero.x = F.x - (d >= 0 ? -60 : 60); }
      AU.setIntensity(0.8);
    };
    M.ai = function (C) {
      var d = F.x - hero.x, ad = Math.abs(d); C.mx = 0; C.block = false; C.jumpHeld = !hero.gr && hero.vy < 0;
      if (F.st === 'bow' || F.st === 'intro') return;
      if (F.st === 'windup' && ad < 300) { C.block = true; return; }
      if (F.st === 'strike' && ad < 300) { C.block = true; return; }
      if (F.st === 'sweepWind' && ad < 320 && F.t < 0.32 && hero.gr) { C.jumpP = true; C.jumpHeld = true; return; }
      if (F.st === 'sweep' && hero.gr && ad < 300) { C.jumpP = true; C.jumpHeld = true; return; }
      // keep a shooting distance
      var want = 330;
      if (ad < want - 60) C.mx = d > 0 ? -1 : 1; else if (ad > want + 120) C.mx = d > 0 ? 1 : -1;
      if ((hero.x < 90 && d > 0 && ad < 200) || (hero.x > W - 90 && d < 0 && ad < 200)) { C.mx = 0; }
      if (F.st === 'recover' && !hero.atk) { C.atkP = true; if (G.meter >= 100) hero.aiTriple = 2; }
      else if (hero.aiTriple && hero.atk && hero.atk.t > 0.05) { C.atkP = true; hero.aiTriple--; }
      else if (F.st === 'guard') { if (!hero.atk && hero.chainT <= 0) { C.atkP = true; hero.aiCharge = true; } else if (hero.aiCharge && hero.atk && hero.atk.n === 1 && hero.atk.t > 0.05) { C.atkP = true; hero.aiCharge = false; } }
      else if ((F.st === 'idle' || F.st === 'advance' || F.st === 'stagger') && !hero.atk && hero.chainT <= 0.1) C.atkP = true;
    };
    M.draw = function () {
      lay();
      ART.plate(g, th.plate, 0, 0, W, H, -30, 1.12);
      ART.haze(g, W, H, th.haze, 0, 0.22, H * 0.3);
      ART.groundBlock(g, th, -20, W + 20, GY, GY, H, 0);
      // spar ring: rope posts and a chalk circle
      g.strokeStyle = 'rgba(255,240,210,0.35)'; g.lineWidth = 3; g.beginPath(); g.ellipse(W / 2, GY + 34, W * 0.42, 26, 0, 0, 6.283); g.stroke();
      [40, W - 40].forEach(function (x) { g.fillStyle = '#5a3418'; g.fillRect(x - 6, GY - 110, 12, 118); g.fillStyle = '#d8a050'; g.beginPath(); g.arc(x, GY - 112, 9, 0, 6.283); g.fill(); });
      g.strokeStyle = 'rgba(200,60,40,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(40, GY - 100); g.quadraticCurveTo(W / 2, GY - 80, W - 40, GY - 100); g.stroke();
      // foe
      var fr = { intro: 'ready', idle: 'ready', advance: 'step', guard: 'block', windup: 'windup', strike: 'strike', sweepWind: 'windup', sweep: 'sweep', recover: 'ready', stagger: 'hurt', bow: 'bow' }[F.st];
      ART.shadow(g, F.x, GY + 2, 46, 0.38);
      if (F.st === 'windup' || F.st === 'sweepWind') { var k = 1 - F.t / 0.65; ART.glow(g, F.x + F.face * 50, GY - (F.st === 'sweepWind' ? 30 : 140), 70 + k * 50, F.st === 'sweepWind' ? 'rgba(120,200,255,0.75)' : 'rgba(255,120,60,0.75)'); ART.text(g, F.st === 'sweepWind' ? '▼' : '!', F.x, GY - 250, { size: 40, align: 'center', col: F.st === 'sweepWind' ? '#9ad8ff' : '#ff6a4a', sw: 6, bold: true }); }
      if (F.st === 'recover') { var a2 = 0.6 + 0.4 * Math.sin(G.t * 14); g.globalAlpha = a2; ART.text(g, T('open'), F.x, GY - 250, { size: 26, align: 'center', gold: true, sw: 5 }); g.globalAlpha = 1; ART.glow(g, F.x, GY - 110, 120, 'rgba(255,230,140,0.35)'); }
      if (F.st === 'guard') ART.glow(g, F.x + F.face * 40, GY - 110, 90, 'rgba(160,200,255,0.45)');
      if (F.st === 'sweep') { g.strokeStyle = 'rgba(180,220,255,0.7)'; g.lineWidth = 10; g.beginPath(); g.ellipse(F.x, GY - 16, 220 * (1 - F.t / 0.32), 18, 0, 0, Math.PI); g.stroke(); }
      SPR.draw(g, 'teacher', fr, F.x, GY + 4, { s: 0.8, face: F.face, tint: '#ffffff', tintA: F.hurt * 3 });
      drawHero(g, hero, 0, { s: 1.24, glow: G.meter >= 100 ? 'rgba(255,220,140,0.5)' : null });
      if (hero.blocking) { ART.glow(g, hero.x + hero.face * 30, hero.y - 90, 60, 'rgba(160,210,255,0.55)'); }
      arrows.forEach(function (a) { drawArrow(g, a, 0); });
      ART.drawParts(g, 0, false);
      drawGrade(th);
    };
    M.hud = function () {
      var bw = Math.min(420, W * 0.4), bx = W - bw - 24;
      ART.text(g, tr(CAST.teacher.name), bx + bw, 92, { size: 15, align: 'right', gold: true });
      ART.bar(g, bx, 100, bw, 16, 1 - F.hp / F.max, '#7ad0ff');
      ART.text(g, SAVE.lang === 'hi' ? 'प्रशिक्षण-मीटर' : 'Training meter', bx, 92, { size: 13 });
    };
    return M;
  }

  // ---------------- ARCHERY FOCUS mode (L6 marks) ----------------
  function ArcheryMode(seg, L) {
    var th = theme('range'), M = { kind: 'archery', touch: 'hold', swipes: false, t: 0, done: false, fail: null };
    var tgt = { x: W * 0.74, y: GY - 150, bx: W * 0.74 }, ret = { x: tgt.x, y: tgt.y }, focus = 0, ringT = 0, ring = 130, hits = 0, arrows = seg.arrows, flight = null;
    var gust = { x: 0, y: 0, t: 2.5 }, bird = null, birdT = 4 + Math.random() * 3, shout = null, shoutT = 6 + Math.random() * 3, holdWas = false, drawK = 0;
    M.hero = { id: 'sita' };
    G.tip = tr(seg.tips[0].t); G.tipT = 7; banner(T('mark') + ' ' + seg.mark, (seg.need) + ' / ' + seg.arrows + ' ' + T('arrows').toLowerCase(), 2);
    function breakFocus(msg) { G.stats.breaks++; focus = 0; ringT = 0; AU.sfx('miss'); shake(4); pop(W / 2, GY - 260, msg || T('focusBroken'), '#ff9a7a', 26, true); }
    function resetMark() {
      G.stats.breaks++; G.focusLives--; hits = 0; arrows = seg.arrows; banner(T('markReset'), '', 2); AU.sfx('over');
      if (G.focusLives <= 0) { if (DEMO) G.focusLives = 1; else M.fail = T('focusSpent'); }
    }
    M.update = function (dt) {
      M.t += dt;
      var hold = IN.holdHeld(), tap = IN.tapP();
      if (seg.moving) tgt.x = tgt.bx + Math.sin(M.t * 2.1) * 70; tgt.y = GY - 150 + (seg.moving ? Math.sin(M.t * 1.3) * 18 : 0);
      if (hold) { focus = Math.min(1, focus + dt * 0.75); drawK = Math.min(1, drawK + dt * 2); } else { focus = Math.max(0, focus - dt * 0.6); drawK = Math.max(0, drawK - dt * 3); }
      // gusts
      if (seg.gusts) { gust.t -= dt; if (gust.t <= 0) { gust.t = 3 + Math.random() * 3; gust.x = (Math.random() < 0.5 ? -1 : 1) * 70 * seg.gusts; gust.y = (Math.random() - 0.5) * 40; AU.sfx('wind'); ART.spawn('leaf', 0, 200, { n: 8, ang: 0, spread: 0.4, speed: 500, life: 2, r: 5, col: '#7a9a3a', screen: true, jy: 200 }); } }
      gust.x *= Math.pow(0.25, dt); gust.y *= Math.pow(0.25, dt);
      // aim drift (smaller with focus) + steady wind bias + target lag
      var amp = 8 + 75 * (1 - focus), wb = seg.wind * 22 * (1 - focus * 0.6);
      var nx = Math.sin(M.t * 1.7) * 0.6 + Math.sin(M.t * 3.1 + 1) * 0.4, ny = Math.sin(M.t * 1.3 + 2) * 0.6 + Math.sin(M.t * 2.7) * 0.4;
      var gx = tgt.x + nx * amp + wb + gust.x, gy = tgt.y + ny * amp * 0.7 + gust.y;
      ret.x += (gx - ret.x) * Math.min(1, dt * 6); ret.y += (gy - ret.y) * Math.min(1, dt * 6);
      // ring closes while drawn
      if (hold && focus > 0.35) { ringT += dt; if (ringT > 1.4) ringT -= 1.4; ring = 130 * (1 - ringT / 1.4); } else { ringT = 0; ring = 130; }
      // birds / shouts
      if (seg.birds) { birdT -= dt; if (birdT <= 0 && !bird) { bird = { x: W + 60, y: tgt.y - 10 + (Math.random() - 0.5) * 30, vx: -(200 + Math.random() * 80) }; AU.sfx('screech'); birdT = 5 / seg.birds + Math.random() * 3; } }
      if (bird) { bird.x += bird.vx * dt; if (bird.x < -60) bird = null; }
      if (seg.shouts) { shoutT -= dt; if (shoutT <= 0 && !shout) { var lines = SAVE.lang === 'hi' ? ['राजकुमारी! इधर देखो!', 'साँप! साँप!', 'जल्दी करो!'] : ['Princess! Look here!', 'A snake! A snake!', 'Hurry up!']; shout = { txt: lines[Math.floor(Math.random() * lines.length)], t: 1.3, x: 120 + Math.random() * (W * 0.4) }; AU.sfx('shout'); shoutT = 6 / seg.shouts + Math.random() * 3; } }
      if (shout) { shout.t -= dt; if (shout.t <= 0) shout = null; }
      // release
      if (tap && !flight) {
        if (shout) { breakFocus(T('ignore')); shout = null; }
        else if (bird && Math.abs(bird.x - tgt.x) < 110) { arrows--; breakFocus(T('bird')); AU.sfx('screech'); }
        else if (!hold || focus < 0.35) { arrows--; pop(W * 0.3, GY - 220, T('weak'), '#ffb0a0', 22, true); AU.sfx('bow'); flight = { t: 0, x0: W * 0.22 + 40, y0: GY - 100, x1: ret.x + (Math.random() - 0.5) * 160, y1: ret.y + 60 + Math.random() * 40, res: 'miss' }; }
        else {
          arrows--;
          var err = Math.hypot(ret.x - tgt.x, ret.y - tgt.y), timing = ring >= 30 && ring <= 38 ? 'perfect' : ring >= 24 && ring <= 44 ? 'good' : 'off';
          var pen = timing === 'perfect' ? 0 : timing === 'good' ? 10 : 30, tot = err + pen;
          var res = tot < 40 ? (timing === 'perfect' && err < 16 ? 'true' : 'hit') : 'miss';
          AU.sfx('bowHeavy'); flight = { t: 0, x0: W * 0.22 + 40, y0: GY - 100, x1: res === 'miss' ? ret.x + (ret.x - tgt.x) * 0.6 + 20 : ret.x, y1: res === 'miss' ? ret.y + (ret.y - tgt.y) * 0.6 + 10 : ret.y, res: res };
          M.lastShot = { err: err, ring: ring, res: res };
        }
        focus *= 0.4; ringT = 0; drawK = 0;
      }
      if (flight) {
        flight.t += dt / 0.32;
        if (flight.t >= 1) {
          var r = flight.res;
          if (r === 'true' || r === 'hit') { hits++; G.score += r === 'true' ? 400 : 200; if (r === 'true') { G.stats.trueShots++; AU.sfx('perfect'); slowmo(0.15); flash(0.2, '255,240,180'); } else AU.sfx('thunk'); pop(tgt.x, tgt.y - 90, r === 'true' ? T('trueShot') : T('hit'), r === 'true' ? '#ffe27a' : '#fff2c0', r === 'true' ? 30 : 24, true); sparks(flight.x1, flight.y1, '#ffe0a0', 12); M.stuck = (M.stuck || []).concat([[flight.x1 - tgt.x, flight.y1 - tgt.y]]); }
          else { AU.sfx('miss'); pop(flight.x1, flight.y1 - 40, T('miss'), '#ffb0a0', 22, true); dust(flight.x1, Math.min(GY, flight.y1 + 80), 5); }
          flight = null;
          if (hits >= seg.need) { M.doneT = 1.2; AU.sfx('level'); banner(T('mark') + ' ' + seg.mark + ' ✓', hits + ' ' + T('hits').toLowerCase(), 1.4); }
          else if (arrows <= 0) resetMark();
        }
      }
      if (M.doneT != null) { M.doneT -= dt; if (M.doneT <= 0) M.done = true; }
      AU.setIntensity(0.25 + focus * 0.3);
      M.focus = focus; M.ring = ring; M.err = Math.hypot(ret.x - tgt.x, ret.y - tgt.y); M.bird = bird; M.shout = shout; M.hold = hold;
    };
    M.ai = function (C) {
      C.hold = true;
      if (M.doneT != null || flight) return;
      var waitN = M.aiWait || 0, lim = 13 + Math.min(14, waitN * 2.5);
      if (M.shout || (M.bird && M.bird.x - tgt.x < 260 && M.bird.x - tgt.x > -120)) return;
      if (M.focus > 0.9 && M.ring >= 31 && M.ring <= 37) { if (M.err < lim) { C.tapP = true; M.aiWait = 0; } else if (!M.aiCounted) { M.aiWait = waitN + 1; M.aiCounted = true; } }
      if (M.ring > 60) M.aiCounted = false;
    };
    M.draw = function () {
      ART.plate(g, th.plate, 0, 0, W, H, -20, 1.1);
      ART.haze(g, W, H, th.haze, 0, 0.18, H * 0.4);
      ART.groundBlock(g, th, -20, W + 20, GY, GY, H, 0);
      // target stand
      var x = tgt.x, y = tgt.y;
      g.fillStyle = '#5a3418'; g.fillRect(x - 40, y + 30, 8, GY - y - 26); g.fillRect(x + 32, y + 30, 8, GY - y - 26);
      ART.shadow(g, x, GY + 2, 60, 0.3);
      SPR.drawC(g, 'prop', 'target', x, y, { s: 0.62 });
      (M.stuck || []).forEach(function (s) { var sx = x + s[0], sy = y + s[1]; g.strokeStyle = '#5a3a1a'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx - 26, sy + 4); g.stroke(); g.fillStyle = '#c84a2a'; g.fillRect(sx - 30, sy, 6, 6); });
      // Sita at the line
      var fr = flight ? 'release' : M.hold ? (drawK > 0.6 ? 'aim' : 'draw') : 'idle';
      ART.shadow(g, W * 0.22, GY + 2, 40, 0.35);
      if (M.focus > 0.6) ART.glow(g, W * 0.22, GY - 100, 120, 'rgba(255,230,160,' + (0.3 * M.focus) + ')');
      SPR.draw(g, 'sita', fr, W * 0.22, GY + 4, { s: 0.7, face: 1 });
      if (bird) SPR.draw(g, 'foe', 'eagle' + (Math.floor(G.t * 10) % 2), bird.x, bird.y + 30, { s: 0.32, cx: true, face: -1 });
      if (flight) { var k = flight.t, fx = lerp(flight.x0, flight.x1, k), fy = lerp(flight.y0, flight.y1, k) - Math.sin(k * Math.PI) * 30; drawArrow(g, { x: fx, y: fy, vx: flight.x1 - flight.x0, vy: (flight.y1 - flight.y0) - Math.cos(k * Math.PI) * 90, glow: flight.res === 'true' }, 0); }
      ART.drawParts(g, 0, false);
      drawGrade(th);
      // focus vignette (world quiets down)
      if (M.focus > 0) { g.fillStyle = 'rgba(10,5,0,' + (0.35 * M.focus) + ')'; g.fillRect(0, 0, W, H); ART.glow(g, x, y, 220, 'rgba(255,230,180,' + (0.12 * M.focus) + ')'); }
      // reticle + closing ring
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 2;
      g.beginPath(); g.arc(ret.x, ret.y, 12, 0, 6.283); g.moveTo(ret.x - 22, ret.y); g.lineTo(ret.x - 6, ret.y); g.moveTo(ret.x + 6, ret.y); g.lineTo(ret.x + 22, ret.y); g.moveTo(ret.x, ret.y - 22); g.lineTo(ret.x, ret.y - 6); g.moveTo(ret.x, ret.y + 6); g.lineTo(ret.x, ret.y + 22); g.stroke();
      g.strokeStyle = 'rgba(255,230,150,0.5)'; g.setLineDash([4, 5]); g.beginPath(); g.arc(x, y, 34, 0, 6.283); g.stroke(); g.setLineDash([]);
      if (M.hold && M.focus > 0.35) { var good = ring >= 24 && ring <= 44, perf = ring >= 30 && ring <= 38; g.strokeStyle = perf ? '#fff4a0' : good ? '#ffd060' : 'rgba(255,200,90,0.8)'; g.lineWidth = perf ? 5 : 3; g.beginPath(); g.arc(x, y, Math.max(1, ring), 0, 6.283); g.stroke(); }
      g.restore();
      if (shout) { ART.panel(g, shout.x - 10, 150, 260, 54, { r: 14 }); ART.text(g, shout.txt, shout.x + 120, 184, { size: 20, align: 'center', col: '#ffd0b0' }); }
    };
    M.hud = function () {
      ART.text(g, T('mark') + ' ' + seg.mark + '/3   ' + T('hits') + ' ' + hits + '/' + seg.need + '   ' + T('arrows') + ' ' + arrows, W / 2, 72, { size: 19, align: 'center', gold: true });
      ART.bar(g, W / 2 - 130, 84, 260, 10, M.focus || 0, '#ffd27a'); ART.text(g, T('focusL'), W / 2 - 140, 94, { size: 13, align: 'right' });
      if (G.L.dayTime) { ART.bar(g, W / 2 - 130, 102, 260, 8, G.day / G.L.dayTime, '#ff9a4a'); ART.text(g, '☀ ' + T('dayLeft'), W / 2 - 140, 110, { size: 13, align: 'right' }); }
      for (var i = 0; i < (G.L.focusLives || 0); i++) { g.globalAlpha = i < G.focusLives ? 1 : 0.25; ART.text(g, '◉', W / 2 + 150 + i * 20, 96, { size: 16, col: '#ffe27a' }); } g.globalAlpha = 1;
    };
    return M;
  }

  // ---------------- MEDITATE / STAY-PUT mode (L7) ----------------
  function MeditateMode(seg) {
    var th = theme('peak'), M = { kind: 'meditate', touch: 'hold', swipes: false, t: 0, done: false, fail: null };
    var prog = 0, S = 70, threats = [], nextT = 4, waveI = 0, kinds = ['pebble', 'whisper', 'pebble', 'crown', 'whisper', 'battle', 'pebble', 'crown', 'battle', 'whisper'];
    var cx = W * 0.5, cy = GY - 30;
    M.hero = { id: 'ascetic' };
    G.tip = tr(seg.tips[0].t); G.tipT = 8; banner(T('penance'), '', 2);
    G.stats.minSteady = 100; M.flashBattle = 0;
    function brk() { G.stats.breaks++; G.pips--; S = 55; shake(12); flash(0.4, '120,60,200'); AU.sfx('crack'); pop(cx, cy - 280, T('focusBroken'), '#ff9a7a', 28, true); if (G.pips <= 0 || G.stats.breaks >= 3) { if (DEMO) { G.pips = Math.max(1, G.pips); } else M.fail = T('meditBroken'); } }
    function spawnThreat() {
      var k = kinds[waveI % kinds.length]; waveI++;
      var side = waveI % 2 ? -1 : 1, t = { k: k, r: 110, x: cx + side * (180 + Math.random() * 120), y: cy - 150 - Math.random() * 120, life: 0, side: side };
      if (k === 'pebble') { t.x = cx + side * 60; t.y = 40; t.vy = 0; AU.sfx('crack'); }
      if (k === 'whisper') { t.x = cx + side * (W * 0.45); t.y = cy - 180; AU.sfx('whisper'); t.txt = SAVE.lang === 'hi' ? ['छोड़ दो...', 'कोई नहीं सुनता...', 'तुम अकेले हो...'][waveI % 3] : ['Give up...', 'No one is listening...', 'You are alone...'][waveI % 3]; }
      if (k === 'crown') { t.x = cx + side * 220; t.y = cy - 260; AU.sfx('bell'); }
      if (k === 'battle') { t.x = cx; t.y = cy - 200; M.flashBattle = 1.8; AU.sfx('drum'); AU.sfx('rumble'); }
      threats.push(t);
    }
    M.update = function (dt) {
      M.t += dt;
      var hold = IN.holdHeld(), tap = IN.tapP();
      if (hold) { prog += dt; S = Math.min(100, S + 3 * dt); } else { S -= 20 * dt; }
      nextT -= dt; if (nextT <= 0 && prog < seg.duration - 6) { spawnThreat(); nextT = Math.max(4.2, 8.5 - prog / seg.duration * 4) + Math.random() * 1.5; }
      M.flashBattle = Math.max(0, M.flashBattle - dt);
      var tapUsed = false;
      threats.forEach(function (t) {
        t.life += dt; t.r -= dt * (110 / 2.0);
        if (t.k === 'pebble') { t.y = Math.min(cy - 160, 40 + t.life * t.life * 60); }
        if (t.k === 'whisper') { t.x += (cx - t.x) * dt * 0.9; }
        if (t.k === 'crown') { t.y += Math.sin(t.life * 3) * 0.4; }
        if (tap && !tapUsed && !t.done) {
          tapUsed = true;
          if (t.r <= 34 && t.r >= 8) { t.done = 'ok'; S = Math.min(100, S + 8); G.score += 300; AU.sfx('good'); pop(t.x, t.y - 50, T('steady'), '#bfe8ff', 24, true); ART.spawn('ring', t.x, t.y, { r: 20, life: 0.6, col: 'rgba(200,230,255,0.9)', speed: 0, screen: true }); }
          else if (t.r > 34) { t.done = 'soon'; S -= 10; AU.sfx('miss'); pop(t.x, t.y - 50, T('tooSoon'), '#ffb0a0', 22, true); }
        }
        if (!t.done && t.r <= 0) { t.done = 'miss'; S -= 25; shake(8); AU.sfx(t.k === 'pebble' ? 'hit' : 'whisper'); pop(t.x, t.y - 40, '−', '#ff9a7a', 30, true); }
      });
      threats = threats.filter(function (t) { if (t.done) { t.fade = (t.fade || 0) + dt; return t.fade < 0.4; } return true; });
      if (M.t > 2 && hold) G.stats.minSteady = Math.min(G.stats.minSteady, Math.round(S));
      if (S <= 0) brk();
      if (prog >= seg.duration && !M.doneT) { M.doneT = 2.2; AU.sfx('aura'); flash(0.5, '255,230,190'); banner(T('steady'), Math.round(seg.duration) + 's', 2); }
      if (M.doneT) { M.doneT -= dt; if (M.doneT <= 0) M.done = true; }
      if (hold && Math.random() < 0.2 + prog / seg.duration * 0.6) ART.spawn('glow', cx + (Math.random() - 0.5) * 120, cy - Math.random() * 180, { n: 1, ang: -1.57, spread: 0.6, speed: 30, life: 1.4, r: 6, col: 'rgba(255,190,120,0.7)', screen: true });
      AU.setIntensity(0.2 + prog / seg.duration * 0.6);
      M.S = S; M.prog = prog; M.threats = threats; M.hold = hold;
    };
    M.ai = function (C) {
      C.hold = true;
      var live = M.threats && M.threats.filter(function (t) { return !t.done; });
      if (live && live.length) { var t = live.reduce(function (a, b) { return a.r < b.r ? a : b; }); if (t.r < 26 && t.r > 12) C.tapP = true; }
    };
    M.draw = function () {
      var k = clamp(prog / seg.duration, 0, 1);
      ART.plate(g, th.plate, M.t * 3, 1, W, H, -20, 1.1 + k * 0.05);
      if (M.flashBattle > 0) { g.globalAlpha = Math.min(1, M.flashBattle) * 0.55; ART.plate(g, 'bg1', 0, 0, W, H, 0, 1.15); g.fillStyle = 'rgba(120,10,0,0.4)'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
      g.fillStyle = 'rgba(20,10,60,' + (0.15 + k * 0.25) + ')'; g.fillRect(0, 0, W, H);
      // the ledge (painted rock, stretched)
      SPR.drawRect(g, 'terr', 'ledgeRock', cx - 330, cy - 14, 660, 170);
      drawFire(cx + 170, cy + 14, 0.38 - k * 0.12);
      g.save(); g.translate(cx - 150, cy + 8); g.rotate(-0.08); g.fillStyle = '#c8ccd8'; g.beginPath(); g.moveTo(-70, 0); g.lineTo(40, -5); g.lineTo(52, 0); g.lineTo(40, 5); g.closePath(); g.fill(); g.fillStyle = '#c89a3a'; g.fillRect(-78, -9, 8, 18); g.fillStyle = '#5a2a14'; g.fillRect(-100, -3, 22, 6); g.restore();
      // aura
      var aur = (M.hold ? 0.4 : 0.1) + k * 0.6;
      ART.glow(g, cx, cy - 110, 150 + k * 120, 'rgba(255,170,90,' + (0.35 * aur) + ')');
      if (k > 0.5) ART.glow(g, cx, cy - 110, 260, 'rgba(170,120,255,' + (0.25 * (k - 0.5)) + ')');
      var fr = !M.hold ? 'strain' : S < 30 ? 'slump' : k > 0.8 ? 'aura' : (threats.some(function (t) { return !t.done && t.r < 60; }) ? 'strain' : 'calm');
      SPR.draw(g, 'ascetic', fr, cx, cy + 16, { s: 0.92, face: 1, sy: 1 + Math.sin(M.t * 1.2) * 0.012 });
      // threats
      threats.forEach(function (t) {
        var a = t.done ? 1 - t.fade / 0.4 : 1; g.globalAlpha = a;
        if (t.k === 'pebble') SPR.drawC(g, 'prop', 'rock', t.x, t.y, { s: 0.16, rot: t.life * 4 });
        if (t.k === 'whisper') { ART.glow(g, t.x, t.y, 70, 'rgba(40,10,60,0.8)'); ART.text(g, t.txt, t.x, t.y - 40, { size: 20, align: 'center', col: '#d8c0ff', sw: 4 }); for (var i = 0; i < 3; i++) ART.spawn('smoke', t.x + (Math.random() - 0.5) * 30, t.y, { speed: 20, life: 0.6, r: 12, col: 'rgba(30,10,40,1)', screen: true }); }
        if (t.k === 'crown') { ART.glow(g, t.x, t.y, 80, 'rgba(255,215,90,0.8)'); drawCrown(t.x, t.y); ART.text(g, SAVE.lang === 'hi' ? 'सिंहासन...' : 'A throne...', t.x, t.y - 50, { size: 18, align: 'center', gold: true }); }
        if (t.k === 'battle') { ART.text(g, SAVE.lang === 'hi' ? 'याद करो वह रणक्षेत्र...' : 'Remember the field of ash...', t.x, t.y - 40, { size: 22, align: 'center', col: '#ffb090', sw: 4 }); }
        if (!t.done) { var good = t.r <= 34 && t.r >= 8; g.strokeStyle = good ? '#bfe8ff' : 'rgba(255,255,255,0.7)'; g.lineWidth = good ? 5 : 3; g.beginPath(); g.arc(t.x, t.y, Math.max(1, t.r), 0, 6.283); g.stroke(); g.strokeStyle = 'rgba(190,230,255,0.4)'; g.lineWidth = 2; g.setLineDash([3, 4]); g.beginPath(); g.arc(t.x, t.y, 22, 0, 6.283); g.stroke(); g.setLineDash([]); }
        g.globalAlpha = 1;
      });
      ART.drawParts(g, 0, true);
      ART.vignette(g, W, H, 0.55);
    };
    function drawCrown(x, y) { g.fillStyle = '#f2c84a'; g.beginPath(); g.moveTo(x - 30, y + 14); g.lineTo(x - 34, y - 14); g.lineTo(x - 16, y); g.lineTo(x, y - 22); g.lineTo(x + 16, y); g.lineTo(x + 34, y - 14); g.lineTo(x + 30, y + 14); g.closePath(); g.fill(); g.fillStyle = '#c0302a'; g.beginPath(); g.arc(x, y + 4, 5, 0, 6.283); g.fill(); }
    M.hud = function () {
      var bw = Math.min(360, W * 0.34);
      ART.text(g, T('penance'), W / 2 - bw / 2 - 10, 92, { size: 15, align: 'right', gold: true }); ART.bar(g, W / 2 - bw / 2, 82, bw, 12, prog / seg.duration, '#ffb060');
      ART.text(g, T('steadiness'), W / 2 - bw / 2 - 10, 114, { size: 15, align: 'right' }); ART.bar(g, W / 2 - bw / 2, 104, bw, 12, S / 100, S < 30 ? '#ff6a4a' : '#9ad0ff');
      g.fillStyle = '#ffe27a'; g.fillRect(W / 2 - bw / 2 + bw * 0.35, 102, 2, 16);
    };
    return M;
  }

  // ---------------- BEAT drill (L5 drill 2: hold to draw, release on the drum) ----------------
  function BeatMode(seg) {
    var th = theme('sand'), M = { kind: 'beat', touch: 'hold', swipes: false, t: 0, done: false, fail: null, restart: false };
    var period = 1.2, drawK = 0, held = false, hits = 0, arrows = seg.arrows, flight = null, beatI = 0, lastBeat = -1;
    M.hero = { id: 'rama' };
    G.tip = tr(seg.tips[0].t); G.tipT = 8; banner(tr(seg.drillName), seg.need + ' / ' + seg.arrows, 2);
    var t0 = 1.0;
    M.update = function (dt) {
      M.t += dt;
      var bt = M.t - t0, idx = Math.floor(bt / period);
      if (bt >= 0 && idx !== lastBeat) { lastBeat = idx; AU.sfx('drum'); M.pulse = 1; }
      M.pulse = Math.max(0, (M.pulse || 0) - dt * 3);
      var h = IN.holdHeld();
      if (h) drawK = Math.min(1, drawK + dt); 
      if (held && !h && !flight && M.doneT == null) {
        var ph = bt - Math.round(bt / period) * period, e = Math.abs(ph);
        arrows--;
        var res = drawK < 0.95 ? 'weak' : e <= 0.06 ? 'perfect' : e <= 0.12 ? 'good' : 'off';
        AU.sfx(res === 'weak' ? 'bow' : 'bowHeavy');
        flight = { t: 0, res: res };
        M.last = { e: e, res: res };
        drawK = 0;
      }
      if (!h && !held) drawK = Math.max(0, drawK - dt * 2);
      held = h;
      if (flight) {
        flight.t += dt / 0.3;
        if (flight.t >= 1) {
          var r = flight.res;
          if (r === 'perfect' || r === 'good') { hits++; G.score += r === 'perfect' ? 350 : 200; if (r === 'perfect') { G.stats.perfect++; AU.sfx('perfect'); } else AU.sfx('thunk'); pop(W * 0.72, GY - 230, r === 'perfect' ? T('perfect') : T('beat'), '#ffe27a', 26, true); sparks(W * 0.72, GY - 150, '#ffe0a0', 10); }
          else { AU.sfx('miss'); pop(W * 0.72, GY - 230, r === 'weak' ? T('weak') : T('offBeat'), '#ffb0a0', 22, true); }
          flight = null;
          if (hits >= seg.need) { M.doneT = 1.2; AU.sfx('level'); }
          else if (arrows < seg.need - hits) { G.stats.drillRetries++; M.restart = true; banner(T('drillFail'), tr(seg.drillName), 1.8); }
        }
      }
      if (M.doneT != null) { M.doneT -= dt; if (M.doneT <= 0) M.done = true; }
      M.bt = bt; M.drawK = drawK; M.held = held;
    };
    M.ai = function (C) {
      var bt = M.bt || 0, nb = Math.ceil((bt + 0.0001) / period) * period, toNext = nb - bt;
      if (bt < 0) { C.hold = true; return; }
      if (M.aiRel) { C.hold = false; M.aiRel--; return; }
      if (M.held && M.drawK >= 0.98 && toNext < 0.0175) { C.hold = false; M.aiRel = 3; return; }
      C.hold = !flight;
    };
    M.draw = function () {
      ART.plate(g, th.plate, 0, 0, W, H, -20, 1.1);
      ART.haze(g, W, H, th.haze, 0, 0.2, H * 0.4);
      ART.groundBlock(g, th, -20, W + 20, GY, GY, H, 0);
      var tx = W * 0.72, ty = GY - 150;
      g.fillStyle = '#5a3418'; g.fillRect(tx - 4, ty + 30, 8, GY - ty - 26); SPR.drawC(g, 'prop', 'target', tx, ty, { s: 0.55 });
      SPR.draw(g, 'npc', 'vasishtha', W * 0.9, GY + 4, { s: 0.5, face: -1 });
      // drum + converging rings
      var dx = W * 0.47, dy = GY - 40, bt = M.bt || 0, ph = ((bt % period) + period) % period, k = 1 - ph / period;
      ART.shadow(g, dx, GY + 2, 40, 0.3);
      g.fillStyle = '#8a3a1a'; ART.rr(g, dx - 34, dy - 30, 68, 60, 14); g.fill(); g.fillStyle = '#e8d0a0'; g.beginPath(); g.ellipse(dx, dy - 30, 34, 10, 0, 0, 6.283); g.fill();
      if (M.pulse) ART.glow(g, dx, dy - 30, 90 * M.pulse + 30, 'rgba(255,220,140,0.8)');
      g.strokeStyle = 'rgba(255,230,160,0.9)'; g.lineWidth = 3; g.beginPath(); g.arc(dx, dy - 120, 22 + 90 * k, 0, 6.283); g.stroke();
      g.strokeStyle = '#fff4c0'; g.lineWidth = 4; g.beginPath(); g.arc(dx, dy - 120, 22, 0, 6.283); g.stroke();
      // Rama drawing
      var fr = flight ? 'shoot' : M.drawK > 0.1 ? 'shoot' : 'idle';
      ART.shadow(g, W * 0.2, GY + 2, 40, 0.35);
      if (M.drawK >= 0.95) ART.glow(g, W * 0.2 + 40, GY - 100, 70, 'rgba(255,230,150,0.6)');
      SPR.draw(g, 'rama', fr, W * 0.2, GY + 4, { s: 0.68, face: 1 });
      ART.bar(g, W * 0.2 - 40, GY - 175, 80, 8, M.drawK || 0, M.drawK >= 0.95 ? '#fff4a0' : '#ffb060');
      if (flight) { var f = flight.t, x0 = W * 0.2 + 40, y0 = GY - 100, x1 = tx + (flight.res === 'perfect' || flight.res === 'good' ? 0 : 90), y1 = ty + (flight.res === 'weak' ? 120 : 0); drawArrow(g, { x: lerp(x0, x1, f), y: lerp(y0, y1, f) - Math.sin(f * Math.PI) * 20, vx: 1, vy: 0, glow: flight.res === 'perfect' }, 0); }
      ART.drawParts(g, 0, false);
      drawGrade(th);
    };
    M.hud = function () { ART.text(g, tr(seg.drillName) + '   ' + T('hits') + ' ' + hits + '/' + seg.need + '   ' + T('arrows') + ' ' + arrows, W / 2, 80, { size: 19, align: 'center', gold: true }); };
    M.restartSeg = function () { return BeatMode(seg); };
    return M;
  }

  // ---------------- level flow ----------------
  function makeMode(seg) {
    if (!seg.theme) seg.theme = G.L.theme;
    switch (seg.type) {
      case 'story': return StoryMode(seg);
      case 'platform': return PlatformMode(seg, G.L);
      case 'runner': return RunnerMode(seg);
      case 'arena': return ArenaMode(seg);
      case 'archery': return ArcheryMode(seg, G.L);
      case 'meditate': return MeditateMode(seg);
      case 'beat': return BeatMode(seg);
    }
    return StoryMode({ cast: [], lines: [{ who: 'narrator', en: '...', hi: '...' }], theme: seg.theme });
  }
  function freshStats() { return { hits: 0, falls: 0, standards: 0, lotus: 0, perfect: 0, sparHits: 0, smash: 0, drillRetries: 0, wild: 0, trueShots: 0, breaks: 0, minSteady: 100, together: 0, bumps: 0 }; }
  function startLevel(li, si) {
    G.li = li; G.L = LEVELS[li]; G.pips = 3; G.meter = 0; G.score = 0; G.stats = freshStats();
    G.day = G.L.dayTime || 0; G.focusLives = G.L.focusLives || 0; G.levelT = 0; G.segLog = [];
    startSeg(si || 0);
  }
  function startSeg(i) {
    G.si = i; var seg = G.L.segs[i]; if (!seg.theme) seg.theme = G.L.theme;
    ART.clearParts(); FX.pops.length = 0; G.tip = null; G.tipT = 0; G.segPips = G.pips; G.segT = 0;
    G.mode = makeMode(seg); G.segName = seg.type;
    var mus = seg.type === 'story' ? 'calm' : (seg.music || 'play');
    AU.setMusic(mus, { raga: G.L.music.raga, lead: G.L.music.lead, intensity: 0.4 });
    AU.setAmbience(theme(seg.theme).amb);
    FX.fade = 1;
  }
  function nextSeg() {
    G.segLog.push({ si: G.si, type: G.L.segs[G.si].type, t: Math.round(G.segT * 10) / 10 });
    if (G.si + 1 < G.L.segs.length) startSeg(G.si + 1);
    else finishLevel();
  }
  function starCheck(r) { if (!r) return true; var v = G.stats[r.stat] || 0; return r.min != null ? v >= r.min : v <= r.max; }
  function finishLevel() {
    var L = G.L, s2 = starCheck(L.star2), s3 = starCheck(L.star3), stars = 1 + (s2 ? 1 : 0) + (s3 ? 1 : 0);
    G.score += G.pips * 250 + stars * 500; G.score = Math.round(G.score);
    var b = SAVE.best[L.n] || { score: 0, stars: 0 };
    SAVE.best[L.n] = { score: Math.max(b.score, G.score), stars: Math.max(b.stars, stars) };
    SAVE.unlocked = Math.max(SAVE.unlocked, Math.min(8, L.n + 1)); persist();
    G.result = { stars: stars, s2: s2, s3: s3, score: G.score, best: SAVE.best[L.n], newBest: G.score > b.score };
    AU.setMusic('off'); AU.sfx('victory');
    setScene(SC.complete);
  }

  // ---------------- HUD / touch ----------------
  var HUDB = { pause: { x: 0, y: 14, w: 46, h: 46 }, sound: { x: 0, y: 14, w: 46, h: 46 } };
  function layoutHud() { HUDB.pause.x = W - 60; HUDB.sound.x = W - 114; }
  function inB(b, x, y) { return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; }
  function touchLayout() {
    var m = G.mode, t = m && m.touch, L = [];
    if (!TOUCH || !t || t === 'story') return L;
    if (t === 'runner') return [{ zone: 'left', act: 'jump', label: T('hold') === 'HOLD' ? 'JUMP' : 'कूदो' }, { zone: 'right', act: 'atk', label: G.mode && G.L.segs[G.si].jumpOnly ? '' : '⚔' }];
    if (t === 'hold') return [{ zone: 'left', act: 'hold', label: T('hold') }, { zone: 'right', act: 'tap', label: T('tap') }];
    L.push({ x: 84, y: H - 78, r: 46, act: 'left', label: '◀' }, { x: 196, y: H - 78, r: 46, act: 'right', label: '▶' });
    L.push({ x: W - 92, y: H - 92, r: 56, act: 'jump', label: 'JUMP' });
    var hero = G.mode.hero && G.mode.hero.A;
    if (t === 'noatk') L.push({ x: W - 214, y: H - 66, r: 42, act: 'confirm', label: '💬' });
    else L.push({ x: W - 214, y: H - 66, r: 44, act: 'atk', label: hero && !hero.melee ? '➶' : '⚔' });
    L.push({ x: W - 92, y: H - 206, r: 32, act: 'down', label: '▼' });
    if (t === 'arena') L.push({ x: W - 320, y: H - 60, r: 40, act: 'block', label: 'BLOCK' });
    if (t === 'duo') L.push({ x: W - 206, y: H - 176, r: 34, act: 'tag', label: '⇄' });
    return L;
  }
  function drawTouch() {
    var L = touchLayout(); if (!L.length) return;
    L.forEach(function (b) {
      if (b.zone) {
        var x0 = b.zone === 'left' ? 0 : W / 2, down = !!K[b.act];
        g.fillStyle = down ? 'rgba(255,230,160,0.08)' : 'rgba(255,230,160,0.0)'; g.fillRect(x0, 120, W / 2, H - 120);
        if (b.label) { g.globalAlpha = 0.5; ART.text(g, b.label, x0 + W / 4, H - 26, { size: 18, align: 'center', col: '#ffe9b0' }); g.globalAlpha = 1; }
      } else ART.touchBtn(g, b.x, b.y, b.r, b.label, !!K[b.act]);
    });
  }
  function hudTop() {
    layoutHud();
    var L = G.L, ss = Math.min(1, W / 900);
    // left: level plaque + pips + meter
    ART.panel(g, 10, 10, 250, 58, { r: 14, plain: true, c0: 'rgba(30,12,6,0.62)', c1: 'rgba(20,8,4,0.7)' });
    ART.text(g, (SAVE.lang === 'hi' ? 'स्तर ' : 'Level ') + L.n + ' · ' + tr(L.title), 22, 32, { size: 14, gold: true, sw: 3 });
    for (var i = 0; i < G.maxPips; i++) if (i < Math.max(G.pips, 3)) ART.pip(g, 30 + i * 26, 50, 11, i < G.pips);
    var m = G.mode, showMeter = m && (m.kind === 'platform' || m.kind === 'runner' || m.kind === 'arena') && !(G.L.segs[G.si].noAttack || G.L.segs[G.si].jumpOnly);
    if (showMeter) { ART.bar(g, 112, 44, 136, 12, G.meter / 100, G.meter >= 100 ? '#fff07a' : '#f0a030'); if (G.meter >= 100) ART.glow(g, 180, 50, 50, 'rgba(255,230,140,0.4)'); }
    // right: score + buttons
    ART.text(g, T('score') + ' ' + Math.round(G.score), W - 130, 44, { size: 20, align: 'right', gold: true });
    ART.panel(g, HUDB.sound.x, HUDB.sound.y, 46, 46, { r: 23, plain: true }); ART.iconSound(g, HUDB.sound.x + 23, HUDB.sound.y + 23, 22, !AU.isMuted());
    ART.panel(g, HUDB.pause.x, HUDB.pause.y, 46, 46, { r: 23, plain: true }); ART.iconPause(g, HUDB.pause.x + 23, HUDB.pause.y + 23, 22);
    if (m && m.hud) m.hud();
    if (DEMO) ART.text(g, T('demo'), W - 20, 84, { size: 13, align: 'right', col: '#9ad0ff' });
    // tip
    if (G.tip && G.tipT > 0 && !(m && m.isTalking && m.isTalking())) {
      var a = Math.min(1, G.tipT, (8 - Math.min(8, G.tipT)) * 4 + 0.2); g.globalAlpha = Math.min(1, a);
      var lines = ART.wrap(g, G.tip, Math.min(640, W - 340), 17), tw = 0; g.font = ART.font(17); lines.forEach(function (l) { tw = Math.max(tw, g.measureText(l).width); });
      var bh = 18 + lines.length * 22, by = m && m.kind === 'story' ? 80 : H - bh - (TOUCH ? 150 : 18);
      ART.panel(g, W / 2 - tw / 2 - 18, by, tw + 36, bh, { r: 12, plain: true }); lines.forEach(function (l, k) { ART.text(g, l, W / 2, by + 26 + k * 22, { size: 17, align: 'center', col: '#fff2d8' }); });
      g.globalAlpha = 1;
    }
  }
  function drawPops(cam) {
    FX.pops.forEach(function (p) { var k = p.t / 1.1, x = p.screen ? p.x : p.x - cam, y = p.y - k * 50; g.globalAlpha = Math.max(0, 1 - k * k); ART.text(g, p.txt, x, y, { size: p.size * (1 + Math.max(0, 0.25 - p.t) * 1.2), align: 'center', col: p.col, sw: 4, bold: true }); });
    g.globalAlpha = 1;
    if (FX.banner) {
      var b = FX.banner, k2 = b.t / b.dur, a = Math.min(1, b.t * 4, (1 - k2) * 4);
      g.globalAlpha = Math.max(0, a);
      var gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(20,8,2,0)'); gr.addColorStop(0.5, 'rgba(20,8,2,0.7)'); gr.addColorStop(1, 'rgba(20,8,2,0)');
      g.fillStyle = gr; g.fillRect(0, H * 0.36 - 44, W, b.sub ? 96 : 70);
      ART.text(g, b.txt, W / 2, H * 0.36 + 6, { size: 38, align: 'center', kind: 'title', gold: true, sw: 6, bold: true });
      if (b.sub) ART.text(g, b.sub, W / 2, H * 0.36 + 38, { size: 18, align: 'center', col: '#fff0d0' });
      g.globalAlpha = 1;
    }
  }

  // ---------------- scenes ----------------
  function menuBtnHit(list, x, y) { for (var i = 0; i < list.length; i++) if (!list[i].dim && inB(list[i], x, y)) return list[i]; return null; }
  function drawBtns(list) { list.forEach(function (b) { ART.button(g, b, SC._hot === b); }); }
  function titleBg(t, plate) {
    ART.plate(g, plate || 'title', t * 8, 1, W, H, 0, 1.12);
    ART.haze(g, W, H, [40, 10, 0], 0, 0.6, H * 0.45);
  }

  SC.title = { name: 'title', t: 0,
    enter: function () { this.t = 0; AU.setMusic('title', { raga: 'yaman', lead: 'flute' }); AU.setAmbience('palace'); ART.clearParts(); this.lay(); },
    lay: function () {
      var bw = 230, x = W - bw - 40, y = 150, cont = SAVE.unlocked > 1;
      this.btns = [
        { id: 'play', x: x, y: y, w: bw, h: 50, label: cont ? T('cont') : T('play'), primary: true, size: 22 },
        { id: 'sel', x: x, y: y + 62, w: bw, h: 44, label: T('levels') },
        { id: 'how', x: x, y: y + 116, w: bw, h: 44, label: T('howto') },
        { id: 'snd', x: x, y: y + 170, w: bw, h: 40, label: AU.isMuted() ? T('soundOff') : T('soundOn'), size: 16 },
        { id: 'lang', x: x, y: y + 218, w: bw, h: 40, label: SAVE.lang === 'hi' ? 'भाषा: हिंदी · EN' : 'Language: English · हिं', size: 16 },
        { id: 'vibe', x: x, y: y + 266, w: bw, h: 40, label: SAVE.vibe ? T('vibeOn') : T('vibeOff'), size: 16 }];
    },
    update: function (dt) { this.t += dt; ART.weather('petals', dt, W, H, 0); if (Math.random() < dt * 8) ART.spawn('ember', Math.random() * W, H + 5, { screen: true, ang: -1.57, spread: 0.5, speed: 50, life: 4, r: 1.6, col: '#ffc070' }); if (IN.confirmP()) this.go('play'); },
    go: function (id) {
      AU.sfx('click');
      if (id === 'play') { var n = Math.min(SAVE.unlocked, 8); setScene(SC.card, n - 1); }
      else if (id === 'sel') setScene(SC.select);
      else if (id === 'how') setScene(SC.howto);
      else if (id === 'snd') { AU.setMuted(!AU.isMuted()); SAVE.mute = AU.isMuted(); persist(); }
      else if (id === 'lang') { SAVE.lang = SAVE.lang === 'hi' ? 'en' : 'hi'; persist(); checkRotate(); }
      else if (id === 'vibe') { SAVE.vibe = !SAVE.vibe; persist(); vibe(30); }
      this.lay();
    },
    down: function (p) { var b = menuBtnHit(this.btns, p.x, p.y); if (b) this.go(b.id); },
    draw: function () {
      var t = this.t;
      titleBg(t);
      // key art trio rises from the bottom-left
      var ks = Math.min(0.98, (H * 0.9) / SPR.size('key', 'trio').h || 1);
      ART.glow(g, W * 0.36, H * 0.6, 340, 'rgba(255,170,80,0.28)');
      SPR.draw(g, 'key', 'trio', W * 0.36, H + 8 + Math.max(0, 1 - t * 1.4) * 60, { s: ks, cx: true, alpha: Math.min(1, t * 1.5) });
      ART.haze(g, W, H, [20, 6, 0], 0, 0.55, H * 0.75);
      ART.drawParts(g, 0, true);
      // logo
      var lx = W - 155, ly = 70, pulse = 1 + Math.sin(t * 1.6) * 0.01;
      g.save(); g.translate(lx, ly); g.scale(pulse, pulse);
      ART.text(g, 'RAMAYANA', 0, 0, { size: 46, align: 'center', kind: 'title', gold: true, sw: 7, bold: true, glow: 'rgba(255,190,80,0.6)', glowR: 22 });
      ART.text(g, (SAVE.lang === 'hi' ? 'रामायण · ' : '') + T('subtitle'), 0, 34, { size: 20, align: 'center', col: '#ffe9c0', sw: 4 });
      g.restore();
      drawBtns(this.btns);
      // credit
      var lg = ART.img.logo; if (lg && lg.width) { var lh = 30, lw = lg.width * lh / lg.height; g.drawImage(lg, 16, H - lh - 12, lw, lh); }
      ART.text(g, T('credit'), (lg && lg.width ? 16 + 30 * lg.width / lg.height + 10 : 16), H - 20, { size: 14, col: '#ffe9c0', sw: 3 });
    }
  };

  SC.howto = { name: 'howto',
    enter: function () { this.btn = { x: W / 2 - 90, y: H - 70, w: 180, h: 46, label: T('back'), primary: true }; },
    update: function () { if (IN.confirmP()) setScene(SC.title); },
    down: function (p) { if (inB(this.btn, p.x, p.y)) { AU.sfx('click'); setScene(SC.title); } },
    draw: function () {
      titleBg(G.t, 'bg2'); ART.panel(g, 40, 30, W - 80, H - 120, { r: 20 });
      ART.text(g, T('howto'), W / 2, 72, { size: 30, align: 'center', kind: 'title', gold: true, bold: true });
      var hi = SAVE.lang === 'hi', c1 = 80, c2 = W / 2 + 10, y = 110;
      var kb = hi ? [['चलना', '← → / A D'], ['कूदना (दबाए = ऊँचा, दोबारा = दोहरी)', 'Space / ↑ / W'], ['फिसलना / झुकना', '↓ / S'], ['वार / बाण (2 टैप भारी, 3 = विशेष)', 'J / K / X'], ['रोकना (अखाड़ा)', 'Shift / L'], ['भाई बदलो (स्तर 8)', 'Q / Tab / E'], ['बात / आगे', 'Enter'], ['विराम · ध्वनि', 'P / Esc · M']]
        : [['Move', '← → / A D'], ['Jump (hold = higher, again = double)', 'Space / ↑ / W'], ['Slide / crouch', '↓ / S'], ['Strike / shoot (2 taps heavy, 3 = special)', 'J / K / X'], ['Block (arena)', 'Shift / L'], ['Switch brother (Level 8)', 'Q / Tab / E'], ['Talk / continue', 'Enter'], ['Pause · Sound', 'P / Esc · M']];
      var tc = hi ? ['प्लेटफ़ॉर्मर: ◀ ▶ बटन, JUMP, ⚔/➶, ▼', 'दौड़: बायाँ भाग = कूदो, दायाँ = वार, नीचे स्वाइप = फिसलो', 'अखाड़ा: BLOCK बटन भी', 'ध्यान / धनुर्विद्या: बायाँ भाग दबाए रखो, दायाँ टैप करो', 'कथा: चमकते पात्र को टैप करो']
        : ['Platformer: ◀ ▶ buttons, JUMP, ⚔/➶, ▼', 'Runner: left half = jump, right half = strike, swipe down = slide', 'Arena: adds a BLOCK button', 'Focus / meditation: hold the left side, tap the right side', 'Story: tap the glowing speaker'];
      ART.text(g, hi ? 'कीबोर्ड' : 'Keyboard', c1, y, { size: 19, gold: true }); ART.text(g, hi ? 'स्पर्श (मोबाइल, आड़ा)' : 'Touch (phone, landscape)', c2, y, { size: 19, gold: true });
      kb.forEach(function (r, i) { ART.text(g, r[0], c1, y + 30 + i * 30, { size: 15 }); ART.text(g, r[1], c2 - 30, y + 30 + i * 30, { size: 15, align: 'right', col: '#ffd27a' }); });
      tc.forEach(function (r, i) { var ls = ART.wrap(g, '• ' + r, W - c2 - 70, 15); ls.forEach(function (l, k) { ART.text(g, l, c2, y + 30 + i * 46 + k * 19, { size: 15 }); }); });
      ART.text(g, hi ? 'कमल-पंखुड़ियाँ = जीवन। साफ़ वार से विशेष-मीटर भरता है।' : 'Lotus petals = your strength. Clean hits fill the special meter.', W / 2, H - 92, { size: 15, align: 'center', col: '#ffe9c0' });
      ART.button(g, this.btn);
    }
  };

  SC.select = { name: 'select',
    enter: function () { this.lay(); this.t = 0; AU.setMusic('title', { raga: 'yaman', lead: 'flute' }); },
    lay: function () {
      var cols = 5, gap = 14, cw = Math.floor((W - 60 - gap * (cols - 1)) / cols), ch = 178, x0 = 30, y0 = 92;
      this.cards = [];
      for (var i = 0; i < 8; i++) { var c = i % cols, r = Math.floor(i / cols); this.cards.push({ i: i, x: x0 + c * (cw + gap), y: y0 + r * (ch + gap), w: cw, h: ch }); }
      this.cards.push({ i: 8, more: true, x: x0 + 3 * (cw + gap), y: y0 + ch + gap, w: cw * 2 + gap, h: ch });
      this.back = { x: 30, y: H - 62, w: 150, h: 44, label: T('back') };
    },
    update: function (dt) { this.t += dt; if (IN.confirmP()) setScene(SC.title); },
    down: function (p) {
      if (inB(this.back, p.x, p.y)) { AU.sfx('click'); setScene(SC.title); return; }
      for (var i = 0; i < this.cards.length; i++) { var c = this.cards[i]; if (inB(c, p.x, p.y)) { if (c.more) { AU.sfx('click'); setScene(SC.goes); } else if (c.i < SAVE.unlocked) { AU.sfx('click'); setScene(SC.card, c.i); } else { AU.sfx('miss'); } return; } }
    },
    draw: function () {
      titleBg(this.t, 'bg2'); g.fillStyle = 'rgba(15,6,2,0.45)'; g.fillRect(0, 0, W, H);
      ART.text(g, T('chron'), W / 2, 58, { size: 32, align: 'center', kind: 'title', gold: true, bold: true });
      var self = this;
      this.cards.forEach(function (c, k) {
        var pop = Math.min(1, Math.max(0, self.t * 4 - k * 0.25)), yy = c.y + (1 - pop) * 30;
        g.globalAlpha = pop;
        g.save(); ART.rr(g, c.x, yy, c.w, c.h, 14); g.clip();
        if (c.more) { ART.plate(g, 'bg7', 0, 0, c.w, c.h * 2.2, 0, 1); g.fillStyle = 'rgba(20,8,30,0.55)'; g.fillRect(c.x, yy, c.w, c.h); }
        else { var im = ART.img['bg' + (c.i + 1)]; if (im && im.width) { var s = Math.max(c.w / im.width, c.h / im.height) * 1.15; g.drawImage(im, c.x + c.w / 2 - im.width * s / 2, yy + c.h / 2 - im.height * s / 2, im.width * s, im.height * s); } }
        var gr = g.createLinearGradient(0, yy, 0, yy + c.h); gr.addColorStop(0.35, 'rgba(10,4,0,0)'); gr.addColorStop(1, 'rgba(10,4,0,0.85)'); g.fillStyle = gr; g.fillRect(c.x, yy, c.w, c.h);
        if (!c.more) { var L = LEVELS[c.i], hs = { dash: 'dash', rama: 'rama', sita: 'sita', ascetic: 'ascetic' }[L.hero]; SPR.draw(g, hs, hs === 'ascetic' ? 'calm' : 'idle', c.x + c.w * 0.72, yy + c.h + 6, { s: 0.42, face: -1 }); }
        g.restore();
        ART.rr(g, c.x, yy, c.w, c.h, 14); g.lineWidth = 2.5; g.strokeStyle = c.more ? '#b49aff' : '#e8b85a'; g.stroke();
        if (c.more) { ART.text(g, '9 – 30', c.x + c.w / 2, yy + 70, { size: 34, align: 'center', kind: 'title', gold: true, bold: true }); ART.text(g, T('goesOn') + ' →', c.x + c.w / 2, yy + 108, { size: 18, align: 'center' }); ART.text(g, T('soon'), c.x + c.w / 2, yy + 136, { size: 14, align: 'center', col: '#d8c8ff' }); }
        else {
          var L2 = LEVELS[c.i], locked = c.i >= SAVE.unlocked, best = SAVE.best[L2.n];
          ART.text(g, String(L2.n), c.x + 14, yy + 36, { size: 30, kind: 'title', gold: true, bold: true });
          var ls = ART.wrap(g, tr(L2.title), c.w - 20, 15); ls.slice(0, 3).forEach(function (l, j) { ART.text(g, l, c.x + 10, yy + c.h - 52 - (Math.min(3, ls.length) - 1 - j) * 18, { size: 15 }); });
          ART.text(g, tr(L2.mode), c.x + 10, yy + c.h - 30, { size: 12, col: '#ffd8a0' });
          for (var s = 0; s < 3; s++) ART.starIcon(g, c.x + 16 + s * 22, yy + c.h - 12, 8, best && best.stars > s);
          if (locked) { g.fillStyle = 'rgba(0,0,0,0.6)'; ART.rr(g, c.x, yy, c.w, c.h, 14); g.fill(); ART.text(g, '🔒', c.x + c.w / 2, yy + c.h / 2 + 8, { size: 34, align: 'center' }); }
        }
        g.globalAlpha = 1;
      });
      ART.button(g, this.back);
    }
  };

  SC.goes = { name: 'goes',
    enter: function () { this.btn = { x: W / 2 - 100, y: H - 64, w: 200, h: 46, label: T('back'), primary: true }; this.t = 0; },
    update: function (dt) { this.t += dt; if (IN.confirmP()) setScene(SC.select); },
    down: function (p) { if (inB(this.btn, p.x, p.y)) { AU.sfx('click'); setScene(SC.select); } },
    draw: function () {
      titleBg(this.t, 'bg7'); ART.panel(g, 30, 24, W - 60, H - 100, { r: 20 });
      ART.text(g, T('goesOn'), W / 2, 64, { size: 30, align: 'center', kind: 'title', gold: true, bold: true });
      var ls = ART.wrap(g, T('storyCard'), W - 140, 16); ls.forEach(function (l, i) { ART.text(g, l, W / 2, 94 + i * 21, { size: 16, align: 'center', col: '#ffe9c0' }); });
      var cols = 3, cw = (W - 100) / cols, y0 = 108 + ls.length * 21, rows = Math.ceil(LATER.length / cols);
      LATER.forEach(function (e, i) { var c = Math.floor(i / rows), r = i % rows; ART.text(g, e[0] + '. ' + tr(e[1]), 60 + c * cw, y0 + r * 21, { size: 14 }); ART.text(g, tr(e[2]), 60 + c * cw + cw - 20, y0 + r * 21, { size: 11, align: 'right', col: '#c8b0ff' }); });
      ART.button(g, this.btn);
    }
  };

  SC.card = { name: 'card',
    enter: function (li) { this.li = li; this.t = 0; var L = LEVELS[li]; this.btn = { x: W - 250, y: H - 80, w: 210, h: 52, label: T('begin'), primary: true, size: 22 }; this.back = { x: 40, y: H - 76, w: 140, h: 44, label: T('back') }; AU.setMusic('calm', { raga: L.music.raga, lead: L.music.lead }); },
    update: function (dt) { this.t += dt; if (IN.confirmP() || IN.jumpP()) this.go(); },
    go: function () { AU.sfx('level'); startLevel(this.li, 0); setScene(SC.play); },
    down: function (p) { if (inB(this.btn, p.x, p.y)) this.go(); else if (inB(this.back, p.x, p.y)) { AU.sfx('click'); setScene(SC.select); } },
    draw: function () {
      var L = LEVELS[this.li], t = this.t;
      ART.plate(g, 'bg' + L.n, t * 10, 1, W, H, 0, 1.12);
      var gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(15,6,2,0.88)'); gr.addColorStop(0.62, 'rgba(15,6,2,0.55)'); gr.addColorStop(1, 'rgba(15,6,2,0.1)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      var hs = { dash: 'dash', rama: 'rama', sita: 'sita', ascetic: 'ascetic' }[L.hero], k = Math.min(1, t * 2);
      ART.glow(g, W * 0.8, H * 0.62, 240, 'rgba(255,190,100,0.35)');
      SPR.draw(g, hs, hs === 'ascetic' ? 'calm' : 'idle', W * 0.8 + (1 - k) * 80, H - 10, { s: hs === 'ascetic' ? 1.15 : 1.4, face: -1, alpha: k });
      if (L.n === 8) SPR.draw(g, 'lak', 'idle', W * 0.66 + (1 - k) * 80, H - 10, { s: 1.4, face: 1, alpha: k * 0.95 });
      var x = 50, y = 70;
      ART.text(g, (SAVE.lang === 'hi' ? 'स्तर ' : 'Level ') + L.n + '  ·  ' + tr(L.mode), x, y, { size: 18, col: '#ffd8a0' });
      var tl = ART.wrap(g, tr(L.title), W * 0.55, 36, 'title'); tl.forEach(function (l, i) { ART.text(g, l, x, y + 44 + i * 42, { size: 36, kind: 'title', gold: true, bold: true, sw: 6 }); });
      y += 54 + tl.length * 42;
      ART.wrap(g, tr(L.intro), W * 0.52, 18).forEach(function (l, i) { ART.text(g, l, x, y + i * 25, { size: 18, col: '#fff2dc' }); });
      y += 100;
      ART.text(g, T('rules'), x, y, { size: 17, gold: true });
      var best = SAVE.best[L.n];
      L.stars.forEach(function (s, i) { for (var j = 0; j <= i; j++) ART.starIcon(g, x + 12 + j * 20, y + 26 + i * 28, 8, best && best.stars > i); ART.text(g, tr(s), x + 76, y + 32 + i * 28, { size: 16 }); });
      if (best) ART.text(g, T('best') + ': ' + best.score, x, y + 116, { size: 15, col: '#ffe27a' });
      ART.button(g, this.btn); ART.button(g, this.back);
    }
  };

  SC.play = { name: 'play',
    update: function (dt) {
      var m = G.mode; if (!m) return;
      G.segT += dt; G.levelT += dt;
      if (DEMO && m.ai) { AIC = AIC || {}; AIC.mx = 0; AIC.downP = false; m.ai(AIC); } else AIC = null;
      m.update(dt);
      var seg = G.L.segs[G.si];
      if (G.L.dayTime && (seg.type === 'archery' || seg.type === 'platform')) { G.day -= dt; if (G.day <= 0) { if (DEMO) G.day = 5; else m.fail = T('sunset'); } }
      if (G.tipT > 0) G.tipT -= dt;
      if (seg.type !== 'story' && seg.type !== 'meditate' && seg.type !== 'archery') ART.weather(theme(seg.theme).weather, dt, W, H, seg.type === 'archery' ? -200 : 0);
      else if (seg.type === 'archery') ART.weather('leaves', dt, W, H, -200 * (seg.wind || 0));
      else if (seg.type === 'meditate') ART.weather('stars', dt, W, H, 0);
      if (m.fail) { G.failMsg = m.fail; AU.sfx('over'); AU.setMusic('off'); setScene(SC.over); return; }
      if (m.restart) { var nm = m.restartSeg ? m.restartSeg() : makeMode(seg); ART.clearParts(); G.mode = nm; G.pips = Math.max(G.pips, 1); return; }
      if (m.done) nextSeg();
    },
    key: function (a) { if (a === 'pause') setScene(SC.pause); if (a === 'mute') { AU.setMuted(!AU.isMuted()); SAVE.mute = AU.isMuted(); persist(); } },
    down: function (p) {
      layoutHud();
      if (inB(HUDB.pause, p.x, p.y)) { setScene(SC.pause); return; }
      if (inB(HUDB.sound, p.x, p.y)) { AU.setMuted(!AU.isMuted()); SAVE.mute = AU.isMuted(); persist(); return; }
      var m = G.mode;
      if (m.kind === 'story') { m.tap(p.x, p.y); return; }
      if (m.tap && m.tap(p.x, p.y)) return;
      var L = touchLayout();
      for (var i = 0; i < L.length; i++) {
        var b = L[i], hit = b.zone ? (b.zone === 'left' ? p.x < W / 2 : p.x >= W / 2) && p.y > 110 : Math.hypot(p.x - b.x, p.y - b.y) < b.r * 1.25;
        if (hit) { p.act = b.act; press(b.act); if (b.act === 'jump') press('hold'); if (b.act === 'tap') press('atk'); if (b.act === 'hold') { /* held */ } vibe(8); return; }
      }
      if (m.kind === 'platform' && !TOUCH) { /* mouse click on world: nothing */ }
    },
    move: function (p) {
      if (!p.act || (p.act !== 'left' && p.act !== 'right')) return;
      var want = p.x < 140 ? 'left' : p.x < 300 ? 'right' : null;
      if (want && want !== p.act) { rel(p.act); p.act = want; press(want); }
    },
    up: function (p) { if (p.act) { rel(p.act); if (p.act === 'jump') rel('hold'); } },
    draw: function () {
      if (!G.mode) return;
      G.mode.draw();
      ART.drawParts(g, G.cam, true);
      drawPops(G.mode.kind === 'arena' || G.mode.kind === 'archery' || G.mode.kind === 'meditate' || G.mode.kind === 'beat' ? 0 : G.cam);
      if (G.mode.kind !== 'story') hudTop(); else { layoutHud(); ART.panel(g, HUDB.pause.x, HUDB.pause.y, 46, 46, { r: 23, plain: true }); ART.iconPause(g, HUDB.pause.x + 23, HUDB.pause.y + 23, 22); if (G.tip && G.tipT > 0) hudTop.call(null); }
      drawTouch();
    }
  };

  SC.pause = { name: 'pause',
    enter: function () { AU.duck(0.65, 600, 0.2); this.lay(); },
    leave: function () { AU.duck(0, 0, 0.15); },
    lay: function () { var bw = 260, x = W / 2 - bw / 2, y = 150; this.btns = [
      { id: 'res', x: x, y: y, w: bw, h: 48, label: T('resume'), primary: true },
      { id: 'rst', x: x, y: y + 58, w: bw, h: 44, label: T('restart') },
      { id: 'sel', x: x, y: y + 112, w: bw, h: 44, label: T('levels') },
      { id: 'snd', x: x, y: y + 166, w: bw / 2 - 5, h: 40, label: AU.isMuted() ? '🔇' : '🔊', size: 18 },
      { id: 'lang', x: x + bw / 2 + 5, y: y + 166, w: bw / 2 - 5, h: 40, label: SAVE.lang === 'hi' ? 'EN' : 'हिंदी', size: 17 }]; },
    update: function () { if (IN.confirmP()) setScene(SC.play); },
    key: function (a) { if (a === 'pause') setScene(SC.play); },
    down: function (p) {
      var b = menuBtnHit(this.btns, p.x, p.y); if (!b) return; AU.sfx('click');
      if (b.id === 'res') setScene(SC.play);
      else if (b.id === 'rst') { G.pips = Math.max(3, G.segPips || 3); startSeg(G.si); setScene(SC.play); }
      else if (b.id === 'sel') { AU.setMusic('off'); setScene(SC.select); }
      else if (b.id === 'snd') { AU.setMuted(!AU.isMuted()); SAVE.mute = AU.isMuted(); persist(); this.lay(); }
      else if (b.id === 'lang') { SAVE.lang = SAVE.lang === 'hi' ? 'en' : 'hi'; persist(); this.lay(); }
    },
    draw: function () {
      SC.play.draw(); g.fillStyle = 'rgba(10,4,0,0.6)'; g.fillRect(0, 0, W, H);
      ART.panel(g, W / 2 - 170, 70, 340, 360, { r: 22 });
      ART.text(g, T('paused'), W / 2, 122, { size: 34, align: 'center', kind: 'title', gold: true, bold: true });
      drawBtns(this.btns);
    }
  };

  SC.over = { name: 'over',
    enter: function () { this.t = 0; this.btns = [{ id: 'retry', x: W / 2 - 220, y: 330, w: 210, h: 50, label: T('retry'), primary: true }, { id: 'sel', x: W / 2 + 10, y: 330, w: 210, h: 50, label: T('levels') }]; },
    update: function (dt) { this.t += dt; if (IN.confirmP()) this.go('retry'); },
    go: function (id) { AU.sfx('click'); if (id === 'retry') { G.pips = 3; G.meter = 0; if (G.L.focusLives && G.focusLives <= 0) G.focusLives = G.L.focusLives; if (G.L.dayTime && G.day <= 0) G.day = G.L.dayTime * 0.6; if (G.L.n === 7) G.stats.breaks = 0; startSeg(G.si); setScene(SC.play); } else setScene(SC.select); },
    down: function (p) { var b = menuBtnHit(this.btns, p.x, p.y); if (b) this.go(b.id); },
    draw: function () {
      if (G.mode) G.mode.draw(); g.fillStyle = 'rgba(20,4,0,' + Math.min(0.7, this.t * 2) + ')'; g.fillRect(0, 0, W, H);
      ART.text(g, T('over'), W / 2, 200, { size: 52, align: 'center', kind: 'title', gold: true, bold: true, sw: 7 });
      ART.text(g, G.failMsg || '', W / 2, 250, { size: 22, align: 'center', col: '#ffd8c0' });
      ART.text(g, SAVE.lang === 'hi' ? 'धर्म का मार्ग धैर्य माँगता है।' : 'The path of dharma asks for patience.', W / 2, 286, { size: 16, align: 'center', col: '#e8c8a0' });
      drawBtns(this.btns);
    }
  };

  SC.complete = { name: 'complete',
    enter: function () {
      this.t = 0; var last = G.L.n >= 8;
      this.btns = [{ id: 'next', x: W - 270, y: H - 82, w: 230, h: 52, label: last ? T('goesOn') : T('next'), primary: true, size: 20 },
        { id: 'retry', x: W - 270, y: H - 140, w: 110, h: 44, label: T('retry'), size: 16 }, { id: 'sel', x: W - 150, y: H - 140, w: 110, h: 44, label: T('levels'), size: 16 }];
      ART.clearParts();
    },
    update: function (dt) { this.t += dt; if (Math.random() < dt * 30) ART.spawn('petal', Math.random() * W, -10, { screen: true, ang: 1.7, spread: 0.6, speed: 80, life: 6, r: 4, col: ['#ffd27a', '#ffb6c8', '#fff'][Math.floor(Math.random() * 3)] }); if (IN.confirmP()) this.go('next'); },
    go: function (id) { AU.sfx('click'); if (id === 'next') { if (G.L.n >= 8) setScene(SC.goes); else setScene(SC.card, G.li + 1); } else if (id === 'retry') setScene(SC.card, G.li); else setScene(SC.select); },
    down: function (p) { var b = menuBtnHit(this.btns, p.x, p.y); if (b) this.go(b.id); },
    draw: function () {
      var L = G.L, R = G.result, t = this.t;
      ART.plate(g, 'bg' + L.n, t * 12, 1, W, H, 0, 1.12);
      var gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(15,6,2,0.85)'); gr.addColorStop(0.6, 'rgba(15,6,2,0.5)'); gr.addColorStop(1, 'rgba(15,6,2,0.15)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      var hs = { dash: 'dash', rama: 'rama', sita: 'sita', ascetic: 'ascetic' }[L.hero], vfr = { dash: 'special', rama: 'shoot', sita: 'focus', ascetic: 'aura' }[hs];
      ART.glow(g, W * 0.76, H * 0.6, 260, 'rgba(255,200,110,0.45)');
      SPR.draw(g, hs, vfr, W * 0.76, H - 10, { s: hs === 'ascetic' ? 1.1 : 1.35, face: -1, alpha: Math.min(1, t * 2) });
      ART.drawParts(g, 0, true);
      ART.text(g, T('complete'), 50, 80, { size: 40, kind: 'title', gold: true, bold: true, sw: 6 });
      ART.text(g, (SAVE.lang === 'hi' ? 'स्तर ' : 'Level ') + L.n + ' · ' + tr(L.title), 50, 114, { size: 19, col: '#ffe9c0' });
      for (var i = 0; i < 3; i++) { var k = clamp((t - 0.4 - i * 0.35) * 3, 0, 1), on = R.stars > i; var r = 30 * (on ? (1 + (1 - k) * 0.8) : 1); g.globalAlpha = on ? k : 0.9; ART.starIcon(g, 86 + i * 74, 172, r, on); g.globalAlpha = 1; if (on && k > 0 && k < 0.2 && !this['s' + i]) { this['s' + i] = 1; AU.sfx('pickup'); ART.spawn('star', 86 + i * 74, 172, { n: 10, speed: 200, life: 0.8, r: 6, col: 'rgba(255,230,150,1)', screen: true }); } }
      var y = 232;
      L.stars.forEach(function (s, j) { var ok = j === 0 || (j === 1 ? R.s2 : R.s3); ART.text(g, (ok ? '✓ ' : '✗ ') + tr(s), 54, y + j * 26, { size: 16, col: ok ? '#bfffc0' : '#ffb0a0' }); });
      var st = G.stats, rows = [];
      var show = { standards: 'War-standards', lotus: 'Hidden lotus', falls: 'Falls', hits: 'Hits taken', perfect: 'Perfect shots', sparHits: 'Spar hits taken', smash: 'Smashed / cleared', drillRetries: 'Drill retries', wild: 'Wild shots', trueShots: 'True shots', breaks: 'Focus breaks', minSteady: 'Lowest steadiness', together: 'Together hits' };
      [L.star2.stat, L.star3.stat].forEach(function (k2) { rows.push((SAVE.lang === 'hi' ? k2 : show[k2]) + ': ' + st[k2]); });
      ART.text(g, rows.join('    '), 54, y + 92, { size: 15, col: '#ffe0b0' });
      ART.text(g, T('score') + ': ' + R.score + (R.newBest ? '   ★ ' + T('best') + '!' : '   (' + T('best') + ' ' + R.best.score + ')'), 54, y + 126, { size: 22, gold: true });
      drawBtns(this.btns);
      var lg = ART.img.logo; if (lg && lg.width) g.drawImage(lg, 16, H - 40, lg.width * 28 / lg.height, 28);
      ART.text(g, T('credit'), (lg && lg.width ? 16 + 28 * lg.width / lg.height + 10 : 16), H - 20, { size: 13, col: '#ffe9c0' });
    }
  };

  // ---------------- main loop ----------------
  var last = 0, started = false, MANUAL = false;
  function step(dt) {
    G.t += dt;
    if (FX.hitstop > 0) { FX.hitstop -= dt; ART.updateParts(dt * 0.2); return; }
    var sdt = dt; if (FX.slow > 0) { FX.slow -= dt; sdt = dt * 0.35; }
    if (G.scene && G.scene.update) G.scene.update(sdt);
    ART.updateParts(sdt);
    FX.shake = Math.max(0, FX.shake - dt * 40); FX.flash = Math.max(0, FX.flash - dt * 2.2); FX.fade = Math.max(0, FX.fade - dt * 2.5);
    for (var i = FX.pops.length - 1; i >= 0; i--) { FX.pops[i].t += dt; if (FX.pops[i].t > 1.1) FX.pops.splice(i, 1); }
    if (FX.banner) { FX.banner.t += dt; if (FX.banner.t > FX.banner.dur) FX.banner = null; }
    AU.update(dt);
  }
  function render() {
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, cv.width, cv.height);
    var sx = FX.shake > 0 ? (Math.random() - 0.5) * FX.shake * 2 : 0, sy = FX.shake > 0 ? (Math.random() - 0.5) * FX.shake * 2 : 0;
    g.setTransform(DPR * VS, 0, 0, DPR * VS, DPR * (OX + sx * VS), DPR * (OY + sy * VS));
    g.save(); g.beginPath(); g.rect(0, 0, W, H); g.clip();
    if (G.scene && G.scene.draw) G.scene.draw();
    if (FX.flash > 0) { g.fillStyle = 'rgba(' + FX.flashCol + ',' + Math.min(0.8, FX.flash) + ')'; g.fillRect(0, 0, W, H); }
    if (FX.fade > 0) { g.fillStyle = 'rgba(0,0,0,' + FX.fade + ')'; g.fillRect(0, 0, W, H); }
    if (G.scene !== SC.play && G.scene !== SC.pause && G.scene !== SC.complete) drawPops(0);
    g.restore();
  }
  function frame(ts) {
    requestAnimationFrame(frame);
    var dt = CAPTURE ? 1 / 60 : Math.min(0.05, Math.max(0, (ts - last) / 1000)); last = ts;
    if (!started || MANUAL) return;
    if (dt > 1 / 45) { step(dt / 2); step(dt / 2); } else step(dt);
    render();
  }

  // ---------------- boot + hooks ----------------
  window.__rpd = {
    startLevel: function (n, si) { AU.init(); startLevel(n - 1, si || 0); setScene(SC.play); return true; },
    toTitle: function () { setScene(SC.title); },
    state: function () { var m = G.mode; return { scene: G.scene && G.scene.name, level: G.L && G.L.n, seg: G.si, segType: G.L && G.L.segs[G.si] && G.L.segs[G.si].type, segs: G.L && G.L.segs.length, pips: G.pips, score: Math.round(G.score), stats: G.stats, result: G.result || null, fail: G.failMsg || null, hero: m && m.hero && m.hero.x != null ? { x: Math.round(m.hero.x), y: Math.round(m.hero.y) } : null, demo: DEMO, W: W, unlocked: SAVE.unlocked, segLog: G.segLog, day: G.day, focusLives: G.focusLives, levelT: G.levelT, ai: m && m.aiObj ? JSON.stringify(m.aiObj) : null, tleft: m && m.targets ? m.targets.filter(function (t) { return !t.dead; }).map(function (t) { return Math.round(t.x) + ',' + Math.round(t.y); }).join(' ') : null, flags: m && m.flags ? JSON.stringify(m.flags) : null, hitLog: m && m.hitLog ? m.hitLog.join(' ') : null }; },
    advance: function (sec) { var n = Math.round(sec * 60), s0 = G.scene; for (var i = 0; i < n; i++) { step(1 / 60); if (G.scene !== s0) break; } render(); return this.state(); },
    press: function (a) { press(a); if (a === 'jump') press('hold'); if (a === 'atk' || a === 'confirm') press('tap'); if (G.scene && G.scene.key) G.scene.key(a); },
    release: function (a) { rel(a); if (a === 'jump') rel('hold'); },
    tap: function (x, y) { var p = { id: 99, x: x, y: y, sx: x, sy: y }; if (G.scene && G.scene.down) G.scene.down(p); if (G.scene && G.scene.up) G.scene.up(p); },
    setDemo: function (v) { DEMO = !!v; AIC = null; },
    scene: function (name, arg) { if (SC[name]) setScene(SC[name], arg); },
    stats: function () { return G.stats; },
    save: function () { return JSON.parse(JSON.stringify(SAVE)); },
    resetSave: function () { SAVE.unlocked = 1; SAVE.best = {}; persist(); },
    measure: function (names) { return AU.measureSfx(names); },
    render: render,
    freeze: function (v) { MANUAL = !!v; }
  };
  resize();
  ART.load(function () {
    SPR.load(function () {
      started = true;
      var lv = parseInt(Q.get('level'), 10);
      if (lv >= 1 && lv <= 8) { if (DEMO) { startLevel(lv - 1, parseInt(Q.get('seg'), 10) || 0); setScene(SC.play); } else setScene(SC.card, lv - 1); }
      else setScene(SC.title);
      window.__rpdReady = true;
    });
  });
  requestAnimationFrame(frame);
})();
