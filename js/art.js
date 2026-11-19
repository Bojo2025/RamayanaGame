// RAMAYANA: PATH OF DHARMA - procedural drawing: painted-plate parallax, textured ground, scenery layers,
// particles, weather, lighting / glow / vignette, UI widgets, and vector fallbacks if a sprite fails.
(function () {
  'use strict';
  var R = { img: {}, pat: {}, ready: false };
  var AS = window.RPD_ASSETS || {}, SP = function () { return window.RPDSprites; };
  var DEV = '"Noto Sans Devanagari","Kohinoor Devanagari","Mangal","Nirmala UI",sans-serif';
  R.font = function (size, kind, bold) {
    var fam = kind === 'title' ? 'RPDTitle,"Cinzel Decorative",Georgia,serif' : 'RPDUi,Marcellus,Georgia,serif';
    return (bold ? 'bold ' : '') + Math.round(size) + 'px ' + fam + ',' + DEV;
  };
  R.load = function (done) {
    var keys = Object.keys(AS).filter(function (k) { return AS[k].indexOf('data:image') === 0; }), left = keys.length + 1;
    function fin() { if (--left <= 0) { R.ready = true; done && done(); } }
    keys.forEach(function (k) { var im = new Image(); im.onload = fin; im.onerror = fin; im.src = AS[k]; R.img[k] = im; });
    try {
      var fs = [];
      if (AS.font_title && window.FontFace) fs.push(new FontFace('RPDTitle', 'url(' + AS.font_title + ')'));
      if (AS.font_ui && window.FontFace) fs.push(new FontFace('RPDUi', 'url(' + AS.font_ui + ')'));
      Promise.all(fs.map(function (f) { return f.load().then(function (ff) { document.fonts.add(ff); }); })).then(fin, fin);
    } catch (e) { fin(); }
  };
  R.loadExtra = function (done) {
    var extra = window.RPD_ASSETS2 || {};
    var keys = Object.keys(extra).filter(function (k) { return typeof extra[k] === 'string' && extra[k].indexOf('data:image') === 0; });
    if (!keys.length) { done && done(); return; }
    var left = keys.length;
    keys.forEach(function (k) {
      var im = new Image();
      function fin() { if (--left <= 0 && done) done(); }
      im.onload = fin; im.onerror = fin; im.src = extra[k]; R.img[k] = im;
    });
  };
  R.pattern = function (g, name) {
    if (R.pat[name]) return R.pat[name];
    var im = R.img[name]; if (!im || !im.width) return null;
    R.pat[name] = g.createPattern(im, 'repeat'); return R.pat[name];
  };

  // ---------- themes (one per locale) ----------
  R.THEMES = {
    ash: { plate: 'bg1', tex: 'texAsh', top: '#2b2220', lip: '#6b4a3a', lipHi: '#c0794a', grade: 'rgba(120,40,20,0.10)', haze: [90, 40, 40], weather: 'embers', mid: ['deadtree', 'arch', 'deadtree', 'boulders'], midTint: 'rgba(40,18,22,0.45)', amb: 'battle', fg: 'ash', grassCol: null },
    palace: { plate: 'bg2', tex: 'texPalace', top: '#e8dcc0', lip: '#b89c6a', lipHi: '#fff4d8', grade: 'rgba(255,230,180,0.05)', haze: [250, 240, 220], weather: 'petals', mid: ['banyan', 'ashoka', 'banana'], midTint: 'rgba(230,236,240,0.25)', amb: 'palace', fg: 'leaves', grassCol: '#6f9a3a' },
    yard: { plate: 'bg3', tex: 'texEarth', top: '#8a5a3a', lip: '#6e4228', lipHi: '#c48a5a', grade: 'rgba(255,200,150,0.05)', haze: [240, 220, 200], weather: 'petals', mid: ['banana', 'ashoka', 'banana', 'reeds'], midTint: 'rgba(235,230,225,0.22)', amb: 'yard', fg: 'grass', grassCol: '#7a9a3a' },
    rock: { plate: 'bg4', tex: 'texRock', top: '#4a5058', lip: '#2e333a', lipHi: '#9aa6b4', grade: 'rgba(60,80,120,0.12)', haze: [170, 185, 205], weather: 'mist', mid: ['pine', 'boulders', 'pine', 'pine'], midTint: 'rgba(150,165,190,0.40)', amb: 'mountain', fg: 'pine', grassCol: '#4a6a4a' },
    sand: { plate: 'bg5', tex: 'texSand', top: '#c8a060', lip: '#9a7440', lipHi: '#f4d49a', grade: 'rgba(255,190,110,0.08)', haze: [250, 220, 170], weather: 'dust', mid: ['banyan', 'banana', 'reeds'], midTint: 'rgba(245,215,160,0.32)', amb: 'court', fg: 'grass', grassCol: '#8a8a3a' },
    range: { plate: 'bg6', tex: 'texGrass', top: '#5a7a2a', lip: '#3e5a1e', lipHi: '#b4d46a', grade: 'rgba(255,170,90,0.10)', haze: [255, 210, 160], weather: 'leaves', mid: ['ashoka', 'reeds', 'banyan'], midTint: 'rgba(255,200,150,0.30)', amb: 'range', fg: 'grass', grassCol: '#8aa83a' },
    peak: { plate: 'bg7', tex: 'texRock', top: '#2a2a38', lip: '#1c1c28', lipHi: '#7a6a9a', grade: 'rgba(40,30,90,0.12)', haze: [90, 80, 140], weather: 'stars', mid: [], midTint: 'rgba(40,30,80,0.4)', amb: 'peak', fg: null, grassCol: null },
    field: { plate: 'bg8', tex: 'texGrass', top: '#5a8a2a', lip: '#3e6a1e', lipHi: '#c4e47a', grade: 'rgba(255,240,180,0.04)', haze: [235, 245, 255], weather: 'petals', mid: ['banyan', 'ashoka', 'banana', 'reeds'], midTint: 'rgba(225,235,245,0.25)', amb: 'yard', fg: 'grass', grassCol: '#7aa83a' },
    storm: { plate: 'bg9', tex: 'texRock', top: '#2c2a3a', lip: '#1a1a28', lipHi: '#9aa6c4', grade: 'rgba(20,24,60,0.2)', haze: [30, 40, 70], weather: 'rain', mid: [], amb: 'peak', fg: null, grassCol: null },
    brahma: { plate: 'bg10', tex: 'texRock', top: '#3a3454', lip: '#241c38', lipHi: '#f0d48a', grade: 'rgba(255,210,120,0.1)', haze: [255, 214, 150], weather: 'stars', mid: [], amb: 'peak', fg: null, grassCol: null },
    lanka: { plate: 'bg11', tex: 'texAsh', top: '#2a2218', lip: '#140e0a', lipHi: '#d4a85a', grade: 'rgba(90,40,10,0.14)', haze: [70, 40, 16], weather: 'embers', mid: ['lankaTower', 'gardenShrub', 'lankaTower'], midSheet: 'scenery_9_30', amb: 'battle', fg: null, grassCol: null },
    streets: { plate: 'bg11b', tex: 'texAsh', top: '#3a2c1c', lip: '#22160e', lipHi: '#e0b060', grade: 'rgba(70,36,12,0.12)', haze: [90, 55, 24], weather: 'embers', mid: ['lankaTower', 'gardenShrub', 'bamboo'], midSheet: 'scenery_9_30', amb: 'battle', fg: null, grassCol: null },
    tataka: { plate: 'bg12', tex: 'texEarth', top: '#4a4030', lip: '#2a2416', lipHi: '#b0a080', grade: 'rgba(30,40,16,0.14)', haze: [70, 80, 40], weather: 'leaves', mid: ['witheredTree', 'thornBush', 'witheredTree', 'fern'], midSheet: 'scenery_9_30', amb: 'mountain', fg: null, grassCol: '#3e4a28' },
    yagna: { plate: 'bg13', tex: 'texSand', top: '#8a6840', lip: '#5a3c24', lipHi: '#f0d0a0', grade: 'rgba(255,140,50,0.08)', haze: [255, 176, 110], weather: 'embers', mid: ['bamboo', 'mango', 'fern', 'mango'], midSheet: 'scenery_9_30', amb: 'yard', fg: null, grassCol: '#6a8a38' },
    road: { plate: 'bg14', tex: 'texGrass', top: '#5e842c', lip: '#3a5a1c', lipHi: '#d8ec8a', grade: 'rgba(255,220,160,0.06)', haze: [255, 226, 180], weather: 'leaves', mid: ['mango', 'bamboo', 'goldenTree', 'fern'], midSheet: 'scenery_9_30', amb: 'range', fg: null, grassCol: '#78a438' },
    hall: { plate: 'bg15', tex: 'texPalace', top: '#e4d2a4', lip: '#b49258', lipHi: '#fff0c8', grade: 'rgba(255,220,150,0.06)', haze: [255, 230, 190], weather: 'petals', mid: ['goldenTree', 'gardenShrub'], midSheet: 'scenery_9_30', amb: 'court', fg: null, grassCol: null },
    clearing: { plate: 'bg17', tex: 'texGrass', top: '#6a7840', lip: '#3e4a22', lipHi: '#d4e090', grade: 'rgba(255,220,160,0.05)', haze: [230, 220, 180], weather: 'leaves', mid: ['mango', 'fern', 'goldenTree'], midSheet: 'scenery_9_30', amb: 'range', fg: null, grassCol: '#7a9440' },
    chamber: { plate: 'bg18a', tex: 'texPalace', top: '#c4a070', lip: '#8a6840', lipHi: '#f0d8a8', grade: 'rgba(80,20,30,0.08)', haze: [180, 120, 100], weather: null, mid: [], amb: 'palace', fg: null, grassCol: null },
    court: { plate: 'bg18b', tex: 'texPalace', top: '#e6d4ae', lip: '#b89860', lipHi: '#fff2d0', grade: 'rgba(255,210,140,0.06)', haze: [255, 220, 170], weather: 'petals', mid: [], amb: 'court', fg: null, grassCol: null },
    depart: { plate: 'bg19', tex: 'texSand', top: '#c4a060', lip: '#8a6830', lipHi: '#f0d090', grade: 'rgba(255,200,120,0.06)', haze: [255, 210, 150], weather: 'dust', mid: ['mango', 'goldenTree', 'bamboo'], midSheet: 'scenery_9_30', amb: 'palace', fg: null, grassCol: '#8aaa48' }
  };

  // painted plate, mirror-tiled so parallax never shows a seam
  R.plate = function (g, name, camX, par, W, H, yoff, zoom) {
    var im = R.img[name]; if (!im || !im.width) { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3a2a4a'); gr.addColorStop(1, '#c08050'); g.fillStyle = gr; g.fillRect(0, 0, W, H); return; }
    var s = Math.max(H / im.height, W / im.width) * (zoom || 1.08), pw = im.width * s, ph = im.height * s;
    var off = ((camX * par) % (pw * 2) + pw * 2) % (pw * 2), y = (yoff || 0) + (H - ph) * 0.5;
    for (var i = -1; i < 3; i++) {
      var x = i * pw - off; if (x > W || x + pw < 0) continue;
      var k = ((i % 2) + 2) % 2;
      if (k === 1) { g.save(); g.translate(x + pw, y); g.scale(-1, 1); g.drawImage(im, 0, 0, pw, ph); g.restore(); }
      else g.drawImage(im, x, y, pw, ph);
    }
  };
  // a layer of scenery sprites at a parallax factor (deterministic per index)
  R.midLayer = function (g, th, camX, par, W, groundY, scale, tint, seed) {
    var list = th.mid; if (!list || !list.length) return;
    var sp = SP(), spacing = 520, off = camX * par, i0 = Math.floor(off / spacing) - 1;
    for (var i = i0; i < i0 + Math.ceil(W / spacing) + 3; i++) {
      var h = Math.abs(Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;
      if (h < 0.28) continue;
      var nm = list[Math.floor(h * 97) % list.length], x = i * spacing - off + (h * 200 - 100);
      var s = scale * (0.75 + 0.4 * ((h * 7) % 1));
      sp.draw(g, th.midSheet || 'scen', nm, x, groundY + 6, { s: s, cx: true, face: h > 0.6 ? -1 : 1 });
    }
    if (tint) { g.fillStyle = tint; }
  };
  R.haze = function (g, W, H, c, a0, a1, y0) {
    var gr = g.createLinearGradient(0, y0 || 0, 0, H);
    gr.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a0 || 0) + ')');
    gr.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a1 || 0.3) + ')');
    g.fillStyle = gr; g.fillRect(0, y0 || 0, W, H - (y0 || 0));
  };
  // textured ground block with a painted lip (top y, from x0 to x1 in screen space)
  R.groundBlock = function (g, th, x0, x1, ya, yb, H, camX) {
    var pat = R.pattern(g, th.tex), top = Math.min(ya, yb);
    g.save();
    g.beginPath(); g.moveTo(x0, ya); g.lineTo(x1, yb); g.lineTo(x1, H + 10); g.lineTo(x0, H + 10); g.closePath();
    g.clip();
    if (pat) {
      g.fillStyle = th.top; g.fillRect(x0, top, x1 - x0, H - top + 10);
      g.translate(-camX % 256, 0); g.fillStyle = pat; g.globalAlpha = 0.95; g.fillRect(x0 - 256 + (camX % 256), top - 20, x1 - x0 + 512, H - top + 40); g.globalAlpha = 1;
    } else { g.fillStyle = th.top; g.fillRect(x0, top, x1 - x0, H - top + 10); }
    g.restore();
    g.save();
    g.beginPath(); g.moveTo(x0, ya); g.lineTo(x1, yb); g.lineTo(x1, H + 10); g.lineTo(x0, H + 10); g.closePath(); g.clip();
    var sh = g.createLinearGradient(0, top, 0, H); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(0.25, 'rgba(0,0,0,0.12)'); sh.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = sh; g.fillRect(x0, top, x1 - x0, H - top + 10);
    g.restore();
    // lip
    g.save(); g.lineCap = 'round';
    g.strokeStyle = th.lip; g.lineWidth = 9; g.beginPath(); g.moveTo(x0, ya + 3); g.lineTo(x1, yb + 3); g.stroke();
    g.strokeStyle = th.lipHi; g.lineWidth = 2.5; g.globalAlpha = 0.85; g.beginPath(); g.moveTo(x0 + 2, ya - 1); g.lineTo(x1 - 2, yb - 1); g.stroke();
    g.globalAlpha = 1;
    if (th.grassCol) {
      g.strokeStyle = th.grassCol; g.lineWidth = 2;
      for (var x = Math.ceil((x0 + camX) / 14) * 14; x < x1 + camX; x += 14) {
        var sx = x - camX, t = (sx - x0) / Math.max(1, x1 - x0), yy = ya + (yb - ya) * t, hh = 6 + (Math.abs(Math.sin(x * 0.37)) * 9);
        g.beginPath(); g.moveTo(sx, yy + 1); g.quadraticCurveTo(sx + 2, yy - hh * 0.6, sx + 4 + Math.sin(x) * 3, yy - hh); g.stroke();
      }
    }
    g.restore();
  };

  // ---------- particles ----------
  var parts = [];
  R.parts = parts;
  R.spawn = function (type, x, y, o) {
    o = o || {}; if (parts.length > 450) parts.splice(0, 40);
    var n = o.n || 1;
    for (var i = 0; i < n; i++) {
      var a = (o.ang != null ? o.ang : Math.random() * Math.PI * 2) + (Math.random() - 0.5) * (o.spread != null ? o.spread : 6.3);
      var sp = (o.speed || 120) * (0.4 + Math.random() * 0.8);
      parts.push({ type: type, x: x + (Math.random() - 0.5) * (o.jx || 0), y: y + (Math.random() - 0.5) * (o.jy || 0), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: (o.life || 0.6) * (0.7 + Math.random() * 0.6), max: 0, r: (o.r || 4) * (0.6 + Math.random() * 0.8), col: o.col || '#fff', g: o.g != null ? o.g : 0, drag: o.drag || 0, screen: !!o.screen, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 6 });
      parts[parts.length - 1].max = parts[parts.length - 1].life;
    }
  };
  R.updateParts = function (dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.vy += p.g * dt; if (p.drag) { p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.type === 'leaf' || p.type === 'petal') { p.vx += Math.sin(p.life * 3 + p.rot) * 30 * dt; }
    }
  };
  R.clearParts = function () { parts.length = 0; };
  R.drawParts = function (g, camX, screenOnly) {
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i]; if (p.screen !== !!screenOnly) continue;
      var k = p.life / p.max, x = p.screen ? p.x : p.x - camX, y = p.y;
      g.globalAlpha = Math.min(1, k * 1.6);
      switch (p.type) {
        case 'dust': g.fillStyle = p.col; g.beginPath(); g.arc(x, y, p.r * (1.6 - k * 0.6), 0, 6.283); g.fill(); break;
        case 'smoke': g.globalAlpha = k * 0.35; g.fillStyle = p.col; g.beginPath(); g.arc(x, y, p.r * (2.2 - k), 0, 6.283); g.fill(); break;
        case 'spark': g.strokeStyle = p.col; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - p.vx * 0.03, y - p.vy * 0.03); g.stroke(); break;
        case 'ember': g.fillStyle = p.col; g.globalCompositeOperation = 'lighter'; g.beginPath(); g.arc(x, y, p.r * k + 0.6, 0, 6.283); g.fill(); g.globalCompositeOperation = 'source-over'; break;
        case 'glow': g.globalCompositeOperation = 'lighter'; var gr = g.createRadialGradient(x, y, 0, x, y, p.r * 3); gr.addColorStop(0, p.col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - p.r * 3, y - p.r * 3, p.r * 6, p.r * 6); g.globalCompositeOperation = 'source-over'; break;
        case 'ring': g.strokeStyle = p.col; g.lineWidth = 3 * k + 0.5; g.beginPath(); g.arc(x, y, p.r + (1 - k) * 70, 0, 6.283); g.stroke(); break;
        case 'petal': case 'leaf':
          g.save(); g.translate(x, y); g.rotate(p.rot); g.fillStyle = p.col; g.beginPath(); g.ellipse(0, 0, p.r * 1.6, p.r * 0.7, 0, 0, 6.283); g.fill(); g.restore(); break;
        case 'chip': g.save(); g.translate(x, y); g.rotate(p.rot); g.fillStyle = p.col; g.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2); g.restore(); break;
        case 'drop': g.fillStyle = p.col; g.beginPath(); g.arc(x, y, p.r, 0, 6.283); g.fill(); break;
        case 'star': g.fillStyle = p.col; g.globalCompositeOperation = 'lighter'; R.star4(g, x, y, p.r * (0.5 + k)); g.globalCompositeOperation = 'source-over'; break;
      }
    }
    g.globalAlpha = 1;
  };
  R.star4 = function (g, x, y, r) { g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r); g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill(); };
  // continuous screen-space weather
  R.weather = function (kind, dt, W, H, wind) {
    wind = wind || 0;
    var rate = { embers: 26, petals: 7, leaves: 10 + Math.abs(wind) * 0.06, mist: 1.2, stars: 2, dust: 6, rain: 80 }[kind] || 0;
    var n = rate * dt; if (Math.random() < n % 1) n = Math.ceil(n); else n = Math.floor(n);
    for (var i = 0; i < n; i++) {
      if (kind === 'embers') R.spawn('ember', Math.random() * W, H + 10, { screen: true, ang: -1.57, spread: 0.6, speed: 60 + Math.random() * 60, life: 3.5, r: 1.6, col: Math.random() < 0.5 ? '#ffb050' : '#ff6a2a' });
      else if (kind === 'petals') R.spawn('petal', Math.random() * W * 1.2, -10, { screen: true, ang: 1.9, spread: 0.6, speed: 40, life: 9, r: 3, col: ['#f6b6c8', '#ffe0a0', '#ffffff', '#f49a6a'][Math.floor(Math.random() * 4)] });
      else if (kind === 'leaves') R.spawn('leaf', wind < 0 ? W + 10 : -10, Math.random() * H * 0.8, { screen: true, ang: wind < 0 ? 3.0 : 0.25, spread: 0.5, speed: 120 + Math.abs(wind) * 0.8, life: 7, r: 4, col: ['#c8582a', '#e8a03a', '#9a3a1a', '#d8c04a'][Math.floor(Math.random() * 4)] });
      else if (kind === 'stars') R.spawn('star', Math.random() * W, Math.random() * H * 0.45, { screen: true, speed: 1, life: 2.5, r: 3, col: 'rgba(255,250,230,0.9)' });
      else if (kind === 'dust') R.spawn('dust', -10, H * (0.5 + Math.random() * 0.4), { screen: true, ang: -0.1, spread: 0.3, speed: 50, life: 10, r: 1.6, col: 'rgba(255,230,180,0.7)' });
      else if (kind === 'rain') R.spawn('drop', Math.random() * W, -12, { screen: true, ang: 1.35 + wind * 0.001, spread: 0.08, speed: 640, life: 0.7, r: 1.15, col: 'rgba(186,206,230,0.7)', g: 200 });
    }
  };

  // soft drifting fog bands (pre-rendered puff, no hard particle edges)
  var puff = null;
  R.fog = function (g, W, H, camX, t, y, a, col) {
    if (!puff) { puff = document.createElement('canvas'); puff.width = 256; puff.height = 96; var x = puff.getContext('2d'), gr = x.createRadialGradient(128, 48, 4, 128, 48, 120); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.save(); x.scale(1, 0.4); x.fillRect(0, 0, 256, 240); x.restore(); x.fillStyle = gr; x.fillRect(0, 0, 256, 96); }
    g.save(); g.globalAlpha = a || 0.35;
    var sp = 300, off = ((camX * 0.6 + t * 18) % sp + sp) % sp;
    for (var i = -1; i < W / sp + 2; i++) { var k = Math.sin(i * 3.7 + Math.floor((camX * 0.6 + t * 18) / sp) * 1.3); g.drawImage(puff, i * sp - off - 60, y - 40 + k * 14, 520, 150); }
    g.restore();
  };
  // ---------- light & grade ----------
  R.glow = function (g, x, y, r, col, a) {
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a == null ? 1 : a;
    var gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
  };
  R.vignette = function (g, W, H, a) {
    var gr = g.createRadialGradient(W / 2, H * 0.48, H * 0.35, W / 2, H * 0.5, W * 0.72);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(10,4,0,' + (a == null ? 0.5 : a) + ')');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  };
  R.shadow = function (g, x, y, w, a) { g.save(); g.fillStyle = 'rgba(10,5,0,' + (a || 0.35) + ')'; g.beginPath(); g.ellipse(x, y, w, w * 0.22, 0, 0, 6.283); g.fill(); g.restore(); };

  // ---------- UI widgets ----------
  R.rr = function (g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  R.panel = function (g, x, y, w, h, o) {
    o = o || {};
    g.save();
    R.rr(g, x, y, w, h, o.r || 14);
    var gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, o.c0 || 'rgba(40,18,10,0.86)'); gr.addColorStop(1, o.c1 || 'rgba(20,8,4,0.9)');
    g.fillStyle = gr; g.fill();
    g.lineWidth = o.lw || 2.5; var gb = g.createLinearGradient(x, y, x + w, y + h); gb.addColorStop(0, '#f6d77a'); gb.addColorStop(0.5, '#a8742a'); gb.addColorStop(1, '#f2cf6a');
    g.strokeStyle = o.stroke || gb; g.stroke();
    if (!o.plain) { R.rr(g, x + 5, y + 5, w - 10, h - 10, Math.max(4, (o.r || 14) - 4)); g.lineWidth = 1; g.strokeStyle = 'rgba(246,215,122,0.35)'; g.stroke(); }
    g.restore();
  };
  R.text = function (g, s, x, y, o) {
    o = o || {};
    g.font = R.font(o.size || 18, o.kind, o.bold); g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic';
    if (o.stroke !== false) { g.lineJoin = 'round'; g.lineWidth = o.sw || Math.max(3, (o.size || 18) / 5); g.strokeStyle = o.strokeCol || 'rgba(20,8,2,0.85)'; g.strokeText(s, x, y); }
    if (o.gold) { var gr = g.createLinearGradient(0, y - (o.size || 18), 0, y + 4); gr.addColorStop(0, '#fff3b8'); gr.addColorStop(0.45, '#f3c64e'); gr.addColorStop(1, '#a8661a'); g.fillStyle = gr; }
    else g.fillStyle = o.col || '#fff6e0';
    if (o.glow) { g.shadowColor = o.glow; g.shadowBlur = o.glowR || 16; }
    g.fillText(s, x, y); g.shadowBlur = 0;
  };
  R.wrap = function (g, s, maxW, size, kind) {
    g.font = R.font(size, kind); var words = String(s).split(' '), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) { var t = cur ? cur + ' ' + words[i] : words[i]; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  };
  R.button = function (g, b, hot) {
    g.save();
    var p = hot ? 1.04 : 1, w = b.w * p, h = b.h * p, x = b.x - (w - b.w) / 2, y = b.y - (h - b.h) / 2;
    R.rr(g, x, y, w, h, h / 2);
    var gr = g.createLinearGradient(0, y, 0, y + h);
    if (b.dim) { gr.addColorStop(0, 'rgba(70,50,40,0.85)'); gr.addColorStop(1, 'rgba(40,26,20,0.9)'); }
    else if (b.primary) { gr.addColorStop(0, '#ffd77a'); gr.addColorStop(0.5, '#f0a030'); gr.addColorStop(1, '#c0641a'); }
    else { gr.addColorStop(0, 'rgba(90,40,20,0.9)'); gr.addColorStop(1, 'rgba(50,20,10,0.92)'); }
    g.fillStyle = gr; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 10; g.shadowOffsetY = 3; g.fill();
    g.shadowBlur = 0; g.shadowOffsetY = 0; g.lineWidth = 2; g.strokeStyle = b.primary ? '#fff0b0' : '#e8b85a'; g.stroke();
    g.restore();
    R.text(g, b.label, b.x + b.w / 2, b.y + b.h / 2 + 1, { size: b.size || 19, align: 'center', base: 'middle', col: b.primary ? '#3a1404' : '#fff1d0', stroke: !b.primary, sw: 3 });
  };
  R.pip = function (g, x, y, r, full) {
    g.save(); g.translate(x, y);
    for (var k = 0; k < 5; k++) {
      g.save(); g.rotate(k * 1.2566 - 1.5708);
      g.beginPath(); g.ellipse(0, -r * 0.5, r * 0.32, r * 0.58, 0, 0, 6.283);
      g.fillStyle = full ? (k % 2 ? '#ff8fb0' : '#ffb6c8') : 'rgba(80,50,50,0.6)'; g.fill();
      g.lineWidth = 1; g.strokeStyle = full ? '#a83a5a' : 'rgba(0,0,0,0.4)'; g.stroke(); g.restore();
    }
    g.beginPath(); g.arc(0, 0, r * 0.22, 0, 6.283); g.fillStyle = full ? '#ffd76a' : '#554'; g.fill();
    g.restore();
  };
  R.starIcon = function (g, x, y, r, on) {
    g.save(); g.beginPath();
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    g.closePath();
    if (on) { var gr = g.createLinearGradient(0, y - r, 0, y + r); gr.addColorStop(0, '#fff2a0'); gr.addColorStop(1, '#e09a20'); g.fillStyle = gr; g.shadowColor = 'rgba(255,200,80,0.8)'; g.shadowBlur = 12; }
    else g.fillStyle = 'rgba(60,40,30,0.75)';
    g.fill(); g.shadowBlur = 0; g.lineWidth = 1.5; g.strokeStyle = on ? '#8a4a10' : 'rgba(200,160,100,0.5)'; g.stroke(); g.restore();
  };
  R.bar = function (g, x, y, w, h, v, col, back) {
    g.save(); R.rr(g, x, y, w, h, h / 2); g.fillStyle = back || 'rgba(20,10,5,0.7)'; g.fill();
    if (v > 0) { R.rr(g, x + 2, y + 2, Math.max(h - 4, (w - 4) * Math.min(1, v)), h - 4, (h - 4) / 2); var gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#fff'); gr.addColorStop(0.15, col); gr.addColorStop(1, col); g.fillStyle = gr; g.fill(); }
    R.rr(g, x, y, w, h, h / 2); g.lineWidth = 1.5; g.strokeStyle = '#d8a84a'; g.stroke(); g.restore();
  };
  R.iconPause = function (g, x, y, r) { g.fillStyle = '#fff1d0'; g.fillRect(x - r * 0.35, y - r * 0.4, r * 0.24, r * 0.8); g.fillRect(x + r * 0.11, y - r * 0.4, r * 0.24, r * 0.8); };
  R.iconSound = function (g, x, y, r, on) {
    g.fillStyle = '#fff1d0'; g.beginPath(); g.moveTo(x - r * 0.45, y - r * 0.18); g.lineTo(x - r * 0.2, y - r * 0.18); g.lineTo(x + r * 0.08, y - r * 0.42); g.lineTo(x + r * 0.08, y + r * 0.42); g.lineTo(x - r * 0.2, y + r * 0.18); g.lineTo(x - r * 0.45, y + r * 0.18); g.fill();
    g.strokeStyle = '#fff1d0'; g.lineWidth = 2;
    if (on) { g.beginPath(); g.arc(x + r * 0.1, y, r * 0.3, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(x + r * 0.1, y, r * 0.5, -0.9, 0.9); g.stroke(); }
    else { g.beginPath(); g.moveTo(x + r * 0.2, y - r * 0.25); g.lineTo(x + r * 0.55, y + r * 0.25); g.moveTo(x + r * 0.55, y - r * 0.25); g.lineTo(x + r * 0.2, y + r * 0.25); g.stroke(); }
  };
  // round touch button
  R.touchBtn = function (g, x, y, r, label, down, col) {
    g.save(); g.globalAlpha = down ? 0.95 : 0.62;
    var gr = g.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r); gr.addColorStop(0, col || 'rgba(255,220,150,0.55)'); gr.addColorStop(1, 'rgba(60,24,8,0.6)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * (down ? 0.94 : 1), 0, 6.283); g.fill();
    g.lineWidth = 2.5; g.strokeStyle = '#f2cf6a'; g.stroke();
    g.globalAlpha = down ? 1 : 0.85;
    R.text(g, label, x, y + 1, { size: r * (label.length > 2 ? 0.36 : 0.62), align: 'center', base: 'middle', sw: 3 });
    g.restore();
  };
  // ---------- vector fallback (only if a sprite fails to decode) ----------
  R.fallbackFigure = function (g, x, y, h, col, face) {
    g.save(); g.translate(x, y); g.scale(face || 1, 1);
    g.fillStyle = col || '#a0603a'; g.strokeStyle = '#1a0a04'; g.lineWidth = 3;
    g.beginPath(); g.ellipse(0, -h * 0.88, h * 0.09, h * 0.1, 0, 0, 6.283); g.fill(); g.stroke();
    R.rr(g, -h * 0.12, -h * 0.76, h * 0.24, h * 0.42, 8); g.fill(); g.stroke();
    g.fillRect(-h * 0.1, -h * 0.36, h * 0.08, h * 0.36); g.fillRect(h * 0.02, -h * 0.36, h * 0.08, h * 0.36);
    g.restore();
  };
  window.RPDArt = R;
})();
